var mongoose = require("mongoose");
const {ObjectId}= mongoose.Schema.Types;
var complainSchema = mongoose.Schema({
    title: String,
    body: String,
    complainby:{
        type:ObjectId,
        ref:"User"
    },
    resolved:{
        type:Boolean,
        default:false,
    },
    dateofcomplain:{
        type:Date,
    default:Date.now,
    },
    Status:{
        type:String,
        default:"hold"
    }
    
  });
  var Complain = mongoose.model("Complain", complainSchema);
  module.exports=Complain;