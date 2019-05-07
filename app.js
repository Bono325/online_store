const express =require('express');
const app = express();
const morgan = require('morgan');
const mongoose = require('mongoose');

const bodyParser = require('body-parser');
const cors = require('cors');

const prouductsRoute = require('./api/routes/products');
const ordersRoute =  require('./api/routes/orders');
const userRoute = require('./api/routes/user');

mongoose.connect('mongodb://127.0.0.1:27017/apishop', {useNewUrlParser: true});

app.use(morgan('dev'));
app.use('/uploads', express.static('uploads'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(cors());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin","*");
  res.header(
    "Access-Control-Allow",
    "origin,X-Requested-With, Content-Type, Accept, Authorization"
  );
  next();
});

app.use('/products', prouductsRoute);
app.use('/orders', ordersRoute);
app.use('/user', userRoute);

app.use((req, res, next) => {
  const error = new Error ('Not found');
  error.status =400;
  next(error);
});

app.use((error, req, res, next) =>{
  res.status(error.status || 500);
  res.json({
    error:{
      message: error.message
    }
  });
});

module.exports = app;