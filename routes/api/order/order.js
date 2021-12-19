
const express = require("express");
let router = express.Router();
const auth=require("../../../middlewares/auth");
const validateOrder=require("../../../middlewares/validateOrder");
const {Order}=require("../../../models/orders/order");
router.get("/",async(req,res)=>{
    let page = Number(req.query.page ? req.query.page : 1);
    let perPage = Number(req.query.perPage ? req.query.perPage : 10);
    let skipRecords = perPage * (page - 1);
    let order = await Order.find().skip(skipRecords).limit(perPage);
     
    return res.send(order);
})
router.get("/myorders/",auth,async(req,res)=>{
    let page = Number(req.query.page ? req.query.page : 1);
    let perPage = Number(req.query.perPage ? req.query.perPage : 10);
    let skipRecords = perPage * (page - 1);
    // console.log(req.body)
    let order = await Order.find({adpostedby:req.user._id}).skip(skipRecords).limit(perPage);
    return res.send(order);
})
router.get("/:id",async(req,res)=>{ 
    try {
        let order = await Order.findById(req.params.id);
         if (!order)
           return res.status(400).send("order With given ID is not present"); //when id is not present id db
         return res.send(order); //everything is ok
       } catch (err) {
         return res.status(400).send("Invalid ID"); // format of id is not correct
       }
})


router.post("/",auth,validateOrder, async (req, res) => {
    let order = new Order();
         order.address = req.body.address;
         order.buyername = req.body.buyername;
         order.adid = req.body.adid;
         order.adpostedby = req.body.adpostedby;
         order.totalamount = req.body.totalamount;
         order.quantity = req.body.quantity;
         order.phone = req.body.phone;
         await order.save();
         return res.send(order);
  });

module.exports = router;






















