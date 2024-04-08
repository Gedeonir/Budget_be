const mongoose=require("mongoose")

let transactionsModel=new mongoose.Schema({
    type:{
        type:String,
        required:true
    },
    transactionDescription:{
        type:String
    },
    amount:{
        type:String,
        required:true
    },
    institution:{
        type: mongoose.Schema.Types.ObjectId, ref: "Institutions",
        required:true
    },
    budget:{
        type: mongoose.Schema.Types.ObjectId, ref: "Budgets",
        required:true
    },
    Slips:{
        type:String,
        required:true
    }
},{timestamps:true});

module.exports = mongoose.model("Transactions", transactionsModel);