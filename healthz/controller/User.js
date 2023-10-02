// import necessary modules
const fs = require('fs');
const csv = require('csv-parser');
const bcrypt = require('bcrypt');
const {User,Assigment} = require('../model/model'); // Importing Sequelize model
const sequelize = require('../dbconnection'); // Importing  Sequelize instance


// Function to read and insert data from CSV to MySQL
async function importCSVData() {
  const results = [];
  fs.createReadStream('users.csv') // Change this path to /opt/user.csv
    .pipe(csv())
    .on('data', (row) => {
      results.push(row);
    })
    .on('end', async () => {
      try {
        await sequelize.sync(); // Create the table if it doesn't exist
        await User.bulkCreate(results); // Insert data into the User table
        console.log(results);
        console.log('Data imported successfully.');
      } catch (error) {
        console.error('Error importing data:', error.message);
        // Handle the error as needed, e.g., rethrow or return
        throw error;
      }
    });
}

importCSVData(); // Export the function to start the import process

