
const { DataTypes } = require('sequelize');
const sequelize = require('../dbconnection');
//const { Sequelize, DataTypes } = require('sequelize');
//require('dotenv').config();

// const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
//   host: process.env.DB_HOST,
//   dialect: 'mysql',
//   logging: false
// });


const User = sequelize.define('User',{
    
uuid: {
    type: DataTypes.STRING, // Change the data type to STRING
    allowNull: true, // Allow 'id' to be nullable
    defaultValue: null, // Set a default value (null in this case)
    },
first_name:{
    type:DataTypes.STRING,
    allowNull:false,
    // primaryKey: true, // Ensure 'id' is not nullable
},
last_name:{
    type:DataTypes.STRING,
    allowNull:false
},
email:{
    type:DataTypes.STRING,
    allowNull:false
},
password:{
    type:DataTypes.STRING,
    allowNull:false,
    writeOnly:true
},
account_created:{
    type:DataTypes.DATE, //Shouldn't this be DATE? In ui it is mentioned as String
    readOnly:true,
    allowNull:false,
    defaultValue:sequelize.fn('NOW')
},
account_updated:{
    type:DataTypes.DATE,        //Shouldn't this be DATE? In ui it is mentioned as String
    readOnly:true,
    allowNull:false,
    defaultValue:sequelize.fn('NOW')
}
},
{
    hooks:{
        beforeCreate:(user,options) => {
            userCreatedAt = new Date();
            userUpdatedAt = new Date();
        },
        beforeUpdate:(user,options) => {
            userUpdatedAt = new Date();
        }
    }
},
{
   timestamps:false 
}
);


User.beforeCreate(async (user) => {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(user.password, saltRounds);
    user.password = hashedPassword;
  });



const Assignment = sequelize.define('Assignment',{
uuid: {
    type: DataTypes.STRING, // Change the data type to STRING
    allowNull: true, // Allow 'id' to be nullable
    defaultValue: null, // Set a default value (null in this case)
    },
name:{
    type:DataTypes.STRING,
    allowNull:false,
    // primaryKey: true
},
points:{
    type:DataTypes.INTEGER,
    allowNull:false,
    validate:{
        min:1,
        max:100
    }
},
num_of_attemps:{
    type:DataTypes.INTEGER,
    allowNull:false,
    validate:{
        min:1,
        max:100
    }
},
deadline:{                  
    type:DataTypes.STRING,
    allowNull:false
},
assignment_created:{
    type:DataTypes.DATE,        //Shouldn't this be DATE? In ui it is mentioned as String
    readOnly:true,
    allowNull:false,
    defaultValue:sequelize.fn('NOW')
},
assignment_updated:{
    type:DataTypes.DATE,        //Shouldn't this be DATE? In ui it is mentioned as String
    readOnly:true,
    allowNull:false,
    defaultValue:sequelize.fn('NOW')
}
},
{
    timestamps:false 
}
);


// User.hasMany(Assignment, {foreignKey:'id'});
// Assignment.belongsTo(User,{foreignKey:'id'});

sequelize.authenticate()
  .then(() => {
    
    console.log('Creating tables ...');
    sequelize.sync().then(() => {

        console.log('Tables created per model');
    })
    .catch(err => {
        console.error('Unable to create tables ...',err);    
    })
  })
  .catch(err => {
    console.error('Unable to connect to the database ...',err);
});

console.log(User == sequelize.models.User);
console.log(Assignment == sequelize.models.Assignment);

module.exports = {User, Assignment}
