const mongoose=require("mongoose");

let budgetModel=new mongoose.Schema({
    income:[
        {
            incomeSource:{type:String},
            amountExpected:{type:String},
            percentage:{type:String}
        },
    ],
    expenditures:[
        {
            expense:{type:String},
            amountToSpent:{type:String},
            percentage:{type:String}
        },
    ],
    FYI:{
        type:String,
        unique:true,
        required:true
    },
    status:{
        type:String,
        default:"Under review"
    },
    reviewers:[{user:{type: mongoose.Schema.Types.ObjectId, ref: "Users"},message:{type:String},comment:{type:String}}],
    verifiedAndConfirmedBy:{
        type: mongoose.Schema.Types.ObjectId, ref: "Users"
    },
    institution:{
        type: mongoose.Schema.Types.ObjectId, ref: "Institutions"
    }
},
{
    timestamps: true,
}
)

module.exports = mongoose.model("Budgets", budgetModel);
