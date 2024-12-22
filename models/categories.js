const mongoose = require("mongoose");

let category=new mongoose.Schema({
    category:{type:String,required:true},
    type:{type:String},
    institution:{type: mongoose.Schema.Types.ObjectId, ref: "Institutions"},
},{timestamps:true});

module.exports=mongoose.model("Categories",category);