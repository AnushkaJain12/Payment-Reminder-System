const mongoose = require('mongoose');
const express = require('express') ;
const app = express();
const cors = require('cors');

require('dotenv').config() ; 

mongoose.connect(process.env.MONGO_URI)
.then(()=> console.log("MongoDB Connected ") )
.catch(err => console.log("MongoDB conncetion failed " , err));

app.use(cors({
    origin: ["http://localhost:5173", "https://fancy-valkyrie-6bed63.netlify.app/"], 
    credentials: true
}));

app.use(express.json());

app.get('/' , (req,res) => {
 res.send('Server is running !');
});

app.listen(5000 ,()=> {
    console.log('server is running on port 5000');
}) ;

const authRoutes = require('./routes/auth') ;
app.use('/api' , authRoutes);

const reminderRoutes = require('./routes/reminders');
app.use('/api/reminders' , reminderRoutes);

require('./cron/emailReminder');