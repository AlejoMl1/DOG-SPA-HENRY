const { DataTypes } = require("sequelize");

module.exports = function (sequelize){
  return sequelize.define("Dogs", {
    id: { 
        type: DataTypes.UUID, 
        defaultValue: DataTypes.UUIDV4, 
        allowNull:false,
        primaryKey: true 
    },
    name: { 
        type: DataTypes.STRING, 
        allowNull: false, unique: true
     },
    height: { 
        type: DataTypes.STRING ,
        allowNull: false 
    },
    weight: { 
        type: DataTypes.STRING, 
        allowNull: false
     },
    life_span: { 
        type: DataTypes.STRING 
    },
    image_url: {
        type: DataTypes.STRING,
        allowNull: true
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
      }
    },
     {
      timestamps: false,
      freezeTableName: true
    }
  )};
