const sequelize = require('../database/DBConnection')
const {DataTypes} = require('sequelize')
const report = require('./Report')
const reviewStandards = require('./ReviewStandards')

const reviewStandardsMapping = sequelize.define('report_standards_mapping',{},{ 
    timestamps:false,
    tableName:'report_standards_mapping'
})


report.belongsToMany(reviewStandards,{through:reviewStandardsMapping,
    uniqueKey:'report_standard_unique',
    foreignKey:{
        name:'report_id'
    }})
reviewStandards.belongsToMany(report,{through:reviewStandardsMapping
    ,uniqueKey:'report_standard_unique',
    foreignKey:{
        name:'standard_id'
    }})

//reviewStandardsMapping.sync()

module.exports = reviewStandardsMapping