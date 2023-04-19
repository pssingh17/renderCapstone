const { BlobServiceClient, StorageSharedKeyCredential,ContainerClient
} = require("@azure/storage-blob");
const fs = require('fs')
const { dirname } = require('path')
const appDir = dirname(require.main.filename)
const path = require('path')

console.log(appDir)

const accountName = "capstoned";
const accountKey = "DRuhoJNVyxh58M+XRCACtAeHmdXqeboWLZs07NGbPxd7LJR50bfSUHYFU7xdmHd16+Ie1JHr8c7/+ASt/8jUNg==";

const sharedKeyCredential = new StorageSharedKeyCredential(accountName, accountKey);

async function getExistingContainer(containerName){
  try{
        const client = new ContainerClient(
          `https://${accountName}.blob.core.windows.net/${containerName}`,
          sharedKeyCredential
         )
         return client;

  }catch(error){
    console.log("Error in connecting to existing container with name " + containerName + " and error is " + error)
  }  
}

async function uploadBlob(filePath,containerName,blobName,containerClient){
    console.log( "FILE " + filePath + " Uploading file with container Name " + containerName + " and blob name " + blobName) 
 
     try{
       const blobOptions = {
             blobHTTPHeaders:{
                 blobContentType:'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
             }
         }
 
       const blockBlobClient = containerClient.getBlockBlobClient(blobName)
       const blockBobResponse = await blockBlobClient.uploadFile(filePath)
       console.log("Uploaded File : " + JSON.stringify(blockBobResponse) + " in container " + containerName + " with name " + blobName)
 
    }catch(error){
         console.log("Azure Storage || File Creation error " + error)
         throw error
    }
 }

async function main(){
   try{
        const filePath = path.join(appDir,'/RelevantJobPosting.docx') 
        console.log(filePath)
        const containerClient = await getExistingContainer("y0g1859531ujc")
        const containerName = "y0g1859531ujc"
        const blobName = "y0g1859531ujc_certificate"
        
        const response = await uploadBlob(filePath,containerName,blobName,containerClient)

   }catch(error){
      console.error(error)
   }

}



const metaInfo = ['report','project_info']
const validColums = ['report_name','receiving_customer','reviewer_id','products_covered','models','comments','project_name','project_type']
const reportId = '4BC8047866MS8'

const body = {

  metaInfo:'report',
  data:{
    report_name:'report-MS1998',
    products_covered:'IFCAI',
    models:'Mid version 2.3',
    comments:'More Detailing required'
  },
  where:reportId
}

function updateReport(body){
      
  if(!metaInfo.includes(body.metaInfo)){
         console.info("Wrong MetaInfo")
         return
  }

  const validKeys = (key) => validColums.includes(key)
  const result = Object.keys(body.data).every(validKeys)

  if(!result){
    console.info("Invalid keys.")
    return
  }

  let length = Object.keys(body.data).length
  if(length===0){
    console.info("Length 0")
    return
  }
  let query
  let iter=1

  if(body.metaInfo==='report'){
       query = `update report set`
  }else{
      query = `update project_info p inner join report r on p.project_number=r.project_number set`
  }

  for(let rel in body.data){
  
    const col = `${rel} = '${body.data[rel]}'`
    if(iter===1){
      query=query.concat(' ').concat(col)
    }else{
      query=query.concat(',').concat(' ').concat(col)
    }
    iter++;
  }

  let condition
  if(body.metaInfo==='report'){
    condition = `where report_number='${body.where}'`
}else{
  condition = `where r.report_number='${body.where}'`
}

  query = query.concat(' ').concat(condition)
  console.info(query)
}

//updateReport(body)


const updateKeyChecks = {
  report : ['report_name','receiving_customer','reviewer_id','products_covered','models','comments'],
  project_info: ['project_name','project_type']
}
let meta = 'report'
const validKeys = (key) => Object.keys(updateKeyChecks)
const list = ['receiving_customer']
const ans = list.every((key) => updateKeyChecks[meta].includes(key))
console.info("ANs : " + ans)


