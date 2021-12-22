const express = require("express");
let router = express.Router();
var { Farmer } = require("../../../models/farmer/newfarmer");
var validateFarmer=require("../../../middlewares/validateFarmer")
var { User } = require("../../../models/user");
var bcrypt = require('bcryptjs');
var _ = require('lodash');
var jwt = require('jsonwebtoken');
var config=require("config");
router.get("/",async (req, res) => {
    let page = Number(req.query.page ? req.query.page : 1);
    let perPage = Number(req.query.perPage ? req.query.perPage : 10);
    let skipRecords = perPage * (page - 1);
    let users = await Farmer.find().skip(skipRecords).limit(perPage);
    return res.send(users);
  });
  router.get("/:id", async (req, res) => {
    try {
      let user = await Farmer.findById(req.params.id);
      if (!user)
        return res.status(400).send("user With given ID is not present"); //when id is not present id db
      return res.send(user); //everything is ok
    } catch (err) {
      return res.status(400).send("Invalid ID"); // format of id is not correct
    }
  });
  //update a record
  router.put("/:id", async (req, res) => {
    let farmer = await Farmer.findById(req.params.id);
    let user = await User.findOne({userid:req.params.id});
    farmer.name = req.body.name;
    farmer.photo = req.body.photo;
    farmer.address = req.body.address;
    farmer.phone = req.body.phone;
    user.username=req.body.username;
    console.log(req.body)
    await farmer.save(); 

    await user.save();
    return res.send("updated");
  });
  //update a record
  router.delete("/:id", async (req, res) => {
    let user = await Farmer.findByIdAndDelete(req.params.id);
    return res.send(user);
  });
  //Insert a record
  router.post("/",validateFarmer,async (req, res) => {
      let user=await User.findOne({username:req.body.username});
      if(user) return res.status(400).send("username is already taken");
     user = new User();
     let newFarmer=new Farmer();
     newFarmer.name = req.body.name;
     newFarmer.photo = req.body.photo;
    //  newFarmer.address = req.body.address;
     newFarmer.phone = req.body.phone;
      
     await newFarmer.save();
     
     user.userid=newFarmer._id;
     user.role=newFarmer.role;
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