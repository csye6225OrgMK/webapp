const Sequelize = require("sequelize");
require('dotenv').config();
const sequelize = new Sequelize(
    process.env.DB_NAME, //DB_name
    process.env.DB_USERNAME, //DB_user_name
    process.env.DB_PASSWORD, //DB_password
    
    // 'csye6225',
    // 'root',
    // '',
   {
     host: process.env.DB_host, //DB_host
     dialect: 'mysql',//DB
     logging: false // to avoid line 'Executing (default): SELECT 1+1 AS result'
   }
 );
 module.exports = sequelize;