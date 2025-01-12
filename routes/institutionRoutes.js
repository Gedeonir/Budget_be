const {
    addInstitution,
    getOneInstitution,
    getAllInstitutions,
    deleteInstitution,
    updateInstitution,
    updatePicture
}=require("../controllers/institutionsCtrl")

const express=require("express");

const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");

const institutionRoutes=express.Router();

institutionRoutes.post("/new",authMiddleware,isAdmin,addInstitution);
institutionRoutes.get("/one/:id",authMiddleware,getOneInstitution);
institutionRoutes.get("/",authMiddleware,getAllInstitutions);
institutionRoutes.delete("/:id",authMiddleware,isAdmin,deleteInstitution);
institutionRoutes.patch("/:id",authMiddleware,isAdmin,updateInstitution);
institutionRoutes.patch("/upload_profile_picture/upload",authMiddleware,updatePicture);



module.exports=institutionRoutes;
