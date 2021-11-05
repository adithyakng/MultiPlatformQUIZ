const redis = require('redis');
const {promisifyAll} = require('bluebird');

promisifyAll(redis);
let _db;
let count = 0;

function getRedisDb(){
    return _db;
}

function initRedisDb(){
    if(_db){
        console.log("Redis has already been connected");
        return;
    }
    const db = redis.createClient()
        .on("error",(err)=>{
            count++;
            console.log(err); 
            console.log("Error in Connection with Redis")
            return;
        });
    console.log("Redis connection established")
    _db = db;
    return true;
}

module.exports = {
    getRedisDb,
    initRedisDb
}