require('dotenv');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose  =require('mongoose');
const uuid = require('uuid');
const redis = require('redis');
const {promisifyAll} = require('bluebird');
const redisDb = require('./server/redisServer')
const jwt = require('jsonwebtoken');

const healthRoute = require('./routes/healthRoute');
const eventRoute = require("./routes/eventRoute");
const loginRoute = require("./routes/loginRoute")
const userModel = require('./models/userModel');

const app = express();

promisifyAll(redis);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use('/health',healthRoute);
app.use('/event',eventRoute);
app.use('/login',loginRoute)

app.get("/users", async (request, response) => {
    const users = await userModel.find({});
  
    try {
      response.send(users);
    } catch (error) {
      response.status(500).send(error);
    }
});

app.get("/add_user", async (request, response) => {
    const user = new userModel({id:uuid.v4(),name:"New Model with unique id"});

    try {
        await user.save();
        response.send(user);
    } catch (error) {
        response.status(500).send(error);
    }
});

app.listen(3000,async()=>{
    // Connection to MongoDb
    try{
        await mongoose.connect('mongodb://localhost:27017/local',
            {
                useNewUrlParser: true,
                useUnifiedTopology: true
            },
        );
        console.log("Connection With MongoDB established");
    }catch(error){
        console.log(error);
    }
    // Connection to MongoDb

    // Connection to Redis
    redisDb.initRedisDb()
    // Connection to Redis
    console.log("Server Started at port 3000");
})
