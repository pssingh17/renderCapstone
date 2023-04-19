const user = require('../models/User')
const alphanumeric = require('alphanumeric-id')
const bcrypt = require('bcrypt')
const manufacturer = require('../models/Manufacturer')
const Response = require('../service/customResponse')
const sequelize = require('../database/DBConnection')
const {Op} = require('sequelize')
const project = require('../models/Project')



async function saveUser(body){

   const savedUser = await sequelize.transaction(async (t) => {

         const savedUser = await user.create({
            id:(alphanumeric(2)+Math.floor(Math.random() * 1000000)+alphanumeric(2)).toUpperCase(),
            name:body.name,
            email:body.email,
            password:bcrypt.hashSync(body.password,10),
            phone_number:body.phone_number,
            is_engineer:body.is_engineer,
            is_reviewer:body.is_reviewer,
            agency_id:body.agency_id,
            lab_id:body.lab_id
        })

        return savedUser
   })

    return savedUser ? savedUser.id : null; 
}

async function getUserById(userId){
    return await user.findByPk(userId)
}

async function saveManufacturer(body){
    
    try{
        
        console.log(await manufacturer.findAll({raw:true}))
        var date = new Date()
        date.setMinutes(date.getMinutes()-date.getTimezoneOffset())
       
        const newMerchant = await sequelize.transaction(async (t) => {
            
            const newMerchant = await manufacturer.create({
                id:(alphanumeric(4)+Math.floor(Math.random() * 8000000)+alphanumeric(1)).toUpperCase(),
                name:body.name,
                company_name:body.company_name,
                email:body.email,
                phone_number:body.phone_number,
                created_at:date
            })

            return newMerchant
        })

        return new Response(200,"SUCCESS",`Manufacturer created successfully with id ${newMerchant.id}.`,{id:newMerchant.id})

    }catch(error){
        console.log("Saving Manufacturer || error is ==> " + JSON.stringify(error));
        return new Response(500,"FAILURE",'Error Occured while saving manufacturer.',"") 
    }
}


async function getProjectByManufactureNameOrId(name,id,userId){
     
   try{
    if(name){
        name = name.toLowerCase()
    }

    const result = await manufacturer.findAll({
        where:{
            [Op.or]:
            [
               {name:{[Op.like]:`${name}%`}},
               {name:{[Op.like]:`%${name}%`}},
               {name:{[Op.like]:`%${name}`}},
               {id:{[Op.eq]:`${id}`}}
            ]
        },
        attributes:['id','name','company_name'],
        include:{
               model:project,
               as:'projects_fk',
               attributes:['project_number','project_name'],
               where:{
                created_by:{[Op.eq]:userId}
               }
        }
    },{raw:true})

    let projects = []

    for(let i=0 ; i<result.length ; i++){
        const projects_fk = result[i].dataValues.projects_fk
        for(let j=0 ; j<projects_fk.length ; j++){
            projects.push(projects_fk[j].dataValues)
        }
    }
 
    return new Response(200,"SUCCESS","Manufacture Id and name search.",projects)
   }catch(error){
       console.log("User Dao || Getting Manufacture based on name and id " + error)
       return new Response(500,"FAILURE","Unknown error occured.",null)
   }

}



async function getManufactureNameOrId(name,id){
     
    if(!name && !id){
        return new Response(400,"SUCCESS","name and id field missing in req query params.",null)
    }

    try{
     if(name){
         name = name.toLowerCase()
     }
 
     const result = await manufacturer.findAll({
         where:{
             [Op.or]:
             [
                {name:{[Op.like]:`${name}%`}},
                {name:{[Op.like]:`%${name}%`}},
                {name:{[Op.like]:`%${name}`}},
                {id:{[Op.eq]:`${id}`}}
             ]
         },
         attributes:['id','name','company_name'],
     },{raw:true})
 
     return new Response(200,"SUCCESS","Manufacture Id and name search.",result)
    }catch(error){
        console.log("User Dao || Getting Manufacture based on name and id " + error)
        return new Response(500,"FAILURE","Unknown error occured.",null)
    }
 
 }


 async function getUserByNameOrId(name,id,indentityType){
     
    if(!name && !id){
        return new Response(400,"FAILURE","name and id field missing in req query params.",null)
    }

    let indentityFilter = {}
    switch(parseInt(indentityType)){
        case 1: {
            indentityFilter = {is_engineer:{[Op.eq]:true}}
            break;
        }
        case 2 : {
            indentityFilter = {is_reviewer:{[Op.eq]:true}}
            break;
        }
        case 3: {
            indentityFilter = {[Op.or] :[
                {is_engineer:{[Op.eq]:true}},
                {is_reviewer:{[Op.eq]:true}}
            ]}
            break;
        }
        default:{
            return new Response(400,"FAILURE","IndentityType field missing in req query params.",null)
        }
    }
     console.log(indentityFilter)
    try{
     if(name){
         name = name.toLowerCase()
     }
 
     const result = await user.findAll({
         where:{
             [Op.or]:
             [
                {name:{[Op.like]:`${name}%`}},
                {name:{[Op.like]:`%${name}%`}},
                {name:{[Op.like]:`%${name}`}},
                {id:{[Op.eq]:`${id}`}}
             ],
             [Op.and]:indentityFilter
         },
         attributes:['id','name','is_engineer','is_reviewer'],
     },{raw:true})
 
     return new Response(200,"SUCCESS","User Id and name search.",result)
    }catch(error){
        console.log("User Dao || Getting Manufacture based on name and id " + error)
        return new Response(500,"FAILURE","Unknown error occured.",null)
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
        limit:limit,
        offset:offset
    }
}


module.exports = {saveUser,getUserById,saveManufacturer,getProjectByManufactureNameOrId,
                 getManufactureNameOrId,getUserByNameOrId}