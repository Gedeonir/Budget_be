const Budget=require('../models/budget');
const asyncHandler=require('express-async-handler');
const validateMongodbId = require("../utils/validateMongodbId");
const sendEmail=require("../utils/sendEmail");


const addBudget=asyncHandler(async(req,res)=>{

})

const getAllBudgets=asyncHandler(async (req,res)=>{
    try {
        const allBudgets=await Budget.find({})
        .populate("institution")
        .populate({path:"reviewers",populate:"user"})
    } catch (error) {
        
    }
})