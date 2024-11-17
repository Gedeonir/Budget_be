const Transaction=require('../models/transactions')
const asyncHandler=require('express-async-handler')
const validateMongodbId=require('../utils/validateMongodbId')

const addTransaction=asyncHandler(async(req,res)=>{
    try {
        const {
        type,
        transactionDescription,
        amount,
        institution,
        budget,
        Slips,
        }=req.body;

        if(!type || !transactionDescription || !amount || !institution || !budget || !Slips){
            throw new Error("All fields are required")
        }

        const newTransaction=await Transaction.create({
            type,
            transactionDescription,
            amount,
            institution,
            budget,
            Slips,
            recordedBy:req?.user?._id,
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