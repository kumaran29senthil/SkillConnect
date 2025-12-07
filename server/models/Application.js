const mongoose = require('mongoose');

const ApplicationSchema = new mongoose.Schema({
    jobId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Skill',
        required:true
    },
    candidateId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    status:{
        type:String,
        enum:['applied','shortlisted','rejected'],
        default:'applied'
    },
    appliedAt:{
        type:Date,
        default:Date.now
    }
});

module.exports = mongoose.model('Application',ApplicationSchema);