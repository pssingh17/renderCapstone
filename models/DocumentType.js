const sequelize = require('../database/DBConnection')
const {DataTypes} = require('sequelize')

const documentType = sequelize.define('document_type',{
  id:{
    type:DataTypes.INTEGER,
    autoIncrement:true,
    allowNull:false,
    primaryKey:true
  },
  name:{
    type:DataTypes.STRING,
    allowNull:false
  }

},{
    timestamps:false,
    tableName:'document_type'
})

//documentType.sync()

module.exports = documentType
