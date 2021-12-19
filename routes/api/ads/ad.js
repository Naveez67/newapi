const express = require("express");
let router = express.Router();
const auth=require("../../../middlewares/auth");
const validateAd=require("../../../middlewares/validateAd");
const {Ads}=require("../../../models/ads/ad");
const {Farmer}=require("../../../models/farmer/newfarmer");
var Supplier = require("../../../models/supplier/newsupplier");
router.get("/",async(req,res)=>{
    let page = Number(req.query.page ? req.query.page : 1);
    let perPage = Number(req.query.perPage ? req.query.perPage : 10);
    let skipRecords = perPage * (page - 1);
    let ads = await Ads.find().skip(skipRecords).limit(perPage);
    // let cart = [];
    // if(typeof req.cookies.cart == "undefined"){
    //     cart.push(ads[0]);
    // }else{
    //     cart = JSON.parse(req.cookies.cart);
    //     cart.push(ads[0]);
    // }
    // cart = JSON.stringify(cart);
    // res.cookie('cart', cart)
    // console.log(cart);  
    return res.send(ads);
})
router.get("/myads",auth,async(req,res)=>{
    let page = Number(req.query.page ? req.query.page : 1);
    let perPage = Number(req.query.perPage ? req.query.perPage : 10);
    let skipRecords = perPage * (page - 1);
    let ads = await Ads.find({postedby:req.user._id}).skip(skipRecords).limit(perPage);
    return res.send(ads);
})
router.get("/:id",async(req,res)=>{
    try {
        let ad = await Ads.findById(req.params.id);
         if (!ad)
           return res.status(400).send("ad With given ID is not present"); //when id is not present id db
         return res.send(ad); //everything is ok
       } catch (err) {
         return res.status(400).send("Invalid ID"); // format of id is not correct
       }
})
router.put("/test",async(req,res)=>{
    let page = Number(req.query.page ? req.query.page : 1);
    let perPage = Number(req.query.perPage ? req.query.perPage : 10);
    let skipRecords = perPage * (page - 1);
    return res.send(req.body);
})



router.post("/",auth,validateAd, async (req, res) => {
    let ads = new Ads();
    ads.title = req.body.title;
    ads.body = req.body.body;
    ads.photo = req.body.photo;
    ads.price = req.body.price;
    ads.type = req.body.type;
    ads.category = req.body.category;
    //console.log(req.body);
    ads.postedby=req.user;
   await ads.save();
    return res.send(ads);
  });
router.put("/sellerrating",auth, async (req, res) => {
    if(req.body.role=="farmer"){
        let farmer=await Farmer.findById(req.body.userid);
        if(farmer){
            let len=farmer.rating.length;
            farmer.rating[len]={
                rate:req.body.value,
                ratedBy:req.user
            }
        }
        res.send(farmer);
    }
    else if(req.body.role=="supplier"){
        let supplier=await Supplier.findById(req.body.userid);
        if(supplier){
            let len=farmer.rating.length;
            supplier.rating[len]={
                rate:req.body.value,
                ratedBy:req.user
            }
        }
        // supplier.save();
        res.send(req.body)
    }
    else
    return res.send(req.body);
  });
  router.get("/test", async (req, res) => {
        return res.send(req.body);
  })

module.exports = router;
