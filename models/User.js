const db = require('../database/DBConnection')
const {DataTypes} = require('sequelize')


const user = db.define("user",{
    id:{
        type:DataTypes.STRING,
        allowNull:false,
        primaryKey:true
    },
    name:{
        type:DataTypes.STRING,
        allowNull:false
    },
    password :{
        type:DataTypes.STRING,
        allowNull:false
    },
    email:{
        type:DataTypes.STRING,
        allowNull:false
    },
    phone_number:{
        type:DataTypes.STRING,
    },
    is_engineer:{
        type:DataTypes.BOOLEAN,
        defaultValue:false
    },
    is_reviewer:{
        type:DataTypes.BOOLEAN,
        defaultValue:false
    },
    agency_id:{
        type:DataTypes.STRING
    },
    lab_id:{
        type:DataTypes.STRING
    }
},{
    tableName:"user",
    timestamps:false
})

//user.sync()

module.exports = user
