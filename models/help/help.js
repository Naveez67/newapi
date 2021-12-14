var mongoose = require("mongoose");
const Joi = require("@hapi/joi");
const {ObjectId}= mongoose.Schema.Types;
var helpSchema = mongoose.Schema({
  title: String,
  body: String,
  photo:String,
  posteddate:{
    type:Date,
    default:Date.now
  },
  problempostedby:{
      type:ObjectId,
      ref:"User"
  },
  comments:[{
    text:String,
    postedBy:{type:ObjectId,ref:"User"},
    comdate:{
      type:Date,
      default:Date.now
    }
}],

 // expire_at: {type: Date, default: Date.now, expires: 4*60*60}
});
var Help = mongoose.model("Help", helpSchema);
function validateHelp(data) {
  const schema = Joi.object({
    title: Joi.string().min(3).required(),
    photo: Joi.string().min(3).required(),
    body: Joi.string().min(3).required(),

  });
  return schema.validate(data, { abortEarly: false });
}
module.exports=Help;

module.exports.Help = Help;
module.exports.validate = validateHelp;