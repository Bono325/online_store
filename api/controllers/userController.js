const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Brand = require('../models/brands');

exports.signupUser = (req, res, next) => {
  User.find({email:req.body.email})
  .exec()
  .then(user =>{
    if(user.length >= 1) {
      res.status(409).json({
        message: 'Account found for this email'
      });
    }else {
      bcrypt.hash( req.body.password,10, (err,hash) =>{
        if(err) {
          return ({
            error:err
          });
        }else{
          let filePath;
          if(!req.file){
            filePath='uploads\\MK.png'
          }
          else{
            filePath=req.file.path
          }
          const user = new User({
            _id: new mongoose.Types.ObjectId(),
            brandLogo: filePath,
            brandname: req.body.brandname,
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email,
            cellno:req.body.cellno,
            password: hash
          });
          const brand = new Brand ({
            _id: new mongoose.Types.ObjectId(),
            brandLogo: user.brandLogo,
            brandName: user.brandname
          });
          user.save()
          .then(result => {
            console.log(result);
            res.status(201).json({
              message: 'user was created'
            });
          })
          .catch(err => {
            console.log(err);
            res.status(500).json({
              error:err
            });
          })
          
        }
      });
    }
  })
}

exports.deleteUser = (req, res, next) => {
  User.deleteOne({_id: req.params.userId})
  .exec()
  .then( res.status(200).json({
    message: 'User deleted'
  }))
  .catch(err =>{
    Console.log(err);
    res.status(500).json({
      error:err
    })
  })
}

exports.logIn = (req, res, next) => {
  User.findOne({email: req.body.email})
  .exec()
  .then(user => {
    if(user.length<1){
      res.status(401).json({
        message: 'Auth failed'
      });
    }
    bcrypt.compare(req.body.password, user.password, (err, result) =>{
      if(err) {
        return res.status(401).json({
          message: 'Auth failed'
        });
      }
      if(result) {

        const token = jwt.sign(
          {
            email: user.email,
            fristname: user.firstname,
            brandLogo: user.brandLogo,
            brandname: user.brandname,
            userId: user._id
          },
         process.env.JWT_KEY,
          {
            expiresIn: "1hr"
          }
        );

        return res.status(200).json({
            message: 'Auth Successful',
            token: token
          });
      }
      res.status(401).json({
        message: 'Auth failed'
      });

    })
  })
  .catch();
}

exports.getDesignerInfo = (req, res, next) =>{
  User.findById(req.params.userId)
  .select('firstname cellno email lastname brandLogo brandname')
  .then(user => {
    res.status(200).json(user)
  })
  .catch(err => console.log(err))
}