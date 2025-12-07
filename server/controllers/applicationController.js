const Application = require('../models/Application');
const Skill = require('../models/Skills');

exports.applyForJob = async(req,res)=>{
    try{
        if(req.user.role!=='candidate')
        {
            return res.status(403).json({message:"Only Candidates can apply."});
        }
        const {jobId}=req.body;

        const exisitingApp=await Application.findOne({jobId,candidateId:req.user.id});
        if(exisitingApp){
            return res.status(400).json({message:"You have already applied for this job."});
        }

        const newApp=new Application({
            jobId,
            candidateId:req.user.id,
            status:'applied'
        })

        await newApp.save();
        res.status(201).json({message:"Application submitted successfully"});
    }catch(err){
        res.status(500).json({message:err.message});
    }
}

exports.getApplications =async(req,res)=>{
    try{
        if(req.user.role!=='employer')
        {
            return res.status(403).json({message:"Acces deined"});
        }

        const applications = await Application.find()
        .populate('jobId','title employerId')
        .populate('candidateId', 'name email');


        const myApplications = applications.filter(app=>app.jobId.employerId.toString()===req.user.id);

        res.json(myApplications);
    }catch(err){
        res.status(500).json({message:err.message});
    }
}