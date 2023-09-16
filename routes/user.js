const express = require("express");
const router = express.Router();
const multer = require("multer");
const { storage } = require("../utils/cloudinaryConfig");
const upload = multer({ storage })
const {
  userSignup,
  userLogin,
  verifyToken,
  imageUpload,
  userPostCreation,
  postView,
  editUser,
  getUsers,
  userFollow,
  userFollowing,
  followingDetails,
  allPost,
  reportPost,
  likePost,
  unlikePosts,
  findUser,savePost,
  saved,
  unFollow,postVideoCreation,
  userCoverUpload,unsave,
  sendMsg,
  getAllMsg,
  addComment,getComments
} = require("../controllers/user");

router.post("/verifyToken", verifyToken);
router.post("/signUp", userSignup);
router.post("/login", userLogin);
router.post("/imageupload", upload.single('image'), imageUpload);
router.post('/coverUpload',upload.single('image'),userCoverUpload)
router.post("/postCreation", upload.single('image'), userPostCreation);
router.post("/postVideoCreation", upload.single('video'), postVideoCreation);
router.get("/postView", postView);
router.post('/editUser',editUser)
router.get('/usersData',getUsers)
router.post('/followUser',userFollow)
router.get('/following',userFollowing)
router.get('/friendAccountDetails/:id',followingDetails)
router.get('/allPost',allPost)
router.post('/reportPost',reportPost)
router.post('/likePost',likePost)
router.post('/unLikePost',unlikePosts)
router.post('/findUser',findUser)
router.post('/savePost',savePost)
router.get('/saved',saved)
router.post('/unsave',unsave)
router.post('/unFollow',unFollow)
router.post('/sendMsg',sendMsg)
router.get('/getAllMsg',getAllMsg)
router.post('/addComment',addComment)
router.get('/getComments',getComments)

module.exports = router;
