const express = require("express");
let router = express.Router();
const validateUser = require("../../middlewares/validateUser");
const auth = require("../../middlewares/auth");
const admin = require("../../middlewares/admin");
var { User } = require("../../models/user");
const {Farmer}=require("../../models/farmer/newfarmer");
const {Supplier}=require("../../models/supplier/newsupplier");
const {Customer}=require("../../models/customer/newcustomer");
const {Admin}=require("../../models/admin/newadmin")      
var bcrypt = require('bcryptjs');
var _ = require('lodash');      
var jwt = require('jsonwebtoken');
var config=require("config"); 
router.get("/",auth,async (req, res) => {
    let page = Number(req.query.page ? req.query.page : 1);
    let perPage = Number(req.query.perPage ? req.query.perPage : 10);
    let skipRecords = perPage * (page - 1);
    if(req.user.role==="admin"){
      let users = await User.find().skip(skipRecords).limit(perPage);
      return res.send(users); 
    }
    let users = await User.find({$or:[{role:"farmer"},{role:"customer"},{role:"supplier"}]}).skip(skipRecords).limit(perPage);
    return res.send(users);
  });
  router.get("/usernames",async (req, res) => {
    let users = await User.find();
      return res.send(users);
    });
router.get("/farmers",auth,async (req, res) => {
    let page = Number(req.query.page ? req.query.page : 1);
    let perPage = Number(req.query.perPage ? req.query.perPage : 10);
    let skipRecords = perPage * (page - 1);
    let users = await User.find({role:"farmer"}).skip(skipRecords).limit(perPage);
    return res.send(users);
  });
router.get("/supplier",auth,async (req, res) => {
    let page = Number(req.query.page ? req.query.page : 1);
    let perPage = Number(req.query.perPage ? req.query.perPage : 10);
    let skipRecords = perPage * (page - 1);
    let users = await User.find({role:"supplier"}).skip(skipRecords).limit(perPage);
    return res.send(users);
  });
router.get("/customer",auth,async (req, res) => {
    let page = Number(req.query.page ? req.query.page : 1);
    let perPage = Number(req.query.perPage ? req.query.perPage : 10);
    let skipRecords = perPage * (page - 1);
    let users = await User.find({role:"customer"}).skip(skipRecords).limit(perPage);
    return res.send(users);
  });    
  router.get("/:id", async (req, res) => {
    try {
     let user = await User.findById(req.params.id);
      if (!user)
        return res.status(400).send("user With given ID is not present"); //when id is not present id db
      user.password=null
      return res.send(user); //everything is ok
    } catch (err) {
      return res.status(400).send("Invalid ID"); // format of id is not correct
    }
  });
  router.get("/userdata/:id", async (req, res) => {
    try {
     let user = await User.findById(req.params.id);
      if (user.role==="farmer"){
        return res.send(await Farmer.findById(user.userid)); 
      }
      else if (user.role==="supplier"){
        return res.send(await Supplier.findById(user.userid)); 
      }
      else if (user.role==="customer"){
        return res.send(await Customer.findById(user.userid)); 
      }
        
      return res.send(await Admin.findById(user.userid)); 
    } catch (err) {
      return res.status(400).send("Invalid ID"); // format of id is not correct
    }
  });
  
  //update a record
  router.get("/userprofile", async (req, res) => {
    console.log("api call is here")
    // let user = await User.findById(req.params.id);
    // if (user.role==="farmer"){
    //   return res.send(await Farmer.findById(user.userid)); 
    // }
    // else if (user.role==="supplier"){
    //   return res.send(await Supplier.findById(user.userid)); 
    // }
    // else
    return res.send([])
  });
  router.put("/:id",auth ,validateUser, async (req, res) => {
    let user = await User.findById(req.params.id);
    user.username = req.body.username;
    user.password = req.body.password;

    await user.save();
    return res.send(user);
  });
  //update a record
  router.delete("/:id",auth, async (req, res) => {
    let user = await User.findById(req.params.id);
    if(user.role==="farmer") await Farmer.findByIdAndDelete(user.userid);
    if(user.role==="customer") await customer.findByIdAndDelete(user.userid);
    if(user.role==="supplier") await Supplier.findByIdAndDelete(user.userid);

    let user1 = await User.findByIdAndDelete(req.params.id);
    return res.send(user1);
  });

  //Insert a record
  router.post("/", validateUser, async (req, res) => {
      let user=await User.findOne({username:req.body.username});
      if(user) return res.status(400).send("username is already taken");
     user = new User();
    user.username = req.body.username;
    user.password = req.body.password;
    await user.generateHashedPassword();
    await user.save();
    return res.send(_.pick(user,["username"]));
  });

  router.post("/login", async (req, res) => {
    let user=await User.findOne({username:req.body.username});
    if(!user) return res.status(400).send("user is not register");
    let isValid=await bcrypt.compare(req.body.password,user.password);
    if(!isValid) return res.status(401).send("invalid password");
    //if(!user.accountverfied) return res.status(402).send("account is not activited")
    let token=jwt.sign({_id:user._id,name:user.username,role:user.role},config.get("jwtprivatekey"));

    res.send(token);
  });
  router.put("/aprove/:id",auth,admin,async(req,res)=>{
    let user = await User.findById(req.params.id);
    user.accountverfied=true;
    await user.save();
    return res.send("user");
  })

  module.exports = router;

