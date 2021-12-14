const express = require("express");
let router = express.Router();
const auth=require("../../../middlewares/auth");
const validateHelp=require("../../../middlewares/validatehelp");
const {Help}=require("../../../models/help/help")
router.get("/",auth,async(req,res)=>{
    let page = Number(req.query.page ? req.query.page : 1);
    let perPage = Number(req.query.perPage ? req.query.perPage : 10);
    let skipRecords = perPage * (page - 1);
    let help = await Help.find().skip(skipRecords).limit(perPage);
    return res.send(help);
})
router.get("/myposts",auth,async(req,res)=>{
    let page = Number(req.query.page ? req.query.page : 1);
    let perPage = Number(req.query.perPage ? req.query.perPage : 10);
    let skipRecords = perPage * (page - 1);
    let help = await Help.find({problempostedby:req.user._id}).skip(skipRecords).limit(perPage);
    return res.send(help);
})


router.delete("/:id",auth, async (req, res) => {
    let help = await Help.findByIdAndDelete(req.params.id);
    return res.send(help);
  });
router.post("/",auth,validateHelp, async (req, res) => {
    let help = new Help();
    console.log(req.body)
    help.title = req.body.title;
    help.body = req.body.body;
    help.photo = req.body.photo;
    help.problempostedby=req.user;
    await help.save();
    return res.send(help);
  });
router.put("/comment",auth,async (req, res) => {
    let post=await Help.findById(req.body.text.postid)
    let val=post.comments.length;
    post.comments[val]={text:req.body.text.text,postedBy:req.user}
   //c console.log(post);
    post.save();
    return res.send("updated")
  });

module.exports = router;