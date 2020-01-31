'use strict'
const express = require('express');
const router = express.Router();
const userController = require('../controllers/controller');
//middle para proteger las rutas
const auth = require('../middelware/auth');
module.exports = () => {
    router.get('/', userController.home);
    router.post('/register', userController.registerUser);
    router.post('/login', userController.loginUser);
    router.post('/access', auth, userController.access);
    router.post('/get-info', auth, userController.getInfo)
    return router;
}