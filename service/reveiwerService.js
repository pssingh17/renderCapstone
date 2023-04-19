const reviewerDao = require('../database/reveiwerDao')
const reportDao = require('../database/reportDao')
const Response = require('../service/customResponse')
const statusType = require('./staticData/StatusType')

async function getReveiwerProjectsByName(req,res){
     const {name} = req.query
     if(!name){
        return res.status(400).json((new Response(400,"FAILURE","name field required in request query.",null)).getErrorObject())
     }
     const response = await reviewerDao.getReveiwerProjectsByName(req.user.userId,name,req)
     return createResponse(response,res)
}

async function searchForReveiwer(req,res){
   const response = await reviewerDao.searchForReveiwer(req)
   return createResponse(response,res)
}

async function getReviwerNotifications(req,res){
    const response = await reviewerDao.getReviwerNotifications(req.user.userId,req)
    return createResponse(response,res)
}

async function getReveiwerWorkStatus(req,res){
    const response = await reviewerDao.getReveiwerWorkStatus(req.user.userId,req)
    return createResponse(response,res)
}

async function recordDecision(req,res){
    if(!isReviewer(req)){
        return res.status(400).json((new Response(400,"FAILURE","Logined Person is not a reviewer.",null)).getErrorObject())
    }
    const {status_id,report_id,comment,recommendations} = req.body
    if(isNaN(status_id) || !statusType.validateStatusType(status_id) || !report_id){
        return res.status(400).json((new Response(400,"FAILURE","status_id or report_id are missing/wrong.",null)).getErrorObject())
    }
    const response = await reportDao.recordReviewerDecision(status_id,report_id)
    if((comment && comment.length >0)  || (recommendations && recommendations.length>0)){
         reportDao.addCommentsToTheReport(req.body,req.user.userId)
    }
    return createResponse(response,res)
}

async function registerReviewerComment(req,res){
    const {report_id,comment} = req.body
}

async function getAllProjectsOfReviwer(req,res){
    const response  = await reviewerDao.getAllProjectsLinkedToReviewer(req.user.userId)
    return createResponse(response,res)
}

function isReviewer(req){
    return req.user.is_reviewer
}

function createResponse(response,res){
    if(response.getStatusCode() !== 200){
        return res.status(response.getStatusCode()).json(response.getErrorObject())
    }
    return res.json(response.getSuccessObject())
} 

module.exports = {getReveiwerProjectsByName,searchForReveiwer,getReviwerNotifications,getReveiwerWorkStatus,
                  recordDecision,registerReviewerComment,getAllProjectsOfReviwer}