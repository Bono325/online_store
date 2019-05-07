const mongoose = require ('mongoose');

const Order = require('../models/order');
const Product =require('../models/product');

exports.get_all_orders= (req, res, next) => {
  Order.find()
  .select("name quantity _id")
  .populate('product', 'name')
  .exec()
  .then(docs => {
   res.status(200).json({
     message: 'Orders fecthed',
    count: docs.length,
    orders: docs.map(doc => {
      return{
      order:doc,
       requests: {
         type: 'GET',
         url: 'localhost3000/orders/'+doc.id
       }
      }
    })
   });
  })
  .catch(err =>{
   res.status(500).json({
     error: err
   });
 });
 };

 exports.create_order =  (req, res, next) => {
  
  Product.findById(req.body.productId)
  .then(product => {
    if(!product) {
      console.log(product);
      res.status(404).json({
        message: 'product not found'
      });
    }
  })
  const order = new Order ({
    _id: new mongoose.Types.ObjectId,
    product: req.body.productId
  });   

  order.save()
    .then(result => {
      console.log(result);
      res.status(200).json({
        order: result
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
  })
}

 exports.update_order = (req, res, next) => {
  res.status(200).json({
    message: 'order was updated',
    id: req.params.orderId
  });
};

exports.get_order = (req, res, next) => {
  Order.findById(req.params.orderId)
  .populate('product',)
  .then(result => {
    if(!result){
      return res.status(404).json({
        message: "Order not found"
      });
    }
    res.status(200).json({
        message: 'Order Details',
        _id: req.params.orderId,
        product: result.product,
        quantity: result.quantity,
        requests: {
          type: 'GET',
          url: 'localhost:3000/orders'
        }
    });
    })
  .catch(err => {
    res.status(500).json({
      error: err
    });
  })
};

exports.delete_order = (req, res, next) => {
  const id= req.params.orderId; 
   Order.deleteOne({_id: id})
   .exec()
   .then(
     res.status(200).json({
     message: 'order was deleted',
     requests: {
       type: 'POST',
       url: 'localhost/orders',
       data: {
         productId: 'ID',
         quantity: 'Number'
       }
     }
   }))
   .catch(err =>{
     res.status(500).json({
       error:err
     })
   });
 };