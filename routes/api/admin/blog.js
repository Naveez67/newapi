const express = require("express");
let router = express.Router();
const axios = require('axios').default;
const auth = require("../../../middlewares/auth");
const admin = require("../../../middlewares/admin");
const validateBlog = require("../../../middlewares/validateblog");
var { Blog } = require("../../../models/admin/Blog");
//get blogs
router.get("/", async (req, res) => {
  let page = Number(req.query.page ? req.query.page : 1);
  let perPage = Number(req.query.perPage ? req.query.perPage : 10);
  let skipRecords = perPage * (page - 1);
  let blog = await Blog.find().skip(skipRecords).limit(perPage);
  return res.send(blog);
});
//get single blogs
router.get("/:id", async (req, res) => {
  try {
    let blog = await Blog.findById(req.params.id);
    if (!blog)
      return res.status(400).send("blog With given ID is not present"); //when id is not present id db
    return res.send(blog); //everything is ok
  } catch (err) {
    return res.status(400).send("Invalid ID"); // format of id is not correct
  }
});

//update a record
router.put("/:id",auth,admin,validateBlog,async (req, res) => {
  let blog = await Blog.findById(req.params.id);
  blog.title = req.body.title;
  blog.body = req.body.body;
  blog.url = req.body.url;
  await blog.save();
  return res.send(blog);
});
router.put("/addcomment/:id",auth,async (req, res) => {
  let blog = await Blog.findById(req.params.id);
  let val=blog.comments.length;
  blog.comments[val]={
    text:req.body.text,
    postedBy:req.user,
    username:req.user.username,
  }
  await blog.save();
  return res.send(blog);
});
//update a record
router.delete("/:id", async (req, res) => {
  let blog = await Blog.findByIdAndDelete(req.params.id);
  return res.send(blog);
});
//Insert a record
router.post("/",auth,admin,validateBlog,async (req, res) => {
  let blog = new Blog();
  blog.title = req.body.title;
  blog.body = req.body.body;
  blog.url = req.body.url;
  await blog.save();
  return res.send(blog);
});

router.get("/to/:city", async (req, res) => {
  let city=req.params.city;
  const url=`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=83e212b3621157fb696d5d25ba5056a1`;
    let api=axios.get(url)
    .then((data) => {
      return  res.send(data.data)
      // result=res.data
     // list=res.data.list.filter(reading => reading.dt_txt.includes("18:00:00"));
     // console.log("success");
    })
    .catch((err) => {
        console.log(err);
        return res.send(err);
    }); 
});





module.exports = router;
