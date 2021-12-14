const express = require("express");
let router = express.Router();
const auth = require("../../../middlewares/auth");
const admin = require("../../../middlewares/admin");
const validateOffices = require("../../../middlewares/validateoffices");
var { Agricultureoffices } = require("../../../models/admin/agrioffices");
//get marketrates
router.get("/", async (req, res) => {
  let page = Number(req.query.page ? req.query.page : 1);
  let perPage = Number(req.query.perPage ? req.query.perPage : 10);
  let skipRecords = perPage * (page - 1);
  let agricultureoffices = await Agricultureoffices.find().skip(skipRecords).limit(perPage);
  return res.send(agricultureoffices);
});
//get single marketratess
router.get("/:id", async (req, res) => {
  try {
    let agricultureoffices = await Agricultureoffices.findById(req.params.id);
    if (!agricultureoffices)
      return res.status(400).send("agricultureoffices With given ID is not present"); //when id is not present id db
    return res.send(agricultureoffices); //everything is ok
  } catch (err) {
    return res.status(400).send("Invalid ID"); // format of id is not correct
  }
});
//update a record
router.put("/:id",auth,admin,validateOffices,async (req, res) => {
  let agricultureoffices = await Agricultureoffices.findById(req.params.id);
  agricultureoffices.name = req.body.name;
  agricultureoffices.phone = req.body.phone;
  agricultureoffices.Address = req.body.Address;
  agricultureoffices.city = req.body.city;
  await agricultureoffices.save();
  return res.send(agricultureoffices);
});
//update a record
router.delete("/:id", async (req, res) => {
  let agricultureoffices = await Agricultureoffices.findByIdAndDelete(req.params.id);
  return res.send(agricultureoffices);
});
//Insert a record
router.post("/",auth,admin,validateOffices,async (req, res) => {
  let agricultureoffices = new Agricultureoffices();
  agricultureoffices.name = req.body.name;
  agricultureoffices.phone = req.body.phone;
  agricultureoffices.Address = req.body.Address;
  agricultureoffices.city = req.body.city;
  await agricultureoffices.save();
  return res.send(agricultureoffices);
});
module.exports = router;
