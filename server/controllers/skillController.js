const Skill = require('../models/Skills');

exports.createJob=async(req,res)=>{
    try{
        if(req.user.role!=='employer')
        {
            return res.status(403).json({message:"Access denied. Only Employers can post jobs."});
        }
        const newJob = new Skill({
            ...req.body,
            employerId:req.user.id
        });

        const job=await newJob.save();
        res.json(job);
    }catch(err){
        res.status(500).json({message:err.message});
    }
};

exports.getJobs=async(req,res)=>{
    try{
        const jobs=await Skill.find().populate('employerId','name email');
        res.json(jobs);
    }catch(err){
        res.status(500).json({message:err.message});
    }
}