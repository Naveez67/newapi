var mongoose = require("mongoose");
const Joi = require("@hapi/joi");
var newsSchema = mongoose.Schema({
  title: String,
  body: String,
  imgurl:String,
  date:{
    type:Date,
      default:Date.now
  }
});
var News = mongoose.model("News", newsSchema);

function validateNews(data) {
  const schema = Joi.object({
    title: Joi.string().min(3).required(),
    body: Joi.string().min(10).required(),
  });
  return schema.validate(data, { abortEarly: false });
}
module.exports.News = News;
module.exports.validate = validateNews;
