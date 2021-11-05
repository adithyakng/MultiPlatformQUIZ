const jwt = require('jsonwebtoken');
require('dotenv').config()
let present_tokens = [];
function getErrorValidationMsg(error){
    let errors = [];
    if(!Array.isArray(error)){
        errors.push(error);
        return errors;
    }
    for (const [key, value] of Object.entries(error)) {
        errors.push(value['message']);
    }
    return errors;
}

function generateAccessToken(user){
    const token = jwt.sign(user.toJSON(),process.env.access_token,{'expiresIn':'15m'});
    present_tokens.push(token);
    return token;

}

function validateToken(req,res,next){
    const header = req.headers['authorization'];
    if(header == null){
        res.status(400).json({status:0,"error":"authorization header is missing"});
        return;
    }
    const token = header.split(" ")[1];
    if (token == null){ // Include present_tokens check
        res.status(400).json({status:0,"error":"Token not present"});
        return;
    }
    try{
        const user = jwt.verify(token,process.env.access_token);
        req.user = user
        next();
    }catch(error){
        res.status(403).json({'status':0,'error':'Invalid Token'})
    }
}


module.exports = {getErrorValidationMsg,generateAccessToken,validateToken};