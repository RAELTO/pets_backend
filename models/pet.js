
const { Sequelize, DataTypes } = require('sequelize');

//Importación de parámetros de conexión MySQL con sequelize
const { sequelize } = require('../database/config');

const Pet = sequelize.define('pets', {
    id: {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    race_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    age: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    type_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: null,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    status: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    img: {
        type: DataTypes.STRING,
    }
}, {
    // Other model options go here
});

  // `sequelize.define` also returns the model
  console.log(Pet === sequelize.models.Pet); // true

module.exports = Pet;
