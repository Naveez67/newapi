const express = require("express");
let router = express.Router();
var Farmerads = require("../../../models/farmer/farmerads");
const auth = require("../../../middlewares/auth");
//get products
router.get("/", auth,async (req, res) => {
  let page = Number(req.query.page ? req.query.page : 1);
  let perPage = Number(req.query.perPage ? req.query.perPage : 10);
  let skipRecords = perPage * (page - 1);
  let Ads = await Farmerads.find().skip(skipRecords).limit(perPage);
  return res.send(Ads);
});
router.get("/myads", auth,async (req, res) => {
  let mypost=await Farmerads.find({postedby:req.user._id})
  console.log(mypost);
  return res.send(mypost);
});
//get single Adss
router.get("/:id", async (req, res) => {
  try {
    let Ads = await Farmerads.findById(req.params.id);
    if (!Ads)
      return res.status(400).send("Ads With given ID is not present"); //when id is not present id db
    return res.send(Ads); //everything is ok
  } catch (err) {
    return res.status(400).send("Invalid ID"); // format of id is not correct
  }
});
//update a record
router.put("/:id", async (req, res) => {
  let Ads = await Farmerads.findById(req.params.id);
  Ads.title = req.body.title;
  Ads.body = req.body.body;
  await Ads.save();
  return res.send(Ads);
});
//update a record
router.delete("/:id", async (req, res) => {
  let Ads = await Farmerads.findByIdAndDelete(req.params.id);
  return res.send(Ads);
});
//Insert a record
router.post("/",auth, async (req, res) => {
  let Ads = new Farmerads();
  Ads.title = req.body.title;
  Ads.body = req.body.body;
  console.log(req.user);
  Ads.postedby=req.user;
  await Ads.save();
  return res.send(Ads);
});

module.exports = router;
