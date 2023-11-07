const Sequelize = require("sequelize");
require('dotenv').config();
const logger = require('./logger');
// console.log(process.env.DB_NAME,process.env.DB_USERNAME,process.env.DB_PASSWORD,process.env.DB_HOST);

const sequelize = new Sequelize(
    process.env.DB_NAME, //DB_name
    process.env.DB_USERNAME, //DB_user_name
    process.env.DB_PASSWORD, //DB_password

   {
     port: process.env.PORT,
     host: process.env.DB_HOST, //DB_host
     dialect: 'mysql',//DB
     logging: false // to avoid line 'Executing (default): SELECT 1+1 AS result'
   }
 );
 module.exports = sequelize;