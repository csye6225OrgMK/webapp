// import necessary modules
const fs = require('fs');
const csv = require('csv-parser');
const bcrypt = require('bcrypt');
const {User} = require('../model/model'); // Importing Sequelize model
const sequelize = require('../dbconnection'); // Importing  Sequelize instance
const SALT_ROUNDS = 10;

async function checkUserExists(email) {
  try {
    const existingUser = await User.findOne({ where: { email: email } });

    if (existingUser) {
      //console.log(`User with username '${email}' already exists.`);
      return true;
    } else {
      //console.log(`User with username '${email}' does not exist.`);
      return false;
    }
  } catch (error) {
    //console.error('Error checking user existence:', error);
    return false; // Handle the error as needed
  }
}


// Function to read and insert data from CSV to MySQL
async function importCSVData() {      // this is function to import data and create new user and add it to the database
  const results = [];
  fs.createReadStream('users.csv')    //change this path to opt/users.csv
    .pipe(csv())
    .on('data', async (row) => {
      // Hash the password before inserting it
      const hashedPassword = bcrypt.hashSync(row.password, SALT_ROUNDS); // Hash with bcrypt

      const userExists = await checkUserExists(row.email);

      if (!userExists) {
        // Create an object with the hashed password
        const userObject = {
          first_name: row.first_name,
          last_name: row.last_name,
          email: row.email,
          password: hashedPassword,
        };
        results.push(userObject);
      }
    })
    .on('end', async () => {
      try {
        await sequelize.sync(); // Create the table if it doesn't exist
        await User.bulkCreate(results, { ignoreDuplicates: true }); // Insert data into the User table and also skip inserting existing users
        //console.log(results);
        console.log('Data imported successfully.');
      } catch (error) {
        //console.error('Error importing data:', error.message);
        throw error;
      }
    });
}

const UserController = {

  updateUser:(req,res) => {
    res.set({'Cache-Control': 'no-cache, no-store, must-revalidate;', 
    'Pragma': 'no-cache',
    'X-Content-Type-Options': 'nosniff'})     
    res.removeHeader('X-Powered-By')
    res.removeHeader('Content-Type')
    res.status(405).json();               // Method not accepted
  },

  deleteUser:(req,res) => {
    res.set({'Cache-Control': 'no-cache, no-store, must-revalidate;', 
    'Pragma': 'no-cache',
    'X-Content-Type-Options': 'nosniff'})     
    res.removeHeader('X-Powered-By')
    res.removeHeader('Content-Type')
    res.status(405).json();               // Method not accepted
  },

  patchUser:(req,res) => {
    res.set({'Cache-Control': 'no-cache, no-store, must-revalidate;', 
    'Pragma': 'no-cache',
    'X-Content-Type-Options': 'nosniff'})     
    res.removeHeader('X-Powered-By')
    res.removeHeader('Content-Type')
    res.status(405).json();               // Method not accepted
  }

};


module.exports = { 
  importCSVData, 
  UserController};


