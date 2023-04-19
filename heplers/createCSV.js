const fs = require('fs')
const { dirname } = require('path')
const appDir = dirname(require.main.filename)
console.log("appDir  : " + appDir)

function createCSV(projects){

    let fileData = []
    let rowNumber=0
    let header=''

    for(let project of projects){
        let row=''
        let count=0;
        
        for(let key in project){

            if(count==0){
                row += project[key].toString()
                if(rowNumber==0){
                    header += key
                }
            }else{
                row += "," + project[key].toString()
                if(rowNumber==0){
                    header += "," + key
                }
            }
            count++
        }// inner for loop....
        if(rowNumber==0){
            fileData.push(header)
        }
        rowNumber++
        fileData.push(row)
        
    }// outer for loop....

   try{  
    
         fs.writeFileSync( appDir + '/static/file.csv',fileData.join("\n"),{encoding:'utf8'})
         setTimeout(()=>{
            fs.unlink(appDir + '/static/file.csv',(err) => {
                if (err) {
                    throw err;
                }
                console.log("Deleted File successfully.");
            });
         },10000)
   }catch(error){
    console.log("Error while creating CSV " + error)
   }
    

}

module.exports = {createCSV}