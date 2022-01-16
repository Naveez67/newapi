const express = require("express");
let router = express.Router();
var {Customer} = require("../../../models/customer/newcustomer");
var { User } = require("../../../models/user");
var validateCustomer=require("../../../middlewares/validateCustomer")
var bcrypt = require('bcryptjs');
var _ = require('lodash');
var jwt = require('jsonwebtoken');
var config=require("config");
router.get("/",async (req, res) => {
    let page = Number(req.query.page ? req.query.page : 1);
    let perPage = Number(req.query.perPage ? req.query.perPage : 10);
    let skipRecords = perPage * (page - 1);
    let customers = await Customer.find().skip(skipRecords).limit(perPage);
    return res.send(customers);
  });
  router.get("/:id", async (req, res) => {
    try {
      let user = await Customer.findById(req.params.id);
      if (!user)
        return res.status(400).send("user With given ID is not present"); //when id is not present id db
      return res.send(user); //everything is ok
    } catch (err) {
      return res.status(400).send("Invalid ID"); // format of id is not correct
    }
  });
  //update a record
  router.put("/:id",async (req, res) => {
    let customer = await Customer.findById(req.params.id);
    let user = await User.findOne({userid:req.params.id});
    customer.name = req.body.name;
    customer.photo = req.body.photo;
    customer.address = req.body.address;
    customer.phone = req.body.phone;
    user.username=req.body.username;
    await customer.save();

    await user.save();
    return res.send("updated");
  });
  //update a record
  router.delete("/:id", async (req, res) => {
    let user = await Customer.findByIdAndDelete(req.params.id);
    return res.send(user);
  });
  //Insert a record
  router.post("/",validateCustomer,async (req, res) => {
      let user=await User.findOne({username:req.body.username});
      let cum=await Customer.findOne({phone:req.body.phone})
      if(user) return res.status(400).send("username is already taken");
      if(cum) return res.status(400).send("phone number already taken")
     user = new User();
     let newCustomer=new Customer();
     newCustomer.name = req.body.name;
     newCustomer.photo = req.body.photo;
    //  newCustomer.address = req.body.address;
     newCustomer.phone = req.body.phone;
     await newCustomer.save();
     user.accountverfied=true;
     user.userid=newCustomer._id;
     user.role=newCustomer.role;
    user.username = req.body.username;
    user.password = req.body.password;
    await user.generateHashedPassword();
    await user.save();
    let token = jwt.sign(
      { _id: user._id, username: user.username, role: user.role },
      config.get("jwtprivatekey")
    );
    let datatoReturn = {
      username: user.username,
      token: user.token,
    };
    return res.send(datatoReturn);
  });
  module.exports = router;