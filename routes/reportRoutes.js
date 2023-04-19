const {express,upload,multer, app} = require('../configuration/server')
const fs = require('fs')
const reportService = require('../service/reportService')
const azureStorage = require('../service/AzureStorage')
const {dirname}  = require('path')
const path  = require('path')
const appDir = dirname(require.main.filename)
const reportStatus = require('../models/ReportStatus')
const reviewerService = require('../service/reveiwerService')
const {body,validationResult} = require('express-validator')
const Response = require('../service/customResponse')
const inputRegex = new RegExp(/^[ A-Za-z0-9_,%$-]*$/)


const reportRoute = express.Router()
const reportUpload = upload.fields([{name:'report',maxCount:1},{name:'certificate',maxCount:1}])
const editUpload = upload.single('file')

reportRoute.all('*',(req,res,next)=>{
     return req.isAuthenticated() ?
     next() :  
     res.status(401).json({status:"FAILURE",message:"Please LogIn.",isLoggedIn:false})
})

function isEngineer(req,res,next){
      return req.user.is_engineer?
             next():
             res.json((new Response(200,"FAILURE","Person Signed in, is not an engineer.",null).getErrorObject()))
  }
  
reportRoute.get('/',async (req,res)=> {
      return await reportService.getReportsWithStatusCount(req,res)
})

reportRoute.post('/additional/doc',editUpload,async (req,res) => {
      console.log(req.file)
      return await reportService.addAdditionalDocuments(req,res)
})

reportRoute.post('/',reportUpload,isEngineer,[
      body("tags","Field Required").notEmpty().matches(inputRegex).withMessage("Invalid characters used in specifying the value of the required field."),
      body("comments","Field Required").notEmpty().matches(inputRegex).withMessage("Invalid characters used in specifying the value of the required field."),
      body("products_covered","Field Required").notEmpty().matches(inputRegex).withMessage("Invalid characters used in specifying the value of the required field."),
      body("models","Field Required").notEmpty().matches(inputRegex).withMessage("Invalid characters used in specifying the value of the required field."),
      body("report_name","Field Required").notEmpty().matches(inputRegex).withMessage("Invalid characters used in specifying the value of the required field."),
],async (req,res)=>{ 

      const errors = validationResult(req);
      if(!errors.isEmpty()){
        return res.status(400).json((new Response(400,"FAILURE","Validation Errors",{ errors: errors.array() })).getSuccessObject());
      }
      
      console.log(req.files['report'])
      return await reportService.saveReport(req,res)
})

reportRoute.get('/download/:fileId',async(req,res)=>{
      return await reportService.downloadDocumentRelatedToReport(req.params.fileId,res)
})

reportRoute.put('/upload',editUpload,async(req,res)=>{
       return await reportService.updateDocument(req,res)
})

reportRoute.put('/delete',async (req,res)=>{
      return await reportService.deleteDocument(req,res)
})

reportRoute.post('/decision',async (req,res)=>{
   return await reviewerService.recordDecision(req,res)
})

reportRoute.post('/update',async (req,res) => {
      return await reportService.updateReportInfo(req.body,res)
})

reportRoute.get('/:id',async (req,res)=>{
      const {id} = req.params
      return await reportService.getAllInformationByReportId(id,res)
})

reportRoute.get('/review/standards',async (req,res)=>{
      return await reportService.getAllReportReviewStandards(res)
})


module.exports = reportRoute

// decision
// report_id

// comments

// deleteBlob  ==> fileId(delete),reportId // if file count 0 
//                                          delete the container/update documents_uploaded=false in reports table
//                                   else
//                                          delete the blob

// updateBlob ==> fileId,subType==>blob(update)
 