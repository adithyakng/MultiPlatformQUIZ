const express = require('express');
const {validateToken} = require('../helpers');
const eventController = require('../controllers/eventController')
const routes = express()
routes.post("/createEvent",validateToken,eventController.createEvent);
routes.get("/listAllEvents",validateToken,eventController.listAllEvents);
routes.post("/addQuestion",validateToken,eventController.createQuestion);
routes.get("/listAllQuestionsForEvent",validateToken,eventController.listAllQuestionsForEvent)
module.exports = routes;