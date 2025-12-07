const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const skillRoutes=require('./routes/skills');
const applicationRoutes=require('./routes/applications');

const app=express();

app.use(express.json());
app.use(cors());
app.use('/api/auth',authRoutes);
app.use('/api/jobs',skillRoutes);
app.use('/api/applications',applicationRoutes);

mongoose.connect('mongodb://127.0.0.1:27017/skillconnect')
    .then(()=> console.log('MongoDB Connected'))
    .catch(err=> console.log(err));

app.get('/',(req,res)=>{
    res.send("SkillConnect API is running");
})

const PORT=5000;
app.listen(PORT,()=>{
    console.log(`Server is running on http://localhost:${PORT}`);
})