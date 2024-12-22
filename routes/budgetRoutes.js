const {
    addBudget,
    getAllBudgets,
    getOneBudget,
    addContributors,
    addReviewers,
    removeContributors,
    removeReviewers,
    updateBudget,
    createRequest,
    getAllRequests,
    getOneRequest,
    addComents,
    sendReview,
    modifyRequest,
    approveBudget,
    getAllCategories,
    addExenpenseOrIncome
}=require("../controllers/budgetCtrl");

const express=require("express");

const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const { getAllTransactions, addTransaction } = require("../controllers/transactionsCtrl");

const budgetRoutes=express.Router();

budgetRoutes.post("/new",authMiddleware,addBudget);
budgetRoutes.get("/one/:id",authMiddleware,getOneBudget);
budgetRoutes.get("/",authMiddleware,getAllBudgets);
budgetRoutes.patch("/:id",authMiddleware,updateBudget);
budgetRoutes.patch("/addContributors/:id",authMiddleware,addContributors);
budgetRoutes.patch("/addReviewers/:id",authMiddleware,addReviewers);
budgetRoutes.patch("/removeContributors/:id",authMiddleware,removeContributors);
budgetRoutes.patch("/removeReviewers/:id",authMiddleware,removeReviewers);
budgetRoutes.post("/request/createRequest",authMiddleware,createRequest);
budgetRoutes.get("/request/all",authMiddleware,getAllRequests);
budgetRoutes.get("/request/:id",authMiddleware,getOneRequest);
budgetRoutes.patch("/request/comment/:id",authMiddleware,addComents);
budgetRoutes.patch("/request/:requestId/review",authMiddleware,sendReview);
budgetRoutes.patch("/request/:requestId/modify",authMiddleware,modifyRequest);
budgetRoutes.patch("/:id/approve",authMiddleware,isAdmin,approveBudget);

budgetRoutes.get("/transactions/all",authMiddleware,getAllTransactions);
budgetRoutes.post("/transaction/new",authMiddleware,addTransaction);

budgetRoutes.post("/categories/new/:id",authMiddleware,addExenpenseOrIncome);
budgetRoutes.get("/categories/all",authMiddleware,getAllCategories);

module.exports= budgetRoutes;
