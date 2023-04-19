const project = require('../models/Report')
const document = require('../models/Document')
const reviewStandardsMapping = require('../models/ReviewStandardsMapping')
const reportDao = require('../database/reportDao')
const userDao = require('../database/userDao')
const Response = require('../service/customResponse')
const sequelize = require('../database/DBConnection')
const azureStorage = require('../service/AzureStorage')
const BadRequestError = require('../service/errors/BadRequestError')
const reportStatus = require('../models/ReportStatus')
const fs = require('fs')
const IllegalStateError = require('./errors/IllegalStateError')
const { dirname } = require('path')
const appDir = dirname(require.main.filename)
const path = require('path')
const reveiwerService = require('../service/reveiwerService')
const FileType = require('../service/staticData/FileType')
const os = require('os')
const reviewStandardTypes = require('../service/staticData/ReviewsStandardTypes')
const alphanumeric = require('alphanumeric-id')

const updateKeyChecks = {
    report : ['report_name','receiving_customer','reviewer_id','products_covered','models','comments'],
    project_info: ['project_name','project_type']
}


function validateRequest(req){
  const {report_name,receiving_customer,reviewer_id,project_number} = req.body

  return !(report_name&&receiving_customer&&reviewer_id&&project_number)

}

async function saveReport(req,res){

    const {hasReport=false, hasCertificate = false,report_type,certificate_type} = req.body

    try{
       
      if((hasReport && !FileType.isDocumentTypeValid(report_type)) || (hasCertificate && !FileType.isDocumentTypeValid(certificate_type))){
        return res.status(400).json((new Response(400,"FALIURE",
        "report_type or/and certificate_type is invalid.",null)).getErrorObject())
      } 
        
      if(validateRequest(req)){
        return res.status(400).json((new Response(400,"FALIURE",
        "report_name,receiving_customer,reviewer_id,project_number are required fields. Some or all are missing",null)).getErrorObject())
      }

      const result  = await sequelize.transaction(async (t1)=>{
            const userId = req.user.userId
            console.log('userid ' + userId)
            const {receiving_customer,reviewer_id} = req.body

            const receivingPerson = await userDao.getUserById(receiving_customer)
            if(!receivingPerson){
                throw new BadRequestError('Receiving Person is not a registered user.')
            }
            const reviewerPerson = await userDao.getUserById(reviewer_id) // check if the person is a reviewer or not
            if(!reviewerPerson){
                throw new BadRequestError('Reviewer Person is not a registered user.')
            }
                                                                  
            if( !verifyDocumentsStatus(hasReport,req.files['report'],report_type) || !verifyDocumentsStatus(hasCertificate,req.files['certificate'],certificate_type)){

                console.log("File's submission is not correct hasReport " + hasReport + " report " + req.files['report']
                + " hasCertificate " + hasCertificate + " certificate  " + req.files['certificate']) 

                throw new BadRequestError('Missing files report/certificate. Either File size is too large , or incorrect extension or file is not added in the request.')
            }

            const {reviewIds} = req.body
            let reviewStandardList = null

            if(reviewIds){
                reviewStandardList = reviewIds.split(',')
                if(! await reviewStandardTypes.validateReviewIds(reviewStandardList)){
                    throw new BadRequestError('Invalid Review Standard Ids.')
                }
            }

            const {issued_at} = req.body
            const issuedAt = new Date(issued_at)
            console.log(issuedAt)
            if(issuedAt.getTime() > (new Date().getTime())){
                throw new BadRequestError('Issued At Date must be less than or equal to current date.')
            }

            const response = await reportDao.saveReport(req.body,userId,(hasReport || hasCertificate))

            console.log(response)
        
            if(response.getStatusCode() === 200){
               
                const containerName = (response.data.id).toLowerCase()
                const files = {
                    "report" : hasReport,
                    "certificate" : hasCertificate
                }
                let containerClient = null

                if(hasReport || hasCertificate){
                    containerClient =  await azureStorage.createContainer(containerName)
                }

                Object.keys(files).map(async (key) => {
                    
                    if(files[key]){
                        const blobName = containerName+"_" +key
                        await azureStorage.uploadBlob(req.files[key][0],containerName,blobName,containerClient)
                        const docResponse = await reportDao.saveDocument(userId,response.data.id,key,blobName,req.files[key][0].originalname,key.toLowerCase()==="report"?report_type:certificate_type)
                        if(docResponse.getStatusCode() !== 200){
                                    if(req.files['report']){
                                        deleteFilesFromLocal(req.files['report'][0].path)
                                    }
                        
                                    if(req.files['certificate']){
                                         deleteFilesFromLocal(req.files['certificate'][0].path)
                                    }
                            throw new IllegalStateError("Unknown error occured")
                        }
                    }
                })

                
                if(reviewIds){
                    const reviewStandardResponse = await reportDao.createReportStandards(response.data.id,reviewStandardList)
                    if(reviewStandardResponse.getStatusCode() !== 200){
                        throw new IllegalStateError("Unknown error occured")
                    }
                }  

            }else{
                console.log("Report could not be saved for creator with id " + userId)
                            if(req.files['report']){
                                deleteFilesFromLocal(req.files['report'][0].path)
                            }
                
                            if(req.files['certificate']){
                                deleteFilesFromLocal(req.files['certificate'][0].path)
                            }
                throw new IllegalStateError('Unknown new error occured.')
            }

            return {report_number : response.data.id}

      })
      
       console.log("Outside of the transaction.")
       return res.json((new Response(200,"SUCCESS",`Report created successfully with id ${result.report_number}`,{
        id : result.report_number
      })).getSuccessObject())

    }catch(error){

        console.log("ReportService || Error in saving report : " + error)
        console.log(error)

        if(req.files['report']){
            deleteFilesFromLocal(req.files['report'][0].path)
        }

        if(req.files['certificate']){
            deleteFilesFromLocal(req.files['certificate'][0].path)
        }

        if(error instanceof BadRequestError){
             return res.status(400).json((new Response(error.statusCode,error.status,error.message,null)).getErrorObject())
        }
        
        return res.json(( new Response(500,"FAILURE",`Unknown error occured.`,null)).getErrorObject())
    }
}

function verifyDocumentsStatus(isPresent,file,type){

    let docStatus = false

    if(isPresent){
             if(file && type){
                  docStatus = true
             }else{
                docStatus = false
             }
    }else{
        docStatus = true
    }
    
    return docStatus
}


function isEngineer(req){
    return req.user.is_engineer
}

async function getReportsWithStatusCount(req,res){
   if(!isEngineer(req)){
    return reveiwerService.getReveiwerWorkStatus(req,res)
   }
   const response = await reportDao.getReportsWithStatusCount(req.user.userId)
   return createResponse(response,res)
}


async function downloadDocumentRelatedToReport(fileId,res){
    
    const response = await reportDao.getDocumentBasedOnFileId(fileId)
    if(response.getStatusCode() !== 200){
        return res.json(response.getErrorObject())
    }
    
    if(!response.getData()){
        return res.status(400).json((new Response(400,"FAILURE","Invalid fileId. No data exist.",null)).getErrorObject())
    }

    const report = response.data
    const containerName = (report.report_id).toLowerCase()
    const blobName = report.storage_file_name
    const fileName = blobName+report.original_file_name
    console.log("Root " + os.tmpdir())
    const filePath =  path.join(os.tmpdir(),`${fileName}`)
    const readStream = await azureStorage.downloadBlob(containerName,blobName,filePath)
    // setTimeout(()=>{
    //       deleteFilesFromLocal(filePath)
    // },10000)
    //res.attachment(`${report.original_file_name}`);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')
    res.setHeader('Content-Disposition', `attachment; fileName=${report.original_file_name}`)
    return await readStream.readableStreamBody.pipe(res)
}

async function updateDocument(req,res){

    try{
        console.log(req.body)
        const {doc_id,sub_type} = req.body

        if(!req.file || !FileType.isDocumentTypeValid(sub_type) || !doc_id){
            return res.status(400).json((new Response(400,"FAILURE","Either File is missing/mimetype not allowed/bigger than 25MB or document type is invalid or doc_id is missing.",null)).getErrorObject()) 
        }
    
        const response = await reportDao.getDocumentBasedOnDocId(doc_id)
        if(response.getStatusCode() === 500){
              return res.status(500).json(response.getErrorObject())
        }
    
        const document = response.data
        if(!document){
            return res.status(400).json((new Response(400,"FAILURE","Invalid doc_id. No data exists.",null)).getErrorObject())
        }
         
        const containerName = (document.report_id).toLowerCase()
        const blobName = document.storage_file_name
        const originalFileName = req.file.originalname
        console.dir({containerName,blobName,originalFileName,doc_id,sub_type})

        const updatedResponse = await sequelize.transaction(async (t1) => {
               const containerClient = await azureStorage.getExistingContainer(containerName)
               await azureStorage.uploadBlob(req.file,containerName,blobName,containerClient)
               const updateResponse = await reportDao.updateDocument(doc_id,originalFileName,sub_type)
               if(updateResponse.getStatusCode() === 500){throw new IllegalStateError("Error in updating Document.")}
               console.info(updateResponse)
               return updateResponse
        })

        return res.json((new Response(200,"SUCCESS",`Updated document linked to id ${doc_id}.`,updatedResponse)).getSuccessObject())

    }catch(error){

        if(!req.file){
            deleteFilesFromLocal(req.file.path)
        }
        console.error("Error in updating existing document " + error)
        return res.json(( new Response(500,"FAILURE",`Unknown error occured.`,"")).getErrorObject())
    }
}

async function deleteDocument(req,res){
   
    try{
        const {report_id,doc_id} = req.body
        if(!report_id || !doc_id){
            return res.status(400).json((new Response(400,"FAILURE","report_id and/or doc_id missing in request body.",null)).getErrorObject())
        }

        const response = await reportDao.getDocumentsCountRelatedToReport(report_id)
        if(response.getStatusCode() === 500){
            return res.status(500).json(response.getErrorObject())
        }

        let count = null
        const rows = response.data.rows
        
        if(!rows){
            return res.status(400).json((new Response(400,"FAILURE","report_id is invalid, No Data Exist.",null)).getErrorObject())
        }

        if(rows.length === 1){
            if(rows[0]['report_id_fk.file_id']){ count=1 }
        }else{ count=2 }

        console.info(rows)
        console.info(`Documents linked with reportId ${report_id} are ${count}.`)
        if(!count || isNaN(count)){
            return res.status(400).json((new Response(400,"FAILURE","No document is linked to this report_id.",null)).getErrorObject())
        }

        const document = rows.filter((row) => row['report_id_fk.file_id']=== doc_id)
        console.info(document)
        if(!document){
            return res.status(400).json((new Response(400,"FAILURE","Invalid doc_id. No data exists.",null)).getErrorObject())
        }

        let deleteResponse=null
        if(count === 1){
            deleteResponse =  await reportDao.deleteDocument(doc_id,report_id)
        }else{
            deleteResponse = await reportDao.deleteDocument(doc_id,null)
        }
      
        return res.json((new Response(200,"SUCCESS",`Document deleted with doc_id ${doc_id} linked to report_id ${report_id}.`,deleteResponse)).getSuccessObject())
    }catch(error){
        console.error("Error in deleting existing document " + error)
        return res.json(( new Response(500,"FAILURE",`Unknown error occured.`,null)).getErrorObject())
    }

}


async function deleteFilesFromLocal(path){
    fs.unlink(path,(err)=>{
        console.log("Deleting uploaded file from local storage.")
        if(err){
          console.log("Error in deleting file from local storage " + err)
        }
      })
}

async function getAllInformationByReportId(reportId,res){
    const response = await reportDao.getAllInformationByReportId(reportId)
    return createResponse(response,res)
}

async function updateReportInfo(body,res){
  
   try{
    if(!updateKeyChecks.hasOwnProperty(body.metaInfo)){
        console.error("Wrong MetaInfo")
        return res.status(400).json((new Response(400,"FAILURE","MetaInfo value is invalid.",null)).getErrorObject())
    }

    console.log(body)

    const result = Object.keys(body.data).every((key) => updateKeyChecks[body.metaInfo].includes(key))
 
    if(!result){
    console.info("Invalid keys.")
    return res.status(400).json((new Response(400,"FAILURE","Data fields are invalid.Update Process existed.",null)).getErrorObject())
    }
  
    let length = Object.keys(body.data).length
    if(length===0){
    console.info("Length 0")
    return res.status(400).json((new Response(400,"FAILURE","No fields available in the request to be processed.",null)).getErrorObject())
    }
    
    let iter=1
    let query = body.metaInfo==='report' ? `update report set`:
    `update project_info p inner join report r on p.project_number=r.project_number set`
    

    for(let rel in body.data){
    if(!body.data[rel] || body.data[rel].length === 0 || body.data[rel] === 'undefined'){
        return res.status(400).json((new Response(400,"FAILURE","Values are empty/undefined for the fields to be updated.",null)).getErrorObject())
    }
    let col = body.metaInfo==='report' ?  `${rel} = '${body.data[rel]}'`: `p.${rel} = '${body.data[rel]}'`
    
    query = iter===1 ? query.concat(' ').concat(col) : query.concat(',').concat(' ').concat(col)
    iter++;
    }

    let condition = body.metaInfo==='report' ?  `, updated_at=? where report_number='${body.where}'`
                   : `, p.updated_at=? where r.report_number='${body.where}'`
    

    query = query.concat(' ').concat(condition)
    console.info(query)
    const response  = await reportDao.updateReport(query)
    return createResponse(response,res)
   }catch(error){
       console.error("Error updating the report " + error)
       return res.json(( new Response(500,"FAILURE",`Unknown error occured.`,"")).getErrorObject()) 
   }

}

async function addAdditionalDocuments(req,res){
     
    try{
        if(!isEngineer(req)){
            return res.status(401).json((new Response(400,"FAILURE","Only engineer is allowed to add additional Docs.",null)).getErrorObject())  
        }

        const {reportId} = req.body
        if(!reportId){
          return res.status(400).json((new Response(400,"FAILURE","reportId missing in the request body.",null)).getErrorObject())    
        }
  
     
        const response = await reportDao.getReportBasedOnReportId(reportId)
        if(response.getStatusCode()!==200){
          return res.status(400).json((new Response(400,"FAILURE","ReportId missing in the request body.",null)).getErrorObject()) 
        }
  
        const containerName = reportId.toLowerCase()
        const blobName = containerName+"_"+"additional"+"_"+alphanumeric(7)
        const containerClient = await azureStorage.getExistingContainer(containerName)
        await azureStorage.uploadBlob(req.file,containerName,blobName,containerClient)
        const saveDocResult = await reportDao.saveDocument(req.user.userId,reportId,"additional",blobName,req.file.originalname,6) 
        if(saveDocResult.getStatusCode() !== 200){
            return res.json(( new Response(500,"FAILURE",`Error in saving additional Document.`,"")).getErrorObject())
        }   
        
        console.log("Container name : " + containerName + " and blob Name is : " + blobName)
        
        return res.json((new Response(200,"SUCCESS",`Additional document added successfully for reportId ${reportId}.`,saveDocResult.getData()))
        .getSuccessObject())
    }catch(error){
        fs.unlink(req.file.path,(err)=>{
            if(err){
                console.error("Error in deleting files from local " + err)
                return
            }
            console.log("Files deleted from local successfully.")
        })
        console.error("Error adding new Document to the report " + error)
        return res.json(( new Response(500,"FAILURE",`Unknown error occured.`,"")).getErrorObject())
    }
}

async function getAllReportReviewStandards(res){
    const response = await reportDao.getAllReportReviewStandards()
    createResponse(response,res)
}


function createResponse(response,res){
    if(response.getStatusCode() !== 200){
        return res.status(response.getStatusCode()).json(response.getErrorObject())
    }

    return res.json(response.getSuccessObject())
} 

module.exports = {saveReport,getReportsWithStatusCount,deleteFilesFromLocal,downloadDocumentRelatedToReport,
                 updateDocument,deleteDocument,getAllInformationByReportId,updateReportInfo,getAllReportReviewStandards,
                 addAdditionalDocuments}







