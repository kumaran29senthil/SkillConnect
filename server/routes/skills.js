const express=require('express');
const router=express.Router();
const skillController=require('../controllers/skillController');

const auth=require('../middleware/authMiddleware');

router.post('/',auth,skillController.createJob);
router.get('/',skillController.getJobs);

module.exports=router;