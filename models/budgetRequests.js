const { default: mongoose } = require("mongoose");

const budgetRequest=new mongoose.Schema({
    budget: { type: mongoose.Schema.Types.ObjectId, ref: 'Budgets' },
    description:{type:String},
    reviewers:[{user:{type: mongoose.Schema.Types.ObjectId, ref: "Users"}}],
    status:{
        type:String,
        default:"pending"
    },
    comment:[{user:{type: mongoose.Schema.Types.ObjectId, ref: "Users"},message:{type:String},createdAt:{type:Date,default:Date.now()}}],
},
{
    timestamps: true,
})

module.exports = mongoose.model("Request", budgetRequest);
