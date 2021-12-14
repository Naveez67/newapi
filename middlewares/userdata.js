var jwt = require('jsonwebtoken');
var config=require("config");
var { Admin } = require("../models/admin/newadmin");
var {Farmer}=require("../models/farmer/newfarmer");
var {Supplier}=require("../models/supplier/newsupplier");
var {Customer}=require("../models/customer/newcustomer");
async function userdata(req, res, next) {
  let token=req.header("x-auth-token");
  if(!token ) return res.status(400).send("No logged in");
  try {
    try{
      let userdata= await Farmer.findById(req.user.userid);
      req.userdata=userdata;
    }catch (error) {
      res.status(402).send("Not data avaialabel");
    }
    try{
      let userdata= await Customer.findById(req.user.userid)
      req.userdata=userdata;
    }catch (error) {
      res.status(402).send("Not data avaialabel");
    }
    try{
      let userdata= await Supplier.findById(req.user.userid)
      req.userdata=userdata;
    }catch (error) {
      res.status(402).send("Not data avaialabel");
    }
    try{
      let userdata= await Admin.findById(req.user.userid)
      req.userdata=userdata;
    }catch (error) {
      res.status(402).send("Not data avaialabel");
    }


  } catch (error) {
      res.status(401).send("Not authrized");
  }
  next();
}
module.exports = userdata;
