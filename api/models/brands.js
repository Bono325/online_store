const mongoose = require('mongoose');

const brandSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  brandName:{
    type: String,
    required: true
  },
  brandLogo: {
    type:String,
    required: true
  }
});

module.exports= mongoose.model('Brands', brandSchema);