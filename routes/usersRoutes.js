const{
    viewProfile,
    newUser,
    getAllUsers,
    getOneUser,
    deleteUser,
    updateUser,
    updatePicture
}=require("../controllers/usersCtrl");

const express=require("express");

const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");

const userRoutes=express.Router();

userRoutes.post("/new/",authMiddleware,isAdmin,newUser);
userRoutes.get("/:id",authMiddleware,getOneUser);
userRoutes.get("/",authMiddleware,getAllUsers);
userRoutes.delete("/:id",authMiddleware,isAdmin,deleteUser);
userRoutes.get("/one/about",authMiddleware,viewProfile);
userRoutes.patch("/:id",authMiddleware,isAdmin,updateUser);
userRoutes.patch("/upload_profile_picture/upload",authMiddleware,updatePicture);

module.exports=userRoutes
