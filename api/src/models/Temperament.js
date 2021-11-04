const { DataTypes } = require('sequelize');

//create the table of temperaments
module.exports = (sequelize) => {
  // defino el modelo
  sequelize.define('Temperaments', {
    // id: {
    //   type: DataTypes.UUID,
    //   defaultValue: DataTypes.UUIDV4, 
    //   primaryKey: true,
    //   allowNull:false
    // },
    id:{
      type: DataTypes.INTEGER, 
      // defaultValue: DataTypes.UUIDV4, 
      unique:true,
      autoIncrement : true,
      allowNull:false,
      primaryKey: true 
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
      timestamps: false,
      freezeTableName: true
  });
};