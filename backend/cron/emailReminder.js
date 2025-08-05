const cron = require('node-cron');
const nodemailer = require('nodemailer');
const Reminder = require('../models/Reminder');
const User = require('../models/User');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth:{
        user:process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

cron.schedule('0 12 * * *' , async ()=> {
    const now = new Date();
    const allReminders = await Reminder.find({status:'pending'}).populate('userId');

    for(let reminder of allReminders){
        const due = new Date(reminder.dueDate);
        const daysLeft= Math.ceil((due-now)/(1000*60*60*24));
        const email = reminder.userId.email;

       let subject = '';
       let html = '' ;
       
       if(daysLeft === 2){
        subject = `Upcoming Payment : ${reminder.paymentName}`;
        html =`<p>Your Payment <b> ${reminder.paymentName}</b> of ruppess ${reminder.amount} is due 
        in 2 days on  <b> ${due.toDateString()} </b></p>`;
       } else if (daysLeft === 0){
         subject = `📅 Payment Due Today: ${reminder.paymentName}`;
         html = `<p>Your payment <b>${reminder.paymentName}</b> of ruppess ${reminder.amount}
         is due <b>today</b> (${due.toDateString()}).</p>`;
       } 

       else if(daysLeft < 0) {
        subject = `Overdue Payment : ${reminder.paymentName}` ;
        html = `<p>Your Payment <b> ${reminder.paymentName} </b> of Ruppess ${reminder.amount} was due on <b>
        ${due.toDateString()} . <p>` ;
       } 
       else {
        continue ;
       }

       if (daysLeft < 0 && reminder.status !== 'overdue') {
        reminder.status = 'overdue';
        await reminder.save(); // ✅ update status in DB
       }

       await transporter.sendMail({
        from: `"Payment Reminder System" <${process.env.EMAIL_USER}>`,
        to: email ,
        subject ,
        html
       });
    }

    console.log("Reminder emails checked at 12 PM");
});