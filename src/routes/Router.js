const { Router } = require('express');
const express = require('express');
const router = express.Router();

const controllerUser = require('../controller/UserController');
const controllerParque = require('../controller/ParqueNacionalController');
const validateToken = require('./validate-token');

router.get('/user', controllerUser.index); //read only
router.delete('/user', controllerUser.delete); //read only
router.put('/user', controllerUser.edit); //read only

router.post('/login', controllerUser.login);
router.post('/token', controllerUser.generateToken);
router.post('/register', controllerUser.registerUser);

router.get('/ParqueNacional', validateToken, controllerParque.getParqueNacional);

module.exports = router;
