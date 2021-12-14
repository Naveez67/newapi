const express = require("express");
let router = express.Router();
const auth = require("../../../middlewares/auth");
const admin = require("../../../middlewares/admin");
const validateRates = require("../../../middlewares/validaterates");
var { Marketrates } = require("../../../models/admin/maraketrates");
//get marketrates
router.get("/", async (req, res) => {
  let page = Number(req.query.page ? req.query.page : 1);
  let perPage = Number(req.query.perPage ? req.query.perPage : 10);
  let skipRecords = perPage * (page - 1);
  let marketrates = await Marketrates.find().skip(skipRecords).limit(perPage);
  return res.send(marketrates);
});
//Return Distinct Values for a Field

//get specific product values

router.get("/specificproduct", async (req, res) => {
  let products = await Marketrates.aggregate([{
    $group:
      {
        _id : "$productname",
        avgprice: { $avg: "$productprice" }
      }
  }])
  return res.send(products); 
});



//get single marketratess
router.get("/:id", async (req, res) => {
  try {
    let marketrates = await Marketrates.findById(req.params.id);
    if (!marketrates)
      return res.status(400).send("marketrates With given ID is not present"); //when id is not present id db
    return res.send(marketrates); //everything is ok
  } catch (err) {
    return res.status(400).send("Invalid ID"); // format of id is not correct
  }
});
//update a record
router.put("/:id",auth ,admin,validateRates,async (req, res) => {
  let marketrates = await Marketrates.findById(req.params.id);
  marketrates.productname = req.body.productname;
  marketrates.productprice = req.body.productprice;
  marketrates.quantity = req.body.quantity;
  marketrates.city = req.body.city;
  marketrates.distric = req.body.distric;
  await marketrates.save();
  return res.send(marketrates);
});
//update a record
router.delete("/:id", async (req, res) => {
  let marketrates = await Marketrates.findByIdAndDelete(req.params.id);
  return res.send(marketrates);
});
//Insert a record
router.post("/" ,auth ,admin,validateRates,async (req, res) => {
  let marketrates = new Marketrates();
  marketrates.productname = req.body.productname;
  marketrates.productprice = req.body.productprice;
  marketrates.quantity = req.body.quantity;
  marketrates.city = req.body.city;
  marketrates.distric = req.body.distric;
  await marketrates.save();
  console.log(marketrates);
  return res.send(marketrates);
});




module.exports = router; 
