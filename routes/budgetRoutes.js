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
    getOneRequest
}=require("../controllers/budgetCtrl");

const express=require("express");

const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");

const budgetRoutes=express.Router();

budgetRoutes.post("/new",authMiddleware,addBudget);
budgetRoutes.get("/one/:id",authMiddleware,getOneBudget);
budgetRoutes.get("/",authMiddleware,getAllBudgets);
budgetRoutes.patch("/:id",authMiddleware,updateBudget);
budgetRoutes.patch("/addContributors/:id",authMiddleware,addContributors);
budgetRoutes.patch("/addReviewers/:id",authMiddleware,addReviewers);
budgetRoutes.patch("/removeContributors/:id",authMiddleware,removeContributors);
budgetRoutes.patch("/removeReviewers/:id",removeReviewers);
budgetRoutes.post("/request/createRequest",authMiddleware,createRequest);
budgetRoutes.get("/request/all",authMiddleware,getAllRequests);
budgetRoutes.get("/request/:id",authMiddleware,getOneRequest);

module.exports= budgetRoutes;
