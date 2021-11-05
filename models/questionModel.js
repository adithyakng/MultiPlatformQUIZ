const mongoose = require('mongoose');
const uuid = require('uuid');

const SINGLE = 1;
const MULTIPLE = 2;


const question = new mongoose.Schema({
'id':{
    type:String,
    default: uuid.v4()
},
'title':{
    type: String,
    required: true
},
'options':{
    type: [String],
    required: true,
    minlength :[2,"There must be atleast two options"]
},
'answer':{
    type : [Number],
    required: true,
    minlength: [1,"Select the answer choice"]
},
'type':{
    type: Number,
    default: SINGLE
},
'user_id':{
    type: String,
    required: true,
},
'event_id':{
    type: String,
    required: true,
},
'created_on':{
    type: Date,
    default: Date()
}

});

question.pre('save',function(next){
    this.answer.forEach(element => {
        if(this.options[element] == null){
            throw new Error(element.toString()+" is invalid option");
        }
    });
    next();
});

const questionModal = mongoose.model("question",question,"questions");

module.exports = questionModal;