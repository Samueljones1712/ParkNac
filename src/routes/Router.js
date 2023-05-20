const { Router } = require('express');
const express = require('express');
const router = express.Router();

const controllerUser = require('../controller/UserController');
const controllerParque = require('../controller/ParqueNacionalController');
const controllerEntradas = require('../controller/EntradasController');
const validateToken = require('./validate-token');

/* Session */
router.post('/login', controllerUser.login);
router.post('/token', controllerUser.generateToken);
router.post('/register', controllerUser.registerUser);


/* Parque Nacional */
router.get('/ParqueNacional', validateToken, controllerParque.getParqueNacional);
router.post('/ParqueNacional/add', validateToken, controllerParque.addParqueNacional);
router.put('/ParqueNacional/add', validateToken, controllerParque.updateParqueNacional);
router.delete('/ParqueNacional/delete/:Id', validateToken, controllerParque.deleteParqueNacional);

/* Tarifa */
router.get('/Entradas/', validateToken, controllerEntradas.getEntradas);
router.post('/Entradas/add', validateToken, controllerEntradas.addEntradas);
router.put('/Entradas/add', validateToken, controllerEntradas.updateEntradas);
router.delete('/Entradas/delete/:Id', validateToken, controllerEntradas.deleteEntradas);

/* Usuario */
router.get('/user', controllerUser.index);
router.post('/user/add', controllerUser.add);
router.put('/user/add', controllerUser.edit);
router.delete('/user/delete/:Id', controllerUser.delete);
router.put('/user/changePassword/', controllerUser.changePassword);

module.exports = router;
