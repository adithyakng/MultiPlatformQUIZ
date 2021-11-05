const loginController = {}
const bcrypt = require('bcrypt')
const userModal = require("../models/userModel");
const helpers = require('../helpers');

loginController.index = async (req,res) => {
    let body = req.body;
    if(!(body.name) || !(body.email) || !(body.password)){
        res.status(400).json({'status':0,'error':"Name Email and Password are required fields"});
        return;
    }
    const user = await userModal.find({'email':body.email});
    if(user.length !=0){
        res.status(400).json({'status' :0 ,'error' :"Email ID already Registered"});
        return;
    }
    const newUser = new userModal({
        name: body.name,
        email: body.email,
        password: await bcrypt.hash(body.password.toString(),15)
    })
    try{
        await newUser.save();
    }
    catch(error){
        res.status(400).json({'status':0,'error':helpers.getErrorValidationMsg(error.errors)});
        return;
    }
    res.status(201).json({
        'status':1,
        'message' : "User Registered Successfully",
    })
}

loginController.login = async (req,res) => {
    let body = req.body;
    if(!(body.email) || !(body.password)){
        res.status(400).json({'status':0,'error':'Both Email and Password are required'});
        return;
    }
    const user = await userModal.findOne({'email':body.email});
    if(!(user.id)){
        res.status(401).json({'status':1,'error':"Email not registered with us. Pl register"});
        return;
    }
    const password = await bcrypt.hash(body.password,15);
    if(!(await bcrypt.compare(body.password,user.password))){
        res.status(401).json({'status':0,'error':"Incorrect Password"});
        return;
    }
    const access_token = helpers.generateAccessToken(user);
    res.status(200).json({
        'status':1,
        'message': 'Login SuccessFull',
        'access_token': access_token
    });
}

loginController.test = (req,res) => { // User for testing purpose only
    res.send("Hi");
}

module.exports = loginController;