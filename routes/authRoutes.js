const{
    login,
    viewProfile,
    changePassowrd,
    forgotPassword,
    resetPassword
}=require("../controllers/authCtrl")
const express=require("express");

const { authMiddleware, isAdmin, authMiddlewareAdmin } = require("../middlewares/authMiddleware");

const authRoutes=express.Router();

authRoutes.post("/login",login);

module.exports = {authRoutes};