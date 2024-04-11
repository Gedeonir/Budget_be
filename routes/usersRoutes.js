const{
    viewProfile,
    newUser,
    getAllUsers,
    getOneUser,
    deleteUser,
    updateUser,
}=require("../controllers/usersCtrl");

const express=require("express");

const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");

const userRoutes=express.Router();

userRoutes.post("/new/:id",authMiddleware,isAdmin,newUser);
userRoutes.get("/:id",authMiddleware,getOneUser);
userRoutes.get("/",authMiddleware,getAllUsers);
userRoutes.delete("/:id",authMiddleware,isAdmin,deleteUser);
userRoutes.get("/one/about",authMiddleware,viewProfile);
userRoutes.put("/:id",authMiddleware,isAdmin,updateUser);

module.exports=userRoutes
