const Users=require("../models/users");
const asyncHandler = require("express-async-handler");
const { generateToken } = require("../utils/jwtToken");
const validateMongodbId = require("../utils/validateMongodbId");
const Institution=require("../models/institutions");

const viewProfile=asyncHandler(async(req,res)=>{
    const {_id}=req.user;
    validateMongodbId(_id);
    try{
        
        const getProfile= await Users.findById(_id,{password:0,passwordResetToken:0,passwordResetExpires:0});
        res.json({
            getProfile,
          });
    } catch (error) {
        throw new Error(error);
    }
})

const newUser=asyncHandler(async(req,res)=>{
    const {institution}=req.params;
    const{fullNames,email,mobile,password,position,role}=req.body;

    if(!fullNames || !email||!mobile||!password||!position||!role) throw new Error("All fields are required");

    const getInstitution=await Institution.findById(institution);

    if (!getInstitution) {
        throw new Error("No such instution found");
    }
    if(Users.findOne({email})) throw new Error("User already exists");

    try {
        const newUser=await Users.create({
            fullNames,
            email,
            mobile,
            password,
            role,
            position,
            institution:getInstitution._id
        })

        res.json({newUser});
    } catch (error) {
        throw new Error(error);
    }

});


const getOneUser=asyncHandler(async(req,res)=>{
    const {id}=req.params;
    validateMongodbId(id);
    try{
        const oneUser=await Users.findById(_id);
        res.json({
            oneUser
        })
    }catch(error){
        throw new Error(error)
    }
});

const getAllUsers = asyncHandler(async (req, res) => {
    try {
      const getUsers = await Users.find({});
      res.json(getUsers);
    } catch (error) {
      throw new Error(error);
    }
});

const deleteUser=asyncHandler(async(req,res)=>{
    const {id}=req.params;
    validateMongodbId(id);

    try {
        await Users.findByIdAndDelete(id)
        res.json({
            message:"User deleted succesfully"
        })
    } catch (error) {
        throw new Error(error)
    }
})

const updateUser=asyncHandler(async(req,res)=>{
    const{fullNames,email,mobile,password,position,role}=req.body;

    if(!fullNames || !email||!mobile||!password||!position||!role) throw new Error("All fields are required");
    try {
        const updateUser=await Users.findByIdAndUpdate({
            fullNames,
            email,
            mobile,
            password,
            position,
            role
        })

        res.json({updateUser});
    } catch (error) {
        throw new Error(error);
    }

});

module.exports={
    viewProfile,
    newUser,
    getAllUsers,
    getOneUser,
    deleteUser,
    updateUser
}

