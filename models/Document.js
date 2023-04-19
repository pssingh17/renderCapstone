const sequelize = require('../database/DBConnection')
const {DataTypes} = require('sequelize')
const user = require('./User')
const report = require('./Report')
const documentType = require('./DocumentType')

const document = sequelize.define('report_documents',{
    file_id:{
        type:DataTypes.STRING,
        primaryKey:true,
        allowNull:false
    },
    original_file_name:{
        type:DataTypes.STRING,
        allowNull:false
    },
    storage_file_name:{
        type:DataTypes.STRING,
        allowNull:false
    },
    created_at:{
        type:DataTypes.DATE
    },
    updated_at:{
        type:DataTypes.DATE
    },
    type:{
        type:DataTypes.STRING
    },
    isDeleted:{
        type:DataTypes.BOOLEAN,
        allowNull:false,
        defaultValue:false
    } 
},{
    tableName:'report_documents',
    timestamps:false
})

document.belongsTo(user,{
    as:'submitted_by_fk',
    foreignKey:{
        name:"submitted_by",
        allowNull:false
    },
    onDelete:'CASCADE'
})

document.belongsTo(report,{
    as:'report_id_fk',
    foreignKey:{
        name:'report_id',
        allowNull:false
    },
    onDelete:'CASCADE'
})

report.hasMany(document,{
    as:'report_id_fk',
    foreignKey:{
        name:'report_id',
        allowNull:false
    },
    onDelete:'CASCADE'
})

document.belongsTo(documentType,{
    as:'document_type_fk',
    foreignKey:{
        name:'sub_type',
        allowNull:false
    },
    onDelete:'CASCADE'
})

documentType.hasMany(document,{
    as:'document_type_fk',
    foreignKey:{
        name:'sub_type',
        allowNull:false
    },
    onDelete:'CASCADE'
})


//document.sync({alter:true})

module.exports = document