const project = require('../models/Project')
const report = require('../models/Report')
const Response = require('../service/customResponse')
const {Op} = require('sequelize') 
const { QueryTypes } = require('sequelize');
const sequelize = require('../database/DBConnection')
const statusType = require('../service/staticData/StatusType')

async function getReveiwerProjectsByName(userId,name,req){

    console.log("Reveiwer Id is : " + userId)
    const {limit,offset} = getLimitAndOffset(req)
    try{
        let query = `SELECT distinct(p.project_number), p.project_name FROM project_info p INNER JOIN report r ON 
        p.project_number = r.project_number AND r.reviewer_id = ? WHERE (p.project_name LIKE ? OR 
        p.project_name LIKE ? OR p.project_name LIKE ?) limit ? offset ?`

        const result = await sequelize.query(query,{
            replacements:[userId,`%${name}`,`%${name}%`,`${name}%`,limit,offset],
            raw:false,
            type:QueryTypes.SELECT
        })

        console.log(result)

        return new Response(200,"SUCCESS",`Projects related to reveviwer ${userId}`,result)

    }catch(error){
         console.log("Error in getting project names for the reveviewer ==> " + error)
         return new Response(500,"FAILURE",`Unknown error occured.`,null)
    }
}

async function searchForReveiwer(req){

    const {projectId,reportId,name,id} = req.query
    const {limit,offset} = getLimitAndOffset(req)
    const userId = req.user.userId
    if(!projectId && !reportId && !name && !id){
        return new Response(400,"FAILURE","projectId,reportId,name or id required in request query",null)
    }
     
    try{
       let query=null
       let replacements=null
       let projectResult = null
       let reportResult= null
       let nameAndIdResult= null

       if(projectId){
         query=`SELECT distinct(p.project_number), p.project_name FROM project_info p INNER JOIN report r ON 
         p.project_number = r.project_number AND r.reviewer_id = ? WHERE (p.project_number LIKE ? OR 
         p.project_number LIKE ? OR p.project_number LIKE ?) limit ? offset ?`
         replacements=[userId,`%${projectId}`,`%${projectId}%`,`${projectId}%`,limit,offset]
         projectResult = await executeRawQuery(query,replacements)
       } 
       
       if(reportId){
        query=`SELECT distinct(p.project_number), p.project_name FROM project_info p INNER JOIN report r ON 
        p.project_number = r.project_number AND r.reviewer_id = ? WHERE (r.report_number LIKE ? OR 
        r.report_number LIKE ? OR r.report_number LIKE ?) limit ? offset ?`
        replacements=[userId,`%${reportId}`,`%${reportId}%`,`${reportId}%`,limit,offset]
        reportResult =  await executeRawQuery(query,replacements)
       }
       
       if(name || id){
        query=`select distinct(p.project_number), p.project_name from project_info p inner join manufacturer m on 
        p.transacting_customer=m.id inner join report r on p.project_number = r.project_number where (
        r.reviewer_id = ? and  (m.name like ? or m.name like ? or m.name like ? or m.id like ? or
        m.id like ? or m.id like ?)) limit ? offset ?`
        replacements=[userId,`%${name}`,`%${name}%`,`${name}%`,`%${id}`,`%${id}%`,`${id}%`,limit,offset]
        nameAndIdResult =  await executeRawQuery(query,replacements)
       }
      
       const finalResult = mergeResults(projectResult,reportResult,nameAndIdResult)
      
       return new Response(200,"SUCCESS","Search Result",finalResult)
    }catch(error){
        console.log("Error in search api for the reveiwer ==> ",error)
        return new Response(500,"FAILURE",`Unknown error occured.`,null)
    }
}

async function executeRawQuery(query,replacements){
    return await sequelize.query(query,{
                                replacements:replacements,
                                raw:true,
                                type:QueryTypes.SELECT
                            })
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

async function getReviwerNotifications(userId,req){

    const {limit,offset} = getLimitAndOffset(req)
    const {screenId=4,fetchAll} = req.query
    console.log("ScreenId " + screenId + " and fetchAll flag is : " + fetchAll) 
     
    let statusIds = []
    if(fetchAll && fetchAll.toLowerCase()==='true'){
        statusIds = await statusType.getAllStatusIds()
    } else {
        statusIds.push(screenId)
    }
    
    try{
     let query = ` select r.report_number , r.report_name ,  r.tags ,
     p.project_number , p.project_name , p.receiving_customer ,u.name as 'receiving_customer_name',
     r.created_by , eu.name as 'engineer_name' , 
     r.reviewer_id , ur.name as 'reviewer_name', r.status_id , st.name as 'status_type' from report r 
    inner join project_info p on r.project_number = p.project_number inner join status_type st on r.status_id = st.id
    inner join user u on u.id = p.receiving_customer
    inner join user eu on eu.id = r.created_by
    inner join user ur on ur.id = r.reviewer_id
    where r.reviewer_id=? and status_id in (?) and r.is_saved=true limit ? offset ?`

     const result = await sequelize.query(query,{
        replacements:[userId,statusIds,limit,offset],
        raw:true,
        type:QueryTypes.SELECT
     })
    
     return new Response(200,"SUCCESS",`Notification for reviewer with id ${userId}.`,result)
    }catch(error){
        console.log("Error in notification api for the reveiwer ==> ",error)
        return new Response(500,"FAILURE",`Unknown error occured.`,null)
    }
}

async function getReveiwerWorkStatus(userId,req){

  try{
    let query = `select count(*) as 'count' , r.status_id as 'statusId' , s.name as 'statusName' from report r inner join 
    status_type s on r.status_id = s.id where r.reviewer_id=? group by status_id`

    const result = await sequelize.query(query,{
        replacements:[userId],
        raw:true,
        type:QueryTypes.SELECT
    })

    return new Response(200,"SUCCESS",`Report status count for reveiwer id ${userId}.`,result)

  }catch(error){
        console.log("Error in Reveiwer Work Status api  ==> ",error)
        return new Response(500,"FAILURE",`Unknown error occured.`,null)
  }


}

async  function getAllProjectsLinkedToReviewer(userId){
    
    try{
        let query = ` select distinct(p.project_number),p.project_name from project_info p inner join  report r on r.project_number = p.project_number 
        where r.reviewer_id=?`

        const result = await sequelize.query(query,{
              replacements:[userId],
              raw:true,
              type:QueryTypes.SELECT
        })

        return new Response(200,"SUCCESS",`Projects of Reviewer with id ${userId}.`,result)

    }catch(error){
        console.error("Error in fetching reviewer projects " + error)
        return new Response(500,"FAILURE",`Unknown error occured.`,null)
    }
}

function getLimitAndOffset(req){

    let {limit,offset} = req.query

    if(!limit || isNaN(limit)){
        limit = 10
    }

    if(!offset || isNaN(offset)){
        offset=0
    }
    
    return {
        limit:parseInt(limit),
        offset:parseInt(offset)
    }
}


module.exports = {getReveiwerProjectsByName,searchForReveiwer,getReviwerNotifications,getReveiwerWorkStatus,
                  getAllProjectsLinkedToReviewer}
