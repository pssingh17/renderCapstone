const express = require('express');
const cors = require('cors')
const session = require("express-session")
const sessionStore = require('../models/Session')
const passport = require('passport')
const cookieParser = require('cookie-parser')
const multer = require('multer')
const {dirname}  = require('path')
const path  = require('path')
const appDir = dirname(require.main.filename)
const alphanumeric = require('alphanumeric-id')
const os = require('os')

const app = express()

const validMimeTypes = ["application/vnd.openxmlformats-officedocument.wordprocessingml.document",
"application/msword","application/vnd.ms-excel","application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"]

const storage = multer.diskStorage({
  // destination: function(req,file,cb){
  //   cb(null,os.tmpdir())
  // },
  filename:function(req,file,cb){
    console.log(file.mimetype)
    cb(null,alphanumeric(9)+file.originalname)
  }
})


const upload = multer({
  storage:storage,
  fileFilter:function(req,file,cb){
      const valid = validMimeTypes.filter(mime => mime.toLowerCase() === file.mimetype.toLowerCase())
      console.log("In file filter")
      if(valid.length===0){
          return cb(null,false)
      }
      
      cb(null,true)
  },
  preservePath:""
}) 


app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())
app.use(cors({
  credentials:true,
  origin:["http://localhost:3000","http://localhost:8081"," https://curious-apron-elk.cyclic.app","https://alphacoderz.cyclic.app"],
  optionsSuccessStatus:200
}))
app.set("trust proxy", 1);


app.use(
    session({
      secret: '478269814c199935d534702359a6330baf1113940da72d4b996e29062df1c2c5c04ccaf930329df14667afcb833acebd2a390836d6590311e56640e964f6ca4c',
      store: sessionStore,
      resave: false,
      saveUninitialized:false,
      cookie : {maxAge : 1000 * 60 * 60 ,httpOnly:true}
    })
  );


app.use(passport.initialize())
app.use(passport.session())
app.use(passport.authenticate('session'))

//sessionStore.sync()

module.exports = {express,app,passport,upload,multer}