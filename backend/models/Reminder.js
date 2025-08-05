const mongoose = require('mongoose');

const reminderSchema = new mongoose.Schema({
    userId: {type: mongoose.Schema.Types.ObjectId, 
        ref:'User' ,
        required: true
    },

    paymentName: {
        type:String ,
        required : true
    },

    description:{
        type:String 
    },

    amount : {
        type:Number , 
        required:true
    },

    category: {
        type:String ,
        enum: ['bills' , 'subscription', 'loan' , 'tax' , 'other'],
        required:true
    },

    dueDate: {
        type:Date,
        required:true
    },

    Status: {
        type : String ,
        enum: ['pending' , 'paid' , 'overdue' , 'cancelled'],
        default : 'pending'
    }
}, {timestamps:true});

module.exports = mongoose.model('Reminder' , reminderSchema);