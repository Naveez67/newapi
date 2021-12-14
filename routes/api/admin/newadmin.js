const express = require("express");
let router = express.Router();
const auth = require("../../../middlewares/auth");
const admin = require("../../../middlewares/admin");
var { Admin } = require("../../../models/admin/newadmin");
var { User } = require("../../../models/user");
var bcrypt = require('bcryptjs');
var _ = require('lodash');
var jwt = require('jsonwebtoken');
var config=require("config");
router.get("/",async (req, res) => {
    let page = Number(req.query.page ? req.query.page : 1);
    let perPage = Number(req.query.perPage ? req.query.perPage : 10);
    let skipRecords = perPage * (page - 1);
    let users = await Admin.find().skip(skipRecords).limit(perPage);
    return res.send(users);
  });
  router.get("/:id", async (req, res) => {
    try {
      let user = await Admin.findById(req.params.id);
      if (!user)
        return res.status(400).send("user With given ID is not present"); //when id is not present id db
      return res.send(user); //everything is ok
    } catch (err) {
      return res.status(400).send("Invalid ID"); // format of id is not correct
    }
  });
  //update a record
  router.put("/:id", async (req, res) => {
    let admin = await Admin.findById(req.params.id);
    admin.name = req.body.name;
    admin.phone = req.body.phone;
    await admin.save();
    return res.send(admin);
  });
  //update a record
  router.delete("/:id", async (req, res) => {
    let user = await Admin.findByIdAndDelete(req.params.id);
    return res.send(user);
  });
  //Insert a record
  router.post("/",async (req, res) => {
      let user=await User.findOne({username:req.body.username});
      console.log(req.body.username);

      if(user) return res.status(400).send("username is already taken");
     user = new User();
     let newadmin=new Admin();
     newadmin.name=req.body.name;
     newadmin.phone=req.body.phone;
     await newadmin.save();

     user.userid=newadmin._id;
     user.role=newadmin.role;
     user.accountverfied=true;
    user.username = req.body.username;
    user.password = req.body.password;
    await user.generateHashedPassword();
    await user.save();
    console.log(user);
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

