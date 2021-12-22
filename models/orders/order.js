var mongoose = require("mongoose");
const Joi = require("@hapi/joi");
var orderSchema = mongoose.Schema({
  adid:String,
  adpostedby:String,
  buyername:String,
  totalamount:Number,
  quantity:Number,
  address:String,
  phone:String,
  photo:String,
  dateoforder:{
      type:Date, 
      default:Date.now
  },
});
var Order = mongoose.model("Order", orderSchema);
function validateOrder(data) {
    const schema = Joi.object({
      buyername: Joi.string().min(3).regex(/^[A-Za-z\w\s]+$/).required(),
      address: Joi.string().min(6).required(),
      adid: Joi.string().min(6).required(),
      photo: Joi.string().min(6).required(),
      adpostedby: Joi.string().min(3).required(),
      phone: Joi.string().min(11).max(11).required(),
      totalamount:Joi.number().min(1).required(),
      quantity:Joi.number().min(1).required(),
   
    });
    return schema.validate(data, { abortEarly: false });
  }
module.exports.Order=Order;
module.exports.validate = validateOrder;