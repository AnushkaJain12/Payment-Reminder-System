const express = require('express');
const router = express.Router() ;
const nodemailer = require('nodemailer');

const User = require('../models/User');
const jwt = require('jsonwebtoken');

router.post('/register' , async(req , res) => {
    const {email , password } = req.body ;

    const otp = Math.floor(100000 + Math.random()*900000).toString() ;

    try {
        let userExists = await User.findOne({email}) ;

        if(userExists) return res.status(400).json({ message : 'User already exists'}) ;

        const user = new User ({email , password , otp}) ;
        await user.save() ;

        // otp bhejne ke liye

        const transporter = nodemailer.createTransport({
         service : "gmail" ,
         auth :{
            user: process.env.EMAIL_USER ,
            pass: process.env.EMAIL_PASS,
         },
        });

        const mailOptions = {
            from :  `"Reminder App" <${process.env.EMAIL_USER}>`,
            to : email,
            subject: "Your OTP" ,
            html :` <p>Your OTP is <b>${otp}</b></p>`
        } ;

        await transporter.sendMail(mailOptions);

        res.status(200).json({message : "OTP sent succesfully to email ! "}) ;
    } catch(err){
        res.status(200).json({message:"Server Error" , err : err.message});
    }
}) ;

router.post('/verify', async(req,res)=>{
    const {email , otp} = req.body ;

    try{
        const user = await User.findOne({email}) ;
        if(!user) return res.status(404).json({message:"User not found"});

        if(user.otp !=otp) {
            return res.status(400).json({message: "Invalid OTP !"});
        }

        user.verified = true ;
        user.otp = null ;

        await user.save();

        res.status(200).json({message : "User Verfied Successfully !"});

    } catch(err){
        res.status(500).json({message:"Server Error" , err:err.message});
    }
})





router.post('/login', async (req,res)=>{
    const {email} = req.body;

    try {
        const user = await User.findOne({email});

        if(!user) return res.status(404).json({message : "User not FOUND !!"});

        if(!user.verified) return res.status(401).json({message:"Pls verify your E-mail first"});

       const loginOtp = Math.floor(100000 + Math.random() * 900000).toString();
            user.otp = loginOtp;
            await user.save();

        
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
         },
        });

    const mailOptions = {
         from: `"Reminder App" <${process.env.EMAIL_USER}>`,
         to: email,
         subject: "Login OTP",
         html: `<p>Your Login OTP is <b>${loginOtp}</b></p>`,
      };

    await transporter.sendMail(mailOptions);
    
    res.status(200).json({message: "OTP sent for login" });

    } catch(err) {
        res.status(500).json({message : "Server Error" , error:err.message });
    }
});

router.post('/login-verify' , async(req,res)=>{

    const {email,otp} = req.body;

    try{
        const user = await User.findOne({email});

        if(!user)
            return res.status(404).json({message: "User not found"});

        if(user.otp != otp)
            return res.status(400).json({message:"Invalid OTP"});

        user.otp= null;
        await user.save();

        const token = jwt.sign(
            {userId: user._id , email:user.email},
            process.env.JWT_SECRET ,
            {expiresIn:"2h"}
        );

        res.status(200).json({message:"Login Successful", token});
    } catch(err){
        res.status(500).json({message:"Server error" , error : err.message});
    }

});

module.exports = router ;