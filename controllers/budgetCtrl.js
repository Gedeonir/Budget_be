const Budget=require('../models/budget');
const asyncHandler=require('express-async-handler');
const validateMongodbId = require("../utils/validateMongodbId");
const sendEmail=require("../utils/sendEmail");
const Request=require('../models/budgetRequests');

const addBudget=asyncHandler(async(req,res)=>{
    const {fyi,amount,expenses,institution,user,contributors,description}=req.body;

    if (!fyi || !amount || !institution || !description) throw new Error("All fields are required");
    
    if(await Budget.findOne({fyi})){
        throw new Error("Budget already exists"); 
    }

    try {

        const newBudget=await Budget.create({
            expenditures:expenses,
            fyi:fyi,
            amount:amount,
            institution:institution,
            description:description,
            createdBy:user
        });
        res.json(newBudget);
        
    } catch (error) {
        throw new Error(error);
    }

})

const getAllBudgets=asyncHandler(async (req,res)=>{
    try {
        const allBudgets=await Budget.find({})
        .populate("institution")
        .populate({path:"contributors",populate:"user"})
        .populate({path:"verifiedAndConfirmedBy",populate:"user"})

        res.json(allBudgets)
    } catch (error) {
        throw new Error(error)
    }
})

const getOneBudget=asyncHandler(async(req,res)=>{
    const {id}=req.params;
    validateMongodbId(id);
    try{
        const oneBudget=await Budget.findById(id)
        .populate("institution")
        .populate({path:"contributors",populate:"user"})
        .populate({path:"verifiedAndConfirmedBy",populate:"user"})

        res.json(oneBudget);
    } catch (error) {    
        throw new Error(error);
    }
})

const updateBudget=asyncHandler(async(req,res)=>{
    const {id}=req.params;
    validateMongodbId(id);
    const {fyi,amount,expenses,institution,reviewers,contributors,description}=req.body;
    try {
        const updateBudget=await Budget.findByIdAndUpdate(id,{
            fyi,
            amount,
            expenses,
            institution,
            reviewers,
            contributors,   
            description,
        },{
            new:true
        });
        res.json(updateBudget);
    } catch (error) {
        throw new Error(error);
    }
})

const addContributors=asyncHandler(async(req,res)=>{
    const {id}=req.params;
    validateMongodbId(id);
    const {contributors}=req.body;
    try {
        const updateBudget=await Budget.findByIdAndUpdate(id,{
            $push:{contributors}
        },{
            new:true
        });
        res.json(updateBudget);
    } catch (error) {
        throw new Error(error);
    }
})

const addReviewers=asyncHandler(async(req,res)=>{
    const {id}=req.params;
    validateMongodbId(id);
    const {reviewers}=req.body;
    
    try {
        const updateBudget=await Request.findByIdAndUpdate(id,{
            $push:{reviewers}
        },{
            new:true
        });
        res.json(updateBudget);
    } catch (error) {
        throw new Error(error);
    }
})

const removeContributors=asyncHandler(async(req,res)=>{
    const {id}=req.params;
    validateMongodbId(id);
    const {contributors}=req.body;
    try {
        const updateBudget=await Budget.findByIdAndUpdate(id,{
            $pull:{contributors}
        },{
            new:true
        });
        res.json(updateBudget);
    } catch (error) {
        throw new Error(error);
    }
})

const removeReviewers=asyncHandler(async(req,res)=>{
    const {id}=req.params;
    validateMongodbId(id);
    const {reviewers}=req.body;
    
    try {
        const updateBudget=await Request.findByIdAndUpdate(id,{
            $pull:{reviewers}
        },{
            new:true
        });
        res.json(updateBudget);
    } catch (error) {
        throw new Error(error);
    }
})

const createRequest=asyncHandler(async(req,res)=>{
    const {budget,description}=req.body;
    try {
        const newRequest=await Request.create({
            budget,
            description
        });

        if (newRequest) {
            const updatebudget = await Budget.findByIdAndUpdate(budget, {
                status: "pending",
            });
        }
        res.json(newRequest);
    } catch (error) {
        throw new Error(error);
    }
})

const getAllRequests=asyncHandler(async(req,res)=>{
    try {
        const allRequests=await Request.find({})
        .populate("budget")
        .populate({path:"reviewers",populate:"user"})
        .populate({path:"budget",populate:"institution"})


        res.json(allRequests)
    } catch (error) {
        throw new Error(error)
    }
})

const getOneRequest=asyncHandler(async(req,res)=>{
    const {id}=req.params;
    validateMongodbId(id);
    try {
        const request=await Request.findById(id)
        .populate("budget")
        .populate({path:"reviewers",populate:"user"})
        .populate({path:"budget",populate:"institution"})


        res.json(request);
    } catch (error) {
        throw new Error(error);
    }
})


module.exports={
    addBudget,
    getAllBudgets,
    getOneBudget,
    updateBudget,
    addContributors,
    addReviewers,
    removeContributors,
    removeReviewers,
    createRequest,
    getAllRequests,
    getOneRequest
}