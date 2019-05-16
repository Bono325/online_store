const mongoose = require('mongoose');

const Product =require('../models/product');

const Brand = require('../models/brands');

const User = require('../models/user');


exports.get_all_products = (req, res, next) => {
  Product.find()
  .exec()
  .then(products => {
    const response = {
      count: products.length,
      products: products.map(doc => {
        return {
          _id: doc._id,
          name:doc.name,
          price: doc.price,
          designer: doc.designer,
          size: doc.size,
          productImage: doc.productImage,
          userId: doc.designerId,
          requests: {
            type: 'GET',
            url:'localhost:3000/products/'+doc._id
          }
        }
      })
    }
    console.log(response);
    res.status(200).json(response);
  })
  .catch(err => {
    res.status(500).json({
      error: err
    });
  })
};
exports.get_brands = (req, res, next) => {
  Brand.find()
  .exec()
  .then(brands => {
    const response = {
      count: brands.length,
      brands: brands.map(brand => {
        return {
          _id: brand._id,
          brandname:brand.brandName,
          brandLogo: brand.brandLogo
        }
      })
    }
    res.status(200).json(response);
  })
  .catch(err => {
    res.status(500).json(err);
  })
}
exports.create_new_product =  (req, res, next) => {
  const product = new Product ({
    _id: new mongoose.Types.ObjectId,
    name: req.body.name,
    price: req.body.price,
    designer: req.body.designer,
    size: req.body.size,
    productImage: req.file.path,
    designerId: req.body.userId
  });   

  product.save()
    .then(result => {
      console.log(result);
      res.status(200).json({
        message: 'Product save successful',
        product: {
          name:result.name,
          price:result.price,
          productimage: result.productimage,
          designer: result.designer,
          color: result.color,
          size: result.size,
          quantity: result.quantity,
          designerinfo: result.designerId,
          requests: {
            type: 'GET',
            url:'localhost:3000/products/'+result._id
          }
        }
      })  
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    })
}

exports.get_product = (req, res, next) => {
  const id = req.params.productId;
  Product.findById(id)
  .exec()
  .then(doc => {
    if(doc){
      const result = {
        _id: doc._id,
        name: doc.name,
        price: doc.price,
        productImage: doc.productImage,
        designer: doc.designer,
        color: doc.color,
        size: doc.size,
        userid: doc.designerId,
        quantity: doc.quantity,
        request: {
          type:'GET',
          url:'localhost:3000/products'
        }
      }
      
      res.status(200).json(result);
    }else{
      res.status(500).json({
        message: 'No entry found for the id'
      });
    }
   
  })
  .catch(err =>{
    console.log(err);
    res.status(500).json({error:err});
  });
};

exports.update_product =  (req, res, next) => {
    const id = req.params.productId;
    const updateOps ={};
    for(const ops of req.body) {
      updateOps[ops.propName] = ops.value;
    }
    Product.update({_id: id}, {$set: updateOps })
    .exec()
    .then(result =>{
      console.log(result);
      res.status(200).json(result);
    })
  }

  exports.delete_product = (req, res, next) => {
    const id = req.params.productId
    Product.remove({_id: id})
    .exec()
    .then(result => {
     res.status(200).json(result);
    })
    .catch(err =>{
     res.status(500).json({
       error: err
     });
    });
   }