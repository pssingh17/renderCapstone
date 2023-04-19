const sequelize = require('../database/DBConnection')
const {DataTypes} = require('sequelize')


const manufacturer = sequelize.define("manufacturer",{
  id:{
    type:DataTypes.STRING,
    primaryKey:true,
    allowNull:false
  },
  name:{
    type:DataTypes.STRING,
    allowNull:false
  },
  company_name:{
    type:DataTypes.STRING,
    allowNull:false
  },
  email:{
    type:DataTypes.STRING,
  },
  phone_number:{
    type:DataTypes.STRING,
  },
  created_at:{
    type:DataTypes.DATE
  }
},{
    tableName:'manufacturer',
    timestamps:false
})


//manufacturer.sync()

module.exports = manufacturer