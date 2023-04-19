const projectDao = require('../database/projectDao')
const userDao = require('../database/userDao')
const reportDao = require('../database/reportDao')
const Response = require('./customResponse')
const StatusType = require('../service/staticData/StatusType')
const reveiwerService = require('../service/reveiwerService')


async function saveProject(userId,body,res){
    if(!validateDates(body)){
       return res.
       json((new Response(400,"FAILURE","Dates are invalid. Start date must be smaller than end date / completion date.",null))
       .getErrorObject())
    }
     const response = await projectDao.saveProject(userId,body)
     return createResponse(response,res)
}

function validateDates(body){
     const {completion,start_date,end_date} = body
     const startDate = new Date(start_date)
     const endDate = new Date(end_date)
     const completionDate = new Date(completion)
    
    return startDate.getTime() < endDate.getTime() && startDate.getTime() < completionDate.getTime() ? true : false
}

function isEngineer(req){
    return req.user.is_engineer
}

async function getProjectsByName(userId,name,res,req){ 
    
    if(!isEngineer(req)){
        return reveiwerService.getReveiwerProjectsByName(req,res)
    }
    
    if(!name){
        return res.status(400).json((new Response(400,"SUCCESS","name field missing in req query params.",null).getErrorObject()))
    }
    const response = await projectDao.getProjectByName(name,null,userId)
    return createResponse(response,res)
}

async function getManufactureOrProjectInfo(req,res){

    if(!isEngineer(req)){
        return reveiwerService.searchForReveiwer(req,res)
    }

    const {projectId,reportId,name,id} = req.query

     console.log("Search API being called with " + req.query)

    if(!projectId && !reportId && !name && !id){
        return res.status(400).json((new Response(400,"SUCCESS","projectId or reportId or name or id fields missing in req query params.",null).getErrorObject()))
    }

    let response;
    let projectResult = null
    let reportResult= null
    let nameAndIdResult= null

    console.log("Get Request getManufactureOrProjectInfo ==> " + JSON.stringify(req.query))

    if(projectId){
        response = await projectDao.getProjectByName(null,projectId,req.user.userId)
        projectResult = response.getStatusCode() === 200 ? response.getData() : [];
    }

    if(reportId){
        response = await reportDao.getProjectLinkedToReports(reportId,req.user.userId)
        reportResult = response.getStatusCode() === 200 ? response.getData() : [];
    }

    if(name || id){
        response = await userDao.getProjectByManufactureNameOrId(name,id,req.user.userId)
        nameAndIdResult = response.getStatusCode() === 200 ? response.getData() : [];
    }

    console.log("Project")
    console.info(projectResult)
    console.log("Report")
    console.info(reportResult)
    console.log("Manufacturer")
    console.info(nameAndIdResult)
  
   let finalResult = mergeResults(projectResult,reportResult,nameAndIdResult)

   return res.json((new Response(200,"SUCCESS","Search Result",finalResult)).getSuccessObject())
}

function mergeResults(projectResult,reportResult,nameAndIdResult){
       
    if(projectResult && !reportResult && !nameAndIdResult){
        return projectResult
    }

    if(!projectResult && reportResult && !nameAndIdResult){
        return reportResult
    }

    if(!projectResult && !reportResult && nameAndIdResult){
        return nameAndIdResult
    }

    if(projectResult && reportResult && !nameAndIdResult){
         return merge(projectResult,reportResult) 
    }

    if(projectResult && !reportResult && nameAndIdResult){
         return merge(projectResult,nameAndIdResult)
    }

    if(!projectResult && reportResult && nameAndIdResult){
        return merge(reportResult,nameAndIdResult)
    }
    
    if(projectResult && reportResult && nameAndIdResult){
        let arr3 = merge(projectResult,reportResult)
        return merge(arr3,nameAndIdResult)
    }

}

function merge(arr1,arr2){
    
    if(arr1.length===0 || arr2.length===0){
       return []
    }
    let result = []
    arr1.map((item) => {
        let ele = arr2.find((item2) => item2.project_number === item.project_number)
        if(ele && ele.hasOwnProperty('project_number')){
             result.push(ele)
        }
})
    
    console.log("Merging result is : " + JSON.stringify(result))
    return result
}


async function getAllProjectInformation(req,res){

    const {id} = req.params
    const {screenId} = req.query
    console.log("Fetching data for the projectId : " + id)
     
    const response = await projectDao.getAllProjectInfo(id,screenId,req)
    return createResponse(response,res)
}


async function getNotifications(req,res){
    if(!isEngineer(req)){
        return reveiwerService.getReviwerNotifications(req,res)
    }
    const {limit,offset} = req.query
    const result = await projectDao.getEngineerLatestNotifications(req.user.userId,limit,offset)
    return createResponse(result,res)
}

async function getAllProjectsForAnEngineer(req,res){
    if(!isEngineer(req)){
        return reveiwerService.getAllProjectsOfReviwer(req,res)
    }
    const response = await projectDao.getAllProjects(req.user.userId)
    return createResponse(response,res)
}


function createResponse(response,res){
    if(response.getStatusCode() !== 200){
        return res.status(response.getStatusCode()).json(response.getErrorObject())
    }

    return res.json(response.getSuccessObject())
} 

module.exports = {saveProject,getProjectsByName,getManufactureOrProjectInfo,getAllProjectInformation,
                 getNotifications,getAllProjectsForAnEngineer,mergeResults,merge}