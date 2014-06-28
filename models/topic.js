'use strict';

module.exports = function( sequelize, DataTypes ) {
  var Topic = sequelize.define( 'Topic', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING( 70 ),
      allowNull: false,
      defaultValue: 'unnamed topic'
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    timestamps: true,
    paranoid: false,
    classMethods: {
      associate: function( models ) {
        Topic.belongsTo( models.User );
        Topic.hasMany( models.Task );
      }
    }
  });

  return Topic;
};
