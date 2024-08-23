const mongoose=require("mongoose");


let institutionsModel=new mongoose.Schema({
    institutionName:{
        type:String,
        required:true
    },
    acorynm:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        // unique:true
    },
    mobile:{
        type:String,
        required:true,
        // unique:true
    },
    profilePicture: {
        type: Array,
        default: [],
    },
},
{
    timestamps: true,
}
);
//Export the model
module.exports = mongoose.model("Institutions", institutionsModel);
