
const express = require('express');
const router = express.Router();
const {UserController} = require('../controller/User');


router.put('/user/:id', UserController.updateUser);

router.patch('/user/:id', UserController.patchUser);

router.delete('/user/:id', UserController.deleteUser);

module.exports = router;
