var mongoose = require("mongoose");
const Joi = require("@hapi/joi");
var bcrypt = require('bcryptjs');
var userSchema = mongoose.Schema({
  username: String,
  password:String,
  userid:{
    type:String,
    default:"no image",
  },
  role:{
    type:String,
    default:"user",
  },
  accountverfied:{
    type:Boolean,
    default:true,
  }
});
userSchema.methods.generateHashedPassword= async function(){
  let salt=await bcrypt.genSalt(10);
  this.password=await bcrypt.hash(this.password,salt);
}
var User = mongoose.model("User", userSchema);

function validateUser(data) {
  const schema = Joi.object({
    username: Joi.string().min(3).max(10).required(),
    password: Joi.string().min(6).max(10).required(),
  });
  return schema.validate(data, { abortEarly: false });
}
function validateUserLogin(data) {
  const schema = Joi.object({
    username: Joi.string().min(3).max(10).required(),
    password: Joi.string().min(3).max(10).required(),
  });
  return schema.validate(data, { abortEarly: false });
}
module.exports.User = User;
module.exports.validate = validateUser;
module.exports.validateUserLogin = validateUserLogin;
