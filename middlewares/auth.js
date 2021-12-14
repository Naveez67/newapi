var jwt = require('jsonwebtoken');
var config=require("config");
var { User } = require("../models/user");
async function auth(req, res, next) {
  let token=req.header("x-auth-token");
  if(!token ) return res.status(400).send("No logged in");
  try {
    let user=jwt.verify(token,config.get("jwtprivatekey"));
    req.user=await User.findById(user._id);

  } catch (error) {
      res.status(401).send("Not authrized");
  }
  next();
}
module.exports = auth;
