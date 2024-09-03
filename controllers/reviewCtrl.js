const review = require("../models/reviewers");
const asyncHandler=require("express-async-handler");
const validateMongodbId = require("../utils/validateMongodbId");

const createReview = asyncHandler(async (req, res) => {
    const { budget, reviewer, status, comment } = req.body;
    try {
        const review = await review.create({ budget, reviewer, status, comment });
        res.json(review);  
    } catch (error) {
        res.json(error);
    }
    
});

