const express = require('express');
const router = express.Router();
const Reminder = require('../models/Reminder');
const auth = require('../middleware/auth');

// Create 

router.post('/', auth , async(req,res) =>{
    const {paymentName , description, amount , category, dueDate} = req.body;

    try{
        const reminder = new Reminder({
            userId: req.user.userId ,
            paymentName,
            description,
            amount,
            category,
            dueDate
        });

        await reminder.save();
        res.status(201).json(reminder);
    } catch(err) {
        res.status(500).json({message : 'Error creating reminder'});
    }
} );

// Read 

router.get('/' , auth , async(req,res) => {
    try {
        const reminders = await Reminder.find({ userId : req.user.userId});
        res.status(200).json(reminders);
    } catch(err) {
        res.status(500).json({message: 'Error fetching reminders '});
    }
});

// Update 

router.put('/:id' , auth , async(req, res)=> {
    try{
        const updated = await Reminder.findOneAndUpdate(
            {_id:req.params.id, userId:req.user.userId},
            req.body ,
            {new: true}
        );

        if(!updated) return res.status(404).json({message : 'Reminder not found'});
        res.status(200).json(updated);
    } catch(err) {
        res.status(500).json({message: "Error updating reminder"});
    }
});

// Delete 

router.delete('/:id' , auth , async(req, res)=>{
    try{
        const deleted = await Reminder.findOneAndDelete({
            _id:req.params.id ,
            userId: req.user.userId
        });
        if(!deleted) return res.status(404).json({message : 'Reminder not found'});
        
        res.status(200).json({message:"Reminder Deleted"});

    }catch(err){
        res.status(500).json({message:"Error deleting reminder"});
    }
});

//Update status of payment

router.patch('/:id/status' , auth , async(req,res)=>{
    const {status} = req.body;

    if(!['pending', 'paid', 'overdue' , 'cancelled'].includes(status)) {
        return res.status(400).json({message: 'Invalid status value'});
    }

    try {
        const updated = await Reminder.findOneAndUpdate(
            {_id: req.params.id , userId: req.user.userId },
            {status} ,
            {new: true}
        );

        if(!updated) return res.status(404).json({message: 'Payment not found'});

        res.status(200).json(updated);

    }catch(err){
        res.status(500).json({message:'Error updating status'});
    }

});

   

module.exports = router;

