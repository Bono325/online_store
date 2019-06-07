const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');
const checkAuth =require('../middleware/check-auth');
const productController = require('../controllers/productController');

const storage = multer.diskStorage({
  destination: function(treq, file, cb) {
    cb(null, './uploads/');
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

router.get('/', productController.get_all_products);

router.get('/brands', productController.get_brands);

router.post('/', checkAuth, upload.single('productImage'), productController.create_new_product);

router.get('/:productId', productController.get_product);

router.patch('/:productId',checkAuth, productController.update_product);

router.delete('/:productId',checkAuth, productController.delete_product);

module.exports = router;