var createError = require("http-errors");
var express = require("express");
var cors = require('cors')
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/api/users");
var productsRouter = require("./routes/api/products");
var news=require("./routes/api/admin/news");
var blog=require("./routes/api/admin/blog");
var marketreates=require("./routes/api/admin/marketrates");
var agricultureoffices=require("./routes/api/admin/agrioffices");
var newadmin=require("./routes/api/admin/newadmin");
var farmerads=require("./routes/api/farmer/farmerads");
var newfarmer=require("./routes/api/farmer/newfarmer");
var supplier=require("./routes/api/supplier/newsupplier");
var customer=require("./routes/api/customer/newcustomer");
var complain=require("./routes/api/complain/complain");
var ads=require("./routes/api/ads/ad");
var order=require("./routes/api/order/order");
var help=require("./routes/api/help/help");
var notification=require("./routes/api/Notifications/notification")
var weather=require("./routes/api/weather/weather")
var config = require("config");
var app = express();
app.use(cors());
//twilio code here


//twilio requirements -- Texting API 

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use("/", indexRouter);
app.use("/api/users", usersRouter);
app.use("/api/products", productsRouter);
app.use("/api/news", news);
app.use("/api/blog", blog);
app.use("/api/marketrates", marketreates);
app.use("/api/agrioffices", agricultureoffices);
//app.use("/api/ads", farmerads);
app.use("/api/addfarmer", newfarmer);
app.use("/api/supplier", supplier);
app.use("/api/customer", customer);
app.use("/api/newadmin", newadmin);
app.use("/api/complain", complain);
app.use("/api/ads", ads);
app.use("/api/order", order);
app.use("/api/help", help);
app.use("/api/notification", notification);
app.use("/api/weather", weather);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});
     
// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});
mongoose
  .connect(config.get("db"), {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to Mongo...."))
  .catch((error) => console.log(error.message));
module.exports = app;
//sD4nX2JpuzyOo1Hd90SYz3vdNXz1XuqTM4zRXQi8 