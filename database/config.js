const { Sequelize } = require('sequelize');

//parámetros de conexión MySQL con sequelize
const sequelize = new Sequelize(process.env.DB_NAME, process.env.USER_NAME, process.env.PASSWORD, {
    host: process.env.HOST,
    dialect: 'mysql',
    define: {
        timestamps: false //para evitar errores por no tener columnas con timestamps en BD
    }
});

const dbConnection = async() => {

    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }

};

module.exports = {
    dbConnection,
    sequelize
};