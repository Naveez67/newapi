const express = require("express");
let router = express.Router();
const auth=require("../../../middlewares/auth");
const admin=require("../../../middlewares/admin");
const Complain=require("../../../models/complain/complain")
var { User } = require("../../../models/user");
router.get("/unsolved",auth,admin,async (req, res) => {
    let complain = await Complain.find({resolved:false});
    return res.send(complain);
});
router.get("/unverfied",auth,admin,async (req, res) => {
    let page = Number(req.query.page ? req.query.page : 1);
    let perPage = Number(req.query.perPage ? req.query.perPage : 10);
    let skipRecords = perPage * (page - 1);
    let users = await User.find({accountverfied:false}).skip(skipRecords).limit(perPage);
    return res.send(users);
}
);
router.get("/solved",auth,async (req, res) => { 
    let complain = await Complain.find({complainby:req.user._id});
    if(complain.resolved==true){
        return res.send(complain);
    }
    return res.send([]);
});




module.exports = router;
