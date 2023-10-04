const express = require('express');
const router = express.Router();

const healthController = require('../controller/healthController.js');


// GET
router.get('/healthz', healthController.getItems);
//POST
router.post('/healthz', healthController.createItem);
//PUT
router.put('/healthz', healthController.updateItem);
//DELETE
router.delete('/healthz', healthController.deleteItem);
//PATCH
router.patch('/healthz', healthController.patchItem);
//any other request


module.exports = router
