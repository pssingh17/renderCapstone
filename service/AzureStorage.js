const { BlobServiceClient, StorageSharedKeyCredential,ContainerClient
     } = require("@azure/storage-blob");
     const fs = require('fs')
     const reportService = require('./reportService')


const accountName = "capstoned";
const accountKey = "DRuhoJNVyxh58M+XRCACtAeHmdXqeboWLZs07NGbPxd7LJR50bfSUHYFU7xdmHd16+Ie1JHr8c7/+ASt/8jUNg==";


// Use StorageSharedKeyCredential with storage account and account key
// StorageSharedKeyCredential is only available in Node.js runtime, not in browsers
const sharedKeyCredential = new StorageSharedKeyCredential(accountName, accountKey);

async function getExistingContainer(containerName){
  try{
        const client = new ContainerClient(
          `https://${accountName}.blob.core.windows.net/${containerName}`,
          sharedKeyCredential
         )
         return client;

  }catch(error){
    console.log("Error in connecting to existing container with name " + containerName + " and error is " + error)
    throw error
  }  
}


function getBlobServiceClient(){
    return new BlobServiceClient(
        `https://${accountName}.blob.core.windows.net`,
        sharedKeyCredential
      )
}

async function createContainer(containerName){
 // Create a container
   try{
       const containerClient = getBlobServiceClient().getContainerClient(containerName);
       const createContainerResponse = await containerClient.create();
       console.log(`Created container ${containerName} successfully`, createContainerResponse.requestId);
       return containerClient;
   }catch(error){
    throw error
   }
}

async function getAllBlobs(containerName){
     
    try{
        const containerClient = getBlobServiceClient().getContainerClient(containerName)
        let i = 1;
        let blobs = containerClient.listBlobsFlat();
        for await (const blob of blobs) {
          console.log(`Blob ${i++}: ${blob.name}`);
        }

    }catch(error){
      console.log("Azure Storage || Error in traversing " + containerName + " and error is  " + error )
      throw error
    }
}

async function uploadBlob(file,containerName,blobName,containerClient){
   console.log("Uploading file with container Name " + containerName + " and blob name " + blobName) 
   //const readStream = fs.createReadStream(file.path)
    try{
      
      const blobOptions = {
            blobHTTPHeaders:{
                blobContentType:file.mimetype
            }
        }

      const blockBlobClient = containerClient.getBlockBlobClient(blobName)
      const blockBobResponse = await blockBlobClient.uploadFile(file.path,blobOptions)
      console.log("Uploaded File : " + JSON.stringify(blockBobResponse) + " in container " + containerName + " with name " + blobName)

   }catch(error){
        console.log("Azure Storage || File Creation error " + error)
        throw error
   }finally{
         // readStream.destroy()
          fs.unlink(file.path,(err)=>{
            console.log("Deleting uploaded file from local storage.")
            if(err){
              console.log("Error in deleting file from local storage " + err)
            }
          })
   }
}

async function downloadBlob(containerName,blobName,fileName){
  console.log("Request received to download file in the container " + containerName + " and blob " + blobName + ".")
   try{
     const containerClient = await getExistingContainer(containerName)
     const blobClient = containerClient.getBlobClient(blobName)
    return await blobClient.download()  
   }catch(error){
        console.log("Azure Storage || Download error " + error)
        throw error
   }
}

async function deleteContainer(containerName){
       
    try{
        const response = await getBlobServiceClient().deleteContainer(containerName)
        console.log("Delete container" + JSON.stringify(response))
    }catch(error){
        console.log("Azure Storage || Error in deleting blob container ==> " + error)
        throw error
    }
}

async function deleteBlob(blobName,containerName){

  try{
      const containerClient = await getExistingContainer(containerName)
      const deleteBlob = await containerClient.deleteBlob(blobName,{deleteSnapshots:"include"})
      console.info(deleteBlob)
  }catch(error){
    console.error("Error in deleting blob " + error)
    throw error
  }
}


module.exports = {getAllBlobs,uploadBlob,downloadBlob,deleteContainer,createContainer,getExistingContainer,deleteBlob}
