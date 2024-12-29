const Users=require("../models/users");
const asyncHandler = require("express-async-handler");
const { generateToken } = require("../utils/jwtToken");
const validateMongodbId = require("../utils/validateMongodbId");
const Institution=require("../models/institutions");
const sendEmail=require("../utils/sendEmail");
const uploadImage = require("../utils/uploadImage");

const viewProfile=asyncHandler(async(req,res)=>{
    const {id}=req.user;
    validateMongodbId(id);
    try{
        
        const getProfile= await Users.findById(id,{password:0,passwordResetToken:0,passwordResetExpires:0}).populate("institution");
        res.json({
            getProfile,
          });
    } catch (error) {
        throw new Error(error);
    }
})

const updatePicture=asyncHandler(async(req,res)=>{
    const {id}=req.user;
    validateMongodbId(id);
    const {picture}=req.body;
    try {
        if (!picture ) {
            throw new Error('picture is required.');
        }
        const result = await uploadImage(picture, 'bpe/profile_pictures', `user_${id}`);
        const updateProfile = await Users.findByIdAndUpdate(
            id,
            { profilePicture: result.url },
            { new: true }
        );
        res.json(updateProfile);
    } catch (error) {
        throw new Error(error);
    }
})



const newUser=asyncHandler(async(req,res)=>{
    const{title,fullNames,email,mobile,password,position,institution}=req.body;

    console.log(institution);
    

    if(!fullNames || !email||!mobile||!password||!position ||!institution) throw new Error("All fields are required");

    validateMongodbId(institution)

    const getInstitution=await Institution.findById(institution);

    if (!getInstitution) {
        throw new Error("No such instution found");
    }
    if(await Users.findOne({email})) throw new Error("User already exists");

    try {
        const newUser=await Users.create({
            title,
            fullNames,
            email,
            mobile,
            password,
            position,
            institution:getInstitution._id
        })

        await sendEmail({
            email: newUser.email,
            subject: "Your password",
            message:"Your password is \n \n" + password,
        });

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
    const{fullNames,email,mobile,institution,position,role}=req.body;

    const {id}=req.params;
    validateMongodbId(id)

    if(!fullNames || !email||!mobile||!position) throw new Error("All fields are required");
    try {
        const updateUser=await Users.findByIdAndUpdate(id,{
            fullNames,
            email,
            mobile,
            position,
            institution,
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
    updateUser,
    updatePicture
}

