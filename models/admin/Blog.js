var mongoose = require("mongoose");
const Joi = require("@hapi/joi");
const {ObjectId}= mongoose.Schema.Types;
var blogSchema = mongoose.Schema({
  title: String,
  body: String,
 url:{
     type:String,
  },
  comments:[{
    text:String,
    postedBy:{type:ObjectId,ref:"User"},
    username:String,
    comdate:{
      type:Date,
      default:Date.now
    }
}],
  posteddate:{
    type:Date,
    default:Date.now
  }
});
var Blog = mongoose.model("Blog", blogSchema);

function validateBlog(data) {
  const schema = Joi.object({
    title: Joi.string().min(3).required(),
    body: Joi.string().min(3).required(),
    url: Joi.string().min(3).required(),
  });
  return schema.validate(data, { abortEarly: false });
}
module.exports.Blog = Blog;
module.exports.validate = validateBlog;
