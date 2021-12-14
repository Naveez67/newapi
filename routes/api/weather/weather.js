const express = require("express");
let router = express.Router();
const axios = require('axios').default;
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
        return res.send(true);
    }); 
});
router.get("/forecast/:city", async (req, res) => {
  let city=req.params.city;
  const url=`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=83e212b3621157fb696d5d25ba5056a1`;
    let api=axios.get(url)
    .then((data) => {
      return  res.send(data.data.list.filter(reading => reading.dt_txt.includes("18:00:00")))
      // result=res.data
     // list=res.data.list.filter(reading => reading.dt_txt.includes("18:00:00"));
     // console.log("success");
    })
    .catch((err) => { 
        console.log(err);
        return res.send(true);
    }); 
});





module.exports = router;