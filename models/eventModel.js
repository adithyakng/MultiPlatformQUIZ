const mongoose = require('mongoose');
const uuid = require('uuid');

const STATUS_ACTIVE = 1;
const STATUS_INACTIVE = 0;

const event = new mongoose.Schema({
    'id':{
        type: String,
        default: uuid.v4()
    },
    'name':{
        type: String,
        required: true,
    },
    'user_id':{
        type: String,
        required: true
    },
    'pin':{
        type: String,
        required: true
    },
    'status':{
        type: Number,
        default: STATUS_ACTIVE
    },
    'created_on':{
        type: Date,
        default: Date()
    },
    'event_on':{
        type: Date,
        default: null
    }
});

const eventModal = mongoose.model("event",event,"events")

module.exports = {eventModal,STATUS_ACTIVE,STATUS_INACTIVE};