const express = require("express");
let router = express.Router();
const validateNews = require("../../../middlewares/validateNews");
const auth = require("../../../middlewares/auth");
const admin = require("../../../middlewares/admin");
var { News } = require("../../../models/admin/news");


//sms
const twilio = require('twilio'); 
const accountSid = 'ACd10c64b55d0b3f398b8393f88ec9640a';
const authToken = 'a224cfd98356a1c1fdd17c9d926d592c'; 
const client = new twilio(accountSid, authToken);
router.get('/send-text', (req, res) => {
  //Welcome Message
  res.send('Hello to the Twilio Server')

  //_GET Variables
  const { phone, text } = req.body;

   console.log(phone,text);    
  //Send Text
  client.messages.create({
      body: text,
      to: phone,  // Text this number
      from: '+19566063428' // From a valid Twilio number
  }).then((message) => console.log(message.body))
  .done();
  console.log(12)
})


//sms end 
//get products
router.get("/", async (req, res) => {
  let page = Number(req.query.page ? req.query.page : 1);
  let perPage = Number(req.query.perPage ? req.query.perPage : 10);
  let skipRecords = perPage * (page - 1);
  let products = await News.find().skip(skipRecords).limit(perPage);
  return res.send(products);
});
//get single products
router.get("/:id", async (req, res) => {
  try {
    let product = await News.findById(req.params.id);
    if (!product)
      return res.status(400).send("Product With given ID is not present"); //when id is not present id db
    return res.send(product); //everything is ok
  } catch (err) {
    return res.status(400).send("Invalid ID"); // format of id is not correct
  }
});
//update a record
router.put("/:id",async (req, res) => {
  let New = await News.findById(req.params.id);
  New.title = req.body.title;
  New.body = req.body.body;
  New.imgurl = req.body.url;
  await New.save();
  return res.send(New);
});
//update a record
router.delete("/:id", async (req, res) => {
  let New = await News.findByIdAndDelete(req.params.id);
  return res.send(New);
});
//Insert a record
router.post("/",auth,admin,async (req, res) => {
  let New = new News();
  New.title = req.body.title;
  New.body = req.body.body;
  New.imgurl = req.body.url;
  await New.save();
  return res.send(New);
});
module.exports = router;
