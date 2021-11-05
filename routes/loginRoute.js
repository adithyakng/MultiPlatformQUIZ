const express = require('express');
const {validateToken} = require("../helpers");
const loginController = require('../controllers/loginController')
const routes = express()
routes.post("/register",loginController.index);
routes.post("/login",loginController.login);
routes.post("/test",validateToken,loginController.test);
module.exports = routes;