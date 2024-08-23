const mongoose=require("mongoose");

let budgetModel=new mongoose.Schema({
    expenditures:[
        {
            expense:{type:String},
            amountToSpent:{type:String},
            percentage:{type:String},
        },
    ],
    revenues:[
        {
            Income:{type:String},
            amountToCollect:{type:String},
            percentage:{type:String},
        },
    ],
    FYI:[{type:String}],
    status:{
        type:String,
        default:"Under review"
    },
    reviewers:[{user:{type: mongoose.Schema.Types.ObjectId, ref: "Users"},message:{type:String},comment:{type:String}}],
    Contributors:[{user:{type: mongoose.Schema.Types.ObjectId, ref: "Users"},message:{type:String},comment:{type:String}}],
    verifiedAndConfirmedBy:{
        type: mongoose.Schema.Types.ObjectId, ref: "Users"
    },
    institution:{
        type: mongoose.Schema.Types.ObjectId, ref: "Institutions"
    },
    amount:{
        type:String
    },
    description:{
        type:String
    },
  
},
{
    timestamps: true,
}
)

module.exports = mongoose.model("Budgets", budgetModel);
