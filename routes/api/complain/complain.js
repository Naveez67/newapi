const express = require("express");
let router = express.Router();
const auth=require("../../../middlewares/auth");
const admin=require("../../../middlewares/admin");
const Complain=require("../../../models/complain/complain")
router.get("/", auth,async (req, res) => {
    let page = Number(req.query.page ? req.query.page : 1);
    let perPage = Number(req.query.perPage ? req.query.perPage : 10);
    let skipRecords = perPage * (page - 1);
    let complain = await Complain.find().skip(skipRecords).limit(perPage);
    return res.send(complain);
  });
router.get("/unsolved", auth,async (req, res) => {
  let complain = await Complain.find({$and:[{resolved:false},{status:"hold"}]});
    return res.send(complain);
  });
  router.get("/mycomplain", auth,async (req, res) => {
    let mypost=await Complain.find({complainby:req.user._id})
   // console.log(mypost);
    return res.send(mypost);
  });
  //get single complains
  router.get("/:id", async (req, res) => {
    try {  
      let complain = await Complain.findById(req.params.id);
      if (!complain)
        return res.status(400).send("complain With given ID is not present"); //when id is not present id db
      return res.send(complain); //everything is ok
    } catch (err) {
      return res.status(400).send("Invalid ID"); // format of id is not correct
    }
  });
  //update a record
  router.put("/:id",auth,admin, async (req, res) => {
    let complain = await Complain.findById(req.params.id);
    complain.Status = req.body.status;
    if(req.body.status=="solved"||req.body.status=="reject")
    {
      complain.resolved=true;  
    }
    await complain.save();
    return res.send("updated");
  });
  //update a record
  router.delete("/:id", async (req, res) => {
    let complain = await Complain.findByIdAndDelete(req.params.id);
    return res.send(complain);
  });
  //Insert a record
  router.post("/",auth, async (req, res) => {
    let complain = new Complain();
    complain.title = req.body.title;
    complain.body = req.body.body;
    //console.log(req.user);
    complain.complainby=req.user;
    await complain.save();
    return res.send(complain);
  });
  
  module.exports = router;

