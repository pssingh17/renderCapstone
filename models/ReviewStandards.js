const sequelize = require('../database/DBConnection')
const {DataTypes} = require('sequelize')

const reviewStandards = sequelize.define('review_standards',{
   id:{
    type:DataTypes.INTEGER,
    autoIncrement:true,
    primaryKey:true
   },
   description:{
    type:DataTypes.TEXT
   },
   standard_type:{
    type:DataTypes.STRING,
    allowNull:false
   },
   standard:{
    type:DataTypes.STRING,
    allowNull:false
   }
},{ 
    timestamps:false,
    tableName:'review_standards'
}) 

//reviewStandards.sync()

module.exports = reviewStandards