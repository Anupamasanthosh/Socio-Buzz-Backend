const express=require('express');
const { adminLogin,verifyToken,userData,postView,allReportedPost,userBlock, userUnBlock, postReport} = require('../controllers/admin');
const { allPost } = require('../controllers/user');
const router=express.Router()

router.post('/verifyToken',verifyToken)
router.post('/adminLogin',adminLogin)
router.get('/userData',userData)
router.post('/userBlock',userBlock)
router.post('/userUnBlock',userUnBlock)
router.get('/allPost',allPost)
router.post('/reportPost',postReport)
router.get('/allReportedPost',allReportedPost)


module.exports=router;