var mongoose = require("mongoose");
const Joi = require("@hapi/joi");
const {ObjectId}= mongoose.Schema.Types;
var farmeradsSchema = mongoose.Schema({
  title: String,
  body: String,
  imgurl:{
     type:String,
     default:"no value provided",
  },
  postedby:{
      type:ObjectId,
      ref:"User"

  },
  expire_at: {type: Date, default: Date.now, expires: 4*60*60}
});
var Farmerads = mongoose.model("Farmerads", farmeradsSchema);
module.exports=Farmerads;