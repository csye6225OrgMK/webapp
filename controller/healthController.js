const sequelize = require('../dbconnection')  // imports the db connection

const healthController = {
  getItems:(req, res) => {
    //console.log({param: req.query});
    if (Object.keys(req.body).length !== 0 || Object.keys(req.query).length !== 0) {
      console.log({body: req.body});
      return res.status(400).json();
   }
      res.set({'Cache-Control': 'no-cache, no-store, must-revalidate;', 
      'Pragma': 'no-cache',
      'X-Content-Type-Options': 'nosniff'})     
      res.removeHeader('X-Powered-By')
      res.removeHeader('Content-Type')
      sequelize.authenticate().then(() => { 
      return res.status(200).json();        // status is okay
    }).catch((err) => {
      return res.status(503).json();       // service unavailable
    })
  },

  createItem:(req,res) => {
    res.set({'Cache-Control': 'no-cache, no-store, must-revalidate;', 
    'Pragma': 'no-cache',
    'X-Content-Type-Options': 'nosniff'})     
    res.removeHeader('X-Powered-By')
    res.removeHeader('Content-Type')
    res.status(405).json();               // Method not accepted
  },

  updateItem:(req,res) => {
    res.set({'Cache-Control': 'no-cache, no-store, must-revalidate;', 
    'Pragma': 'no-cache',
    'X-Content-Type-Options': 'nosniff'})     
    res.removeHeader('X-Powered-By')
    res.removeHeader('Content-Type')
    res.status(405).json();               // Method not accepted
  },

  deleteItem:(req,res) => {
    res.set({'Cache-Control': 'no-cache, no-store, must-revalidate;', 
    'Pragma': 'no-cache',
    'X-Content-Type-Options': 'nosniff'})     
    res.removeHeader('X-Powered-By')
    res.removeHeader('Content-Type')
    res.status(405).json();               // Method not accepted
  },

  patchItem:(req,res) => {
    res.set({'Cache-Control': 'no-cache, no-store, must-revalidate;', 
    'Pragma': 'no-cache',
    'X-Content-Type-Options': 'nosniff'})     
    res.removeHeader('X-Powered-By')
    res.removeHeader('Content-Type')
    res.status(405).json();               // Method not accepted
  }
}

module.exports  = healthController


//------------ use below code for sending different response when db is connected and disconnected
// res.set({'Cache-Control': 'no-cache, no-store, must-revalidate;', 
    //   'Pragma': 'no-cache',
    //   'X-Content-Type-Options': 'nosniff'})     
    //   res.removeHeader('X-Powered-By')
    //   res.removeHeader('Content-Type')
    // sequelize.authenticate().then(() => {      
    //   return res.status(405).json();       //Method Not Allowed
    // }).catch((err) => {
    //   return res.status(503).json();       // service unavailable
    // }) 