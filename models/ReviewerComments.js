const sequelize = require('../database/DBConnection')
const {DataTypes} = require('sequelize')
const user = require('./User')
const report = require('./Report')

const comments = sequelize.define('reviewer_comments',{
  id:{
    type:DataTypes.INTEGER,
    autoIncrement:true,
    primaryKey:true
  },
  comment:{
    type:DataTypes.TEXT,
  },
  recommendations:{
    type:DataTypes.TEXT
  },
  created_at:{
    type:DataTypes.DATE,
    allowNull:false
  }
},{
    timestamps:false,
    tableName:'reviewer_comments'
})

comments.belongsTo(user,{
    as:'reviewer_id_fk',
    foreignKey:{
        name:'reviewer_id',
        allowNull:false
    }
})

comments.belongsTo(report,{
    as:'comments_fk',
    foreignKey:{
        name:'report_id',
        allowNull:false
    }
})

report.hasMany(comments,{
    as:'comments_fk',
    foreignKey:{
        name:'report_id',
        allowNull:false
    }
})

//comments.sync()


module.exports = comments