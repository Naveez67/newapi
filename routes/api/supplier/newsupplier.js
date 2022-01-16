const express = require("express");
let router = express.Router();
var {Supplier} = require("../../../models/supplier/newsupplier");
var validateSupplier=require("../../../middlewares/validateSupplier")
var { User } = require("../../../models/user");
var auth=require("../../../middlewares/auth");
var admin=require("../../../middlewares/admin");

var bcrypt = require('bcryptjs');
var _ = require('lodash');
var jwt = require('jsonwebtoken');
var config=require("config");
router.get("/profile/:id",async (req, res) => {
    console.log(req.params.id)
    return res.send("users");
  });
  router.get("/:id", async (req, res) => {
    try {
      let user = await Supplier.findById(req.params.id);
      if (!user)
        return res.status(400).send("user With given ID is not present"); //when id is not present id db
      return res.send(user); //everything is ok
    } catch (err) {
      return res.status(400).send("Invalid ID"); // format of id is not correct
    }
  });
  //update a record
  router.put("/:id", async (req, res) => {
    let supplier = await Supplier.findById(req.params.id);
    let user = await User.findOne({userid:req.params.id});
    console.log(req.body.name+req.body.phone);
    supplier.name = req.body.name;
    supplier.photo = req.body.photo;
    supplier.address = req.body.address;
    supplier.phone = req.body.phone;
    supplier.regno = req.body.regno;
    // user.username=req.body.username;
    await supplier.save();

    await user.save();
    return res.send("updated");
  });
  
  //update a record
  router.delete("/:id", async (req, res) => {
    let user = await Supplier.findByIdAndDelete(req.params.id);
    return res.send(user);
  });
  //Insert a record
  router.post("/",validateSupplier,async (req, res) => {
      let user=await User.findOne({username:req.body.username});
      let sup=await Supplier.findOne({phone:req.body.phone});
      let supreg=await Supplier.findOne({regno:req.body.regno});
      if(user) return res.status(400).send("username is already taken");
      if(sup) return res.status(400).send("phone number alreay taken");
      if(supreg) return res.status(400).send("this company already exist")

     user = new User();
     let supplier=new Supplier();
     supplier.name = req.body.name;
     supplier.photo = req.body.photo;
    //  supplier.address = req.body.address;
     supplier.phone = req.body.phone;
     supplier.regno = req.body.regno;
      
     await supplier.save();
     
     user.userid=supplier._id;
     user.role=supplier.role;
     user.accountverfied=false;
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