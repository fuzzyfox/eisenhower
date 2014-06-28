'use strict';

module.exports = function( sequelize, DataTypes ) {
  var User = sequelize.define( 'User', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    firstname: {
      type: DataTypes.STRING(35),
      allowNull: true,
      defaultValue: '',
      validate: {
        isAlpha: true
      }
    },
    lastname: {
      type: DataTypes.STRING(35),
      allowNull: true,
      defaultValue: '',
      validate: {
        isAlpha: true
      }
    },
    email: {
      type: DataTypes.STRING,
      validate: {
        isEmail: true
      },
      allowNull: false,
      unique: true,
    },
    lastLogin: {
      type: DataTypes.DATE,
    },
    isAdmin: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    sendEngagements: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    sendNotifications: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  }, {
    classMethods: {
      associate: function( models ) {
        User.hasMany( models.Task );
        User.hasMany( models.Topic );
      }
    }
  });

  return User;
};
