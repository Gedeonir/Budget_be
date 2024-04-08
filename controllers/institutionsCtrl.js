const Institution=require("../models/institutions");
const asyncHandler = require("express-async-handler");
const validateMongodbId = require("../utils/validateMongodbId");
const sendEmail=require("../utils/sendEmail");

const addInstitution=asyncHandler(async(req,res)=>{
    const {institutionName,email,mobile,password,size}=req.body;

    if(!institutionName ||!email ||!mobile||!password||!size)throw new Error("All fields are required")

    const findInstitution=await Institution.findOne({institutionName});

    if(!findInstitution) throw new  Error("Instution already exists");

    try {
        const newInstitution= await Institution.create({
            institutionName,
            email,
            mobile,
            size
        });

        res.json({
            message:"Institution added succesfully",
            newInstitution
          });
    } catch (error) {
        throw new Error(error)
    }
})

const getOneInstitution=asyncHandler(async(req,res)=>{
    const {id}=req.params;
    validateMongodbId(id);
    try{
        const oneInstitution=await Institution.findById(_id);
        res.json({
            oneInstitution
        })
    }catch(error){
        throw new Error(error)
    }
});

const getAllInstitutions = asyncHandler(async (req, res) => {
    try {
      const getInstitutions = await Institution.find({});
      res.json(getInstitutions);
    } catch (error) {
      throw new Error(error);
    }
});

const deleteInstitution=asyncHandler(async(req,res)=>{
    const {id}=req.params;
    validateMongodbId(id);

    try {
        await Institution.findByIdAndDelete(id)
        res.json({
            message:"Institution deleted succesfully"
        })
    } catch (error) {
        throw new Error(error)
    }
})

const updateInstitution=asyncHandler(async(req,res)=>{
    const {id}=req.params;
    validateMongodbId(id);
    
    const{institutionName,email,mobile,password,size}=req.body

    if(!institutionName ||!email ||!mobile||!password||!size) throw new Error("All fields are required");

    if(await Institution.findOne({email})) throw new Error("Institution already exists")

    try {
        const updateInstitution = await Institution.findByIdAndUpdate(
            id,
            {
                institutionName,
                email,
                mobile,
                size
            },
            {
                new: true,
            }
        )

        res.json(updateInstitution)
    } catch (error) {
     throw new Error(error)   
    }
})

module.exports={
    addInstitution,
    getOneInstitution,
    getAllInstitutions,
    deleteInstitution,
    updateInstitution
}