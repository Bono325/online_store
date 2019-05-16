const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const multer = require('multer');
const UserController = require('../controllers/userController');

const storage = multer.diskStorage({
  destination: function(treq, file, cb) {
    cb(null, './uploads/logos/');
  },
  filename: function(req, file, cb) {
    cb(null, file.originalname)
  }
});

const fileFilter = (req,file,cb) =>{
  if(file.mimetype ==='image/jpeg'|| file.mimetype ==='image/png') {
    cb(null,true);
  }else{
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024*1024*5
  },
  fileFilter:fileFilter
});

router.post('/signup',upload.single('brandLogo'), UserController.signupUser);

router.delete('/:userId', UserController.deleteUser);

router.post('/login', UserController.logIn);

router.get('/:userId', UserController.getDesignerInfo);

module.exports=router;