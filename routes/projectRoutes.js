const {express} = require('../configuration/server')
const projectMethods = require('../service/projectService')
const  {check,validationResult} = require('express-validator') 
const Response = require('../service/customResponse')
const FileType = require('../service/staticData/FileType')
const StatusType = require('../service/staticData/StatusType')
const inputRegex = new RegExp(/^[ A-Za-z0-9_,%$-]*$/)

const projectRoute = express.Router()

projectRoute.all('*',(req,res,next)=>{
    return req.isAuthenticated() ?
    next() :  
    res.status(401).json({status:"FAILURE",message:"Please LogIn.",isLoggedIn:false})
})

function isEngineer(req,res,next){
    return req.user.is_engineer?
           next():
           res.json((new Response(401,"FAILURE","Person Signed in, is not an engineer.",null).getErrorObject()))
}

projectRoute.post('/save',isEngineer,[
    check("project_type","Field Required").notEmpty().matches(inputRegex).withMessage("Invalid characters used in specifying the value of the required field."),
    check("project_name","Field Required").notEmpty().matches(inputRegex).withMessage("Invalid characters used in specifying the value of the required field."),
    check("client_ready","Field Required").isDate(),
    check("completion","Field Required").isDate(),
    check("start_date","Field Required").isDate(),
    check("end_date","Field Required").isDate(),
    check("receiving_customer","Field Required").notEmpty(),
    check("transacting_customer","Field Required").notEmpty(),
    check('lab_name').matches(inputRegex).withMessage("Invalid characters used in specifying the value of the required field."),
    check('description').matches(inputRegex).withMessage("Invalid characters used in specifying the value of the required field."),
    check('purchase_order_number').matches(inputRegex).withMessage("Invalid characters used in specifying the value of the required field."),
    check('product_covered').matches(inputRegex).withMessage("Invalid characters used in specifying the value of the required field."),
    check('modals').matches(inputRegex).withMessage("Invalid characters used in specifying the value of the required field."),
],async (req,res)=>{
      const errors = validationResult(req);
      if(!errors.isEmpty()){
        return res.status(400).json((new Response(400,"FAILURE","Validation Errors",{ errors: errors.array() })).getSuccessObject());
      }
      return await projectMethods.saveProject(req.user.userId,req.body,res)
})

projectRoute.get('/',async (req,res)=> {
   const {name} = req.query
   return await projectMethods.getProjectsByName(req.user.userId,name,res,req)
})

projectRoute.get('/search',async(req,res)=>{
    return await projectMethods.getManufactureOrProjectInfo(req,res)
})

projectRoute.get('/notifications',async (req,res)=>{
    return await projectMethods.getNotifications(req,res)
})

projectRoute.get('/all',async (req,res)=>{
    return projectMethods.getAllProjectsForAnEngineer(req,res) 
 })

projectRoute.get('/:id',async (req,res)=>{
    return await projectMethods.getAllProjectInformation(req,res)
})

projectRoute.get('/status/types',async(req,res)=>{
     return res.json((new Response(200,"SUCCESS","Status Types",await FileType.getFileTypes())).getSuccessObject())
})

projectRoute.get('/document/types',async (req,res)=>{
    return res.json((new Response(200,"SUCCESS","Status Types",await StatusType.getAllStatusTypes())).getSuccessObject())
})

module.exports = projectRoute