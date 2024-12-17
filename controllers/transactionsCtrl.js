const Transaction=require('../models/transactions')
const asyncHandler=require('express-async-handler')
const validateMongodbId=require('../utils/validateMongodbId')
const Budget=require('../models/budget')
const Institution=require('../models/institutions')
const addTransaction=asyncHandler(async(req,res)=>{
    try {
        const {
        type,
        transactionDescription,
        amount,
        institution,
        budget,
        category
        }=req.body;

        validateMongodbId(budget);
        validateMongodbId(institution);

        if(!type || !transactionDescription || !amount || !institution || !budget || !category){
            throw new Error("All fields are required")
        }

        const budgetExist=await Budget.findById(budget);
        if(!budgetExist){
            throw new Error("Budget not found");
        }

        if(!await Institution.findById(institution)){
            throw new Error("Institution not found");
        }

        // if (budgetExist.status !== "approved") {
        //     throw new Error("Budget is not approved yet!");
        // }

        const newTransaction=await Transaction.create({
            type,
            transactionDescription,
            amount,
            institution,
            budget,
            Slips:"slip",
            recordedBy:req?.user?._id,
            category
        });
        res.json(newTransaction);
    } catch (error) {
        throw new Error(error);
    }
})

const getAllTransactions=asyncHandler(async(req,res)=>{
    try {
        const allTransactions=await Transaction.find({}).sort({createdAt:-1})
        .populate("budget")
        .populate("institution");
        res.json(allTransactions);
    } catch (error) {
        throw new Error(error);
    }
})


module.exports={
    addTransaction,
    getAllTransactions
}