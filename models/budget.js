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
            income:{type:String},
            amountToCollect:{type:String},
            percentage:{type:String},
        },
    ],
    fyi:{type:String},
    status:{
        type:String,
        default:"pending"
    },
    contributors:[{user:{type: mongoose.Schema.Types.ObjectId, ref: "Users"}}],
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
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
  
},
{
    timestamps: true,
}
)

module.exports = mongoose.model("Budgets", budgetModel);
