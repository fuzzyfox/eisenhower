'use strict';

module.exports = function( sequelize, DataTypes ) {
  var Task = sequelize.define( 'Task', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'unnamed task'
    },
    notes: {
      type: DataTypes.TEXT
    },
    url: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isUrl: true
      }
    },
    icon: {
      type: DataTypes.STRING(100),
      allowNull: true,
      defaultValue: 'square-o',
      validate: {
        is: ['^[a-z-]+$', 'i'] // crude regexp to match font-awesome icon names
      }
    },
    coordX: {
      type: DataTypes.FLOAT,
      allowNull: true,
      defaultValue: null,
      validate: {
        min: -100,
        max: 100
      }
    },
    coordY: {
      type: DataTypes.FLOAT,
      allowNull: true,
      defaultValue: null,
      validate: {
        min: -100,
        max: 100
      }
    },
    state: {
      type: DataTypes.ENUM,
      allowNull: false,
      defaultValue: 'pending',
      values: [
        'incomplete',
        'complete',
        'pending',
        'abandoned',
        'ongoing'
      ]
    }
  }, {
    timestamps: true,
    paranoid: true,
    classMethods: {
      associate: function( models ) {
        Task.belongsTo( models.User );
        Task.belongsTo( models.Topic );
      }
    }
  });

  return Task;
};
