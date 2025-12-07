const express=require('express');

const router = express.Router();
const applicationController=require('../controllers/applicationController');
const auth=require('../middleware/authMiddleware');

router.post('/apply',auth,applicationController.applyForJob);
router.get('/',auth,applicationController.getApplications);

module.exports=router;