const LocalStrategy = require('passport-local').Strategy
const {passport} = require('../configuration/server')
const db = require('../database/userDao')
const bcrypt = require('bcrypt')
const {express} = require('../configuration/server')
const jwt = require('jsonwebtoken');
const key = "478269814c199935d534702359a6330baf1113940da72d4b996e29062df1c2c5c04ccaf930329df14667afcb833acebd2a390836d6590311e56640e964f6ca4c"


const loginApp = express.Router()


passport.use(new LocalStrategy({usernameField:'userId',passwordField:'password'},async function(username,password,cb){
        
    const user = await db.getUserById(username)

    if(!user){
        return cb(null,false)
    }   
    
    const comparePassword = bcrypt.compareSync(password,user.password)

    if(!comparePassword){
        return cb(null,false)
    }

    cb(null,user)
}
))


passport.serializeUser(function(user,cb){
    process.nextTick(function(){
        var date = new Date()
        date.setMinutes(date.getMinutes() - date.getTimezoneOffset())
        return cb(null,{
            userId:user.id,
            created_at:date,
            is_engineer:user.is_engineer,
            is_reviewer:user.is_reviewer
        })
    })
})

passport.deserializeUser(function(user,cb){
    process.nextTick(async function(){
        console.log("IN deserialize and user is : " + JSON.stringify(user))
         const existingUser = await db.getUserById(user.userId)
         if(!existingUser){
            console.log("In deserializing no user with id " + user.userId)
            return cb(null,false)
         }
         console.log("In deserilizing user authenticated....")
         return cb(null,user)
    })
})


function authenticate(req,res,next){
    return req.isAuthenticated() ?
    next() :  
    res.status(401).json({status:"FAILURE",message:"Please LogIn.",isLoggedIn:false})
}


loginApp.post('/signUp',async (req,res)=>{
   
    const newUser = await db.saveUser(req.body)
    if(!newUser){
      return res.status(500).json({status:"FAILURE",message:"User creation failed."})
    }
    return res.json({status:"SUCCESS",message:`User created with userId ${newUser}.`})
})




loginApp.post('/login',passport.authenticate('local'),(req,res)=>{  
      req.session.save()
      //res.header('Access-Control-Allow-Origin','http://localhost:3000')
     
      res.header('Access-Control-Allow-Origin','http://localhost:3000')
      res.header('Access-Control-Allow-Credentials', 'true');
      res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
      res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
      console.log("Cookie",req.cookies)
      console.log("O",req.headers.origin)
      console.log("H",req.headers.host)
      console.log("L",req.headers.location)
      res.json({status:"SUCCESS",message:"User is Logged in.",data:{...req.session.passport.user,isLoggedIn:true}})
})

loginApp.post('/logout',authenticate,(req,res)=>{    
     req.session.destroy(function(err){
        res.clearCookie("connect.sid")
        if(err){
            console.log(err)
        }
        return res.json({status:"SUCCESS",message:"User logout successfully."})
     })
})


loginApp.get('/',authenticate,(req,res)=>{
  res.json({status:"SUCCESS",userId:req.session.passport})  
})


loginApp.post('/merchant',authenticate,async (req,res)=>{
    const response =  await db.saveManufacturer(req.body)
    return createResponse(response,res)   
})

loginApp.get('/merchant',authenticate,async (req,res)=>{
    const {name,id} = req.query
    const response = await db.getManufactureNameOrId(name,id);
    return createResponse(response,res)
})

loginApp.get('/search',authenticate,async (req,res)=>{
    const {name,id,indentityType} = req.query
    const response = await db.getUserByNameOrId(name,id,indentityType);
    return createResponse(response,res)
})

function createResponse(response,res){
    if(response.getStatusCode() === 200){
        return res.json(response.getSuccessObject())
    }
    res.json(response.getErrorObject())
}

   

module.exports = loginApp






