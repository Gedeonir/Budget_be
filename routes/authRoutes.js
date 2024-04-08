const{
    login,
    changePassword,
    forgotPassword,
    resetPassword
}=require("../controllers/authCtrl")
const express=require("express");

const { authMiddleware, isAdmin, authMiddlewareAdmin } = require("../middlewares/authMiddleware");

const authRoutes=express.Router();

authRoutes.post("/login",login);
authRoutes.patch("/forgotpassword",forgotPassword);
authRoutes.patch("/resetpassword",resetPassword);
authRoutes.patch("/changepassword",authMiddleware,changePassword);

module.exports = {authRoutes};