const Budget=require('../models/budget');
const asyncHandler=require('express-async-handler');
const validateMongodbId = require("../utils/validateMongodbId");
const sendEmail=require("../utils/sendEmail");
const Request=require('../models/budgetRequests');
const Users=require('../models/users');
const categories = require('../models/categories');

const addBudget=asyncHandler(async(req,res)=>{
    const {fyi,amount,expenses,institution,user,revenues,description}=req.body;

    if (!fyi || !amount || !institution || !description) throw new Error("All fields are required");
    
    if(await Budget.findOne({fyi,institution})){
        throw new Error("Budget already exists"); 
    }

    try {

        const newBudget=await Budget.create({
            expenditures:expenses,
            revenues:revenues,
            fyi:fyi,
            amount:amount,
            institution:institution,
            description:description,
            createdBy:user,
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
    const {email,fullNames}=req.user;
    try {
        const updateBudget=await Request.findByIdAndUpdate(id,{
            $push:{reviewers}
        },{
            new:true
        });

        reviewers.forEach(async (reviewer) => {
            const {user}=reviewer;
            const newUser=await Users.findById(user);
            if (newUser) {
                await sendEmail({
                    email: newUser.email,
                    subject: "You have been added as a reviewer",
                    message:email+"(" + fullNames +") has been added you as a reviewer to  budget request. \n \n Follow this link to approve or reject the request: \n" + "https://budgetplaningandexecution.netlify.app/budget/requests/"+updateBudget._id,
                });
            }            
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
            description,
            requestedBy:req?.user?._id
        });

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
        .populate("requestedBy").sort({createdAt:-1})



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
        .populate("requestedBy")
        .populate({path:"comment",populate:[
            { path: "user" },
            { path: "requested" }
        ]})



        res.json(request);
    } catch (error) {
        throw new Error(error);
    }
})

const sendReview=asyncHandler(async(req,res)=>{
    const {requestId}=req.params;
    const {id}=req.user;
    const { reviewerStatus} = req.body;    

    try {
        const request = await Request.findOneAndUpdate(
            { _id: requestId, "reviewers.user": id },
            { $set: { "reviewers.$.reviewerStatus": reviewerStatus } },
            { new: true }
        ).populate('reviewers.user');      

        res.json(request);
        
    } catch (error) {
        throw new Error(error);
        
    }
})

const addComents=asyncHandler(async(req,res)=>{
    const {id}=req.params;
    validateMongodbId(id);
    const {comment}=req.body;
    try {
        const updateRequest=await Request.findByIdAndUpdate(id,{
            $push:{comment}
        },{
            new:true
        });
        res.json(updateRequest);
    } catch (error) {
        throw new Error(error);
    }
})

const modifyRequest=asyncHandler(async(req,res)=>{
    const {requestId}=req.params;
    validateMongodbId(requestId);
    const {status}=req.body;
    try {
        const updateRequest=await Request.findByIdAndUpdate(requestId,{
            status
        },{
            new:true
        });
        res.json(updateRequest);
    } catch (error) {
        throw new Error(error);
    }
})

const approveBudget=asyncHandler(async(req,res)=>{
    const {id}=req.params;
    validateMongodbId(id);
    const {status}=req.body;
    try {
        const updateBudget=await Budget.findByIdAndUpdate(id,{
            status
        },{
            new:true
        });
        res.json(updateBudget);
    } catch (error) {
        throw new Error(error);
    }
})

const addExenpenseOrIncome=asyncHandler(async(req,res)=>{
    const {id}=req.params;
    validateMongodbId(id);
    const {type,category}=req.body;
    try {
        if(!type || !category) throw new Error("All fields are required");

        if(await categories.findOne({category,institution:id})) throw new Error("Category already exists");
        const newExpenseOrIncome=await categories.create({
            category:category,
            type:type,
            institution:id
        })

        res.json(newExpenseOrIncome);
    }catch (error) {
        throw new Error(error)
    }
})

const getAllCategories=asyncHandler(async(req,res)=>{
    try{
        const getCategories=await categories.find()
        .populate("institution");
        res.json(getCategories);
    }catch(error){
        throw new Error(error)
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
    getOneRequest,
    addComents,
    sendReview,
    modifyRequest,
    approveBudget,
    addExenpenseOrIncome,
    getAllCategories
}