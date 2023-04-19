const {app,express} = require('./configuration/server')
const userRoutes = require('./routes/login')
const projectRoutes = require('./routes/projectRoutes')
const reportRoute = require('./routes/reportRoutes')
const fs = require('fs')
const { dirname } = require('path')
const appDir = dirname(require.main.filename)
const path = require('path')
console.log("path : " + appDir)
const os = require('os')

console.log(" OS "+os.tmpdir())

app.use(express.static(path.join(__dirname, "./client/build")))

app.use('/user',userRoutes)
app.use('/project',projectRoutes)
app.use('/report',reportRoute)

async function createStaticFolders(){
   try{
    const staticFiles = fs.readdirSync(path.join(appDir,'/static'),{withFileTypes:true})
    staticFiles.forEach((file)=>fs.unlinkSync(path.join(appDir,'/static',`/${file.name}`)))
    const downloadedFiles=fs.readdirSync(path.join(appDir,'/downloads'),{withFileTypes:true})
    downloadedFiles.forEach((file)=>fs.unlinkSync(path.join(appDir,'/downloads',`/${file.name}`)))
   }catch(error){
          fs.mkdirSync('static/',{mode:0777})
          fs.mkdirSync('downloads/',{mode:0777})
   }
}

//createStaticFolders()

app.get("/*", function (req, res) {
  res.sendFile(path.resolve(__dirname, './client/build', 'index.html'));
})

app.listen(8081,()=>{
    console.log("Server up and running at port 8081.")
})