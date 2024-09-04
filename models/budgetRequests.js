const { default: mongoose } = require("mongoose");
const reviewers = require("./reviewers");

const budgetRequest=new mongoose.Schema({
    budget: { type: mongoose.Schema.Types.ObjectId, ref: 'Budgets' },
    description:{type:String},
    reviewers:[{user:{type: mongoose.Schema.Types.ObjectId, ref: "Users"},reviewerStatus:{type:String,default:"pending"}}],
    status:{
        type:String,
        default:"pending"
    },
    requestedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
    comment:[{user:{type: mongoose.Schema.Types.ObjectId, ref: "Users"},message:{type:String},createdAt:{type:Date,default:Date.now()}, category:{type:String},requested:{type: mongoose.Schema.Types.ObjectId, ref: "Users"}}],
},
{
    timestamps: true,
})

module.exports = mongoose.model("Request", budgetRequest);
