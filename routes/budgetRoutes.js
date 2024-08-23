const {
    addBudget,
    getAllBudgets,
    getOneBudget,
    addContributors,
    addReviewers,
    removeContributors,
    removeReviewers,
    updateBudget
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
budgetRoutes.patch("/removeReviewers/:id",authMiddleware,removeReviewers);

module.exports= budgetRoutes;
