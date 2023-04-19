const { Sequelize} = require('sequelize');
const cls = require('cls-hooked');
const DB_TRANSACTION_NAMESPACE = cls.createNamespace('capstone-db-transactions');



  const  sequelize = new Sequelize('capstone','capstoneadmin', 'D@ily20242024',{   
        host: 'cap.mysql.database.azure.com',
        dialect:'mysql',
        dialectOptions:{
          timezone:'local'
        }
      });
   
  Sequelize.useCLS(DB_TRANSACTION_NAMESPACE)    
    
      sequelize.authenticate().then(() => {
        console.log('Connection has been established successfully.');
     }).catch((error) => {
        console.error('Unable to connect to the database: ', error);
     });
     
    //  sequelize.sync().then(res=>{
    //   console.log("Synced")
    //  }).catch(err=>{
    //   console.log("error in syncing" + err)
    //  })


module.exports = sequelize