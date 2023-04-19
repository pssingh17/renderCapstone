const sequelize = require('../database/DBConnection')
const {DataTypes} = require('sequelize');
const session = require("express-session")
var SequelizeStore  = require("connect-session-sequelize")(session.Store);
const user = require('./User').sync()

sequelize.define("session", {
    sid: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    userId: {
        type:DataTypes.STRING
    },
    expires: {
        type:DataTypes.DATE
    },
    data: {
        type:DataTypes.TEXT
    },
    created_at : {
        type:DataTypes.DATE
    }
  },{
    timestamps:false
  });

  function extendDefaultFields(defaults, session) {
    return {
      data: defaults.data,
      expires: defaults.expires,
      userId: session.passport.user.userId,
      created_at: session.passport.user.created_at
    };
  }

  const sessionStore = new SequelizeStore({
    db: sequelize,
    table: "session",
    extendDefaultFields: extendDefaultFields,
  });

  module.exports = sessionStore

  