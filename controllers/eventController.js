var eventController = {}
const jwt = require('jsonwebtoken');
const redisDb = require('../server/redisServer');
const {eventModal,active,inactive} = require('../models/eventModel');
const questionModal = require('../models/questionModel');
const helpers = require('../helpers');

function generateRandom5DigitNumber(){
    return Math.floor(100000 + Math.random() * 900000);
}
function generatePin(){
    return generateRandom5DigitNumber()+"-"+generateRandom5DigitNumber()+"-"+generateRandom5DigitNumber();
}
eventController.createEvent = async(req,res) => {
    const body = req.body
    if(!(body.name)){
        res.status(400).json({'status':0,'error':"Pl mention name of the event"});
        return;
    }
    const redisClient = redisDb.getRedisDb();
    let pin = generatePin();
    while((await redisClient.getAsync(pin)) != null){
        pin = generatePin();
        console.log("inside")
    }
    await redisClient.setAsync(pin,1);
    const event = new eventModal({
        user_id:req.user.id,
        pin:pin,
        name: body.name
    });
    if((body.event_on)){
        event.event_on = new Date(body.event_on);
        if(event.event_on < event.created_on){
            res.status(400).json({status:0,'error':"Cannot create an event for past date"});
            return;
        }
    }
    try{
        await event.save();
    }
    catch(error){
        res.status(400).json({status:0,'error':helpers.getErrorValidationMsg(error.errors)});
        return;
    }
    await redisClient.delAsync(pin);
    res.status(201).send(event);
}

eventController.listAllEvents = async(req,res) =>{
    const events = await eventModal.find({user_id:req.user.id});
    res.status(200).json(events);
    return;
}

eventController.createQuestion = async(req,res) => {
    let body = req.body;
    const event_id = body.event_id;
    const event = await eventModal.findOne({id:event_id});
    if(event.id == null){
        res.status(400).json({'status':0,"error":"Event ID is incorrect"});
        return;
    }
    const question = new questionModal({
        'user_id': req.user.id,
        'event_id': event_id,
        'title' : body.title.trim(),
        'options': body.options,
        'answer' : body.answer,
        'type' : body.type
    });
    try{
        await question.save();
    }catch(error){
        error = Array.isArray(error) ? error.errors : error.message;
        res.status(400).json({'status':0,'error':helpers.getErrorValidationMsg(error)});
        return;
    }
    res.status(201).json({'status':1,'message':"Question successfully created",question:question});
}

eventController.listAllQuestionsForEvent = async(req,res) =>{
    if(req.body.event_id == null){
        res.status(400).json({'status':0,"error":"Event ID is missing"});
        return;   
    }
    const questions = await questionModal.find({user_id:req.user.id,event_id:req.body.event_id});
    res.status(200).json(questions);
    return;
}

module.exports = eventController