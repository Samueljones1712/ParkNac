const { Router } = require('express');
const express = require('express');
const router = express.Router();

const controllerUser = require('../controller/UserController');
router.get('/user', controllerUser.index); //read only
router.delete('/user', controllerUser.delete); //read only
router.put('/user', controllerUser.edit); //read only

router.post('/login', controllerUser.login);
module.exports = router;
