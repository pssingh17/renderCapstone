const sequelize = require('../database/DBConnection')
const {DataTypes} = require('sequelize');
const user = require('./User')
const manufacturer = require('./Manufacturer')

const project = sequelize.define("project_info",{
     lab_name:{
        type:DataTypes.STRING
        },
    project_type:{
        type:DataTypes.STRING,
        allowNull:false
        },
    project_number:{
        type:DataTypes.STRING,
        allowNull:false,
        primaryKey:true
        },
    project_name:{
        type:DataTypes.STRING,
        allowNull:false
        },
    description:{
        type:DataTypes.TEXT
        },
    purchase_order_number:{
        type:DataTypes.STRING
        },
    product_covered:{
        type:DataTypes.STRING
        },
    modals:{
        type:DataTypes.STRING
        },
    client_ready:{
        type:DataTypes.DATEONLY
        },
    completion:{
        type:DataTypes.DATEONLY
        },
    start_date:{
        type:DataTypes.DATEONLY
        },
    end_date:{
        type:DataTypes.DATEONLY
        },
    created_at:{
       type:DataTypes.DATE
    },
    updated_at:{
      type:DataTypes.DATE
    }     
},{
    tableName:'project_info',
    timestamps:false
})

project.belongsTo(user,{
    as:'receiving_customer_fk',
    foreignKey:{
        name:'receiving_customer',
        allowNull:false
    }
})

project.belongsTo(user,{
    as:'created_by_fk',
    foreignKey:{
        name:'created_by',
        allowNull:false
    },
    onDelete:'CASCADE'
})

project.belongsTo(manufacturer,{
    as:'projects_fk',
    foreignKey:{
        name:'transacting_customer',
        allowNull:false
    }
})

manufacturer.hasMany(project,{
    as:'projects_fk',
    foreignKey:{
        name:'transacting_customer',
        allowNull:false
    }
})

//project.sync()

module.exports = project