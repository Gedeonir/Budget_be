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
    const {id}=req.params;
    validateMongodbId(id)
    const{fullNames,email,mobile,password,position,role}=req.body;

    if(!fullNames || !email||!mobile||!password||!position) throw new Error("All fields are required");

    const getInstitution=await Institution.findById(id);

    if (!getInstitution) {
        throw new Error("No such instution found");
    }
    if(await Users.findOne({email})) throw new Error("User already exists");

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
        const oneUser=await Users.findById(id).populate("institution");
        res.json({
            oneUser
        });
    }catch(error){
        throw new Error(error)
    }
});

const getAllUsers = asyncHandler(async (req, res) => {
    try {
      const getUsers = await Users.find({},{password:0,passwordResetToken:0,passwordResetExpires:0}).populate("institution");
      res.json({getUsers})
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

    const {id}=req.params;
    validateMongodbId(id)

    if(!fullNames || !email||!mobile||!position) throw new Error("All fields are required");
    try {
        const updateUser=await Users.findByIdAndUpdate(id,{
            fullNames,
            email,
            mobile,
            password,
            position,
            role
        },
        {
            new: true,
        }
        )

        res.json({
            message:"User updated succesfully",
        });
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

