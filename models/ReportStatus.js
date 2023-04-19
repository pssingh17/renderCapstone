const db = require('../database/DBConnection')
const {DataTypes} = require('sequelize')

const reportStatus = db.define('status_type',{
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
    tableName:'status_type',
    timestamps:false
})

//reportStatus.sync({alter:true})

module.exports = reportStatus