const mongoose=require("mongoose");


let institutionsModel=new mongoose.Schema({
    institutionName:{
        type:String,
        required:true
    },
    acronym:{
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
        type: String,
        default: "",
    },
},
{
    timestamps: true,
}
);
//Export the model
module.exports = mongoose.model("Institutions", institutionsModel);
