const Users = require("../models/users");
const asyncHandler = require("express-async-handler");
const { generateToken } = require("../utils/jwtToken");
const Institutions=require("../models/institutions");
const validateMongodbId = require("../utils/validateMongodbId");
const sendEmail=require("../utils/sendEmail");
const bcrypt=require("bcrypt")

const login= asyncHandler(async(req,res)=>{
    const {email,password}=req.body;

    if(!email || !password) throw new Error("All fields are required");

    const findUser=await Users.findOne({email});

    if (findUser && (await findUser.isPasswordMatched(password))) {
        res.json({
          token: generateToken(findUser?._id),
        });
    } else {
        throw new Error("Email or password don't match");
    }
})

const forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;
    
    if(!email) throw new Error("All fields are required");

    try {  
        const user = await Users.findOne({ email });
        if(!user) throw new Error("The email is not found")
        const OTPCode = await user.createPasswordResetToken();
        user.passwordResetToken = OTPCode;
        await user.save();

        await sendEmail({
            email: user.email,
            subject: "Your password Reset OTP code (valid for 10 min )",
            message:"Kode yo guhindura ijambo banga ryawe ni \n \n" + OTPCode +"\n Niba utasabye guhindura ijambo banga ryawe,irengangize iyi message.",
        });
    
        res.json({
            message:"Email Sent,Check your email inbox or spam folder"
      });
    } catch (error) {
      throw new Error(error);
    }
});

const resetPassword = asyncHandler(async (req, res) => {
    const { password } = req.body;
    const { OTPCode } = req.body;

    if(!password ||!OTPCode) throw new Error("All fields are required")
    try{
        const user = await Users.findOne({
            passwordResetToken: OTPCode,
            passwordResetExpires: { $gt: Date.now() },
        });

        user.password = password;
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save();
        res.json({
          message:"Password changed succesfully"
        });
    }catch(error){
        throw new Error(" OTP Code Expired or is invalid",error)
    } 
  });
  
  
  const changePassword = asyncHandler(async (req, res) => {
    const {_id} = req.user;
    validateMongodbId(_id);
    
    try {
        const user= await Users.findOne({_id});
            
        //4.get password from reques body
        const { oldpassword, newpassword1, newpassword2 } = req.body;
    
        //5. Check passwords
        const password = await bcrypt.compare(oldpassword, user.password);
        if (!password) {
            throw new Error("The old password is wrong, correct it and try again");
        }
        if (newpassword1 !== newpassword2) {
            throw new Error("new password does not match" );
        }
    
        //6.hash password
    
        //update pass
        user.password = newpassword1;
        await user.save();
    
        res.json({ message: "your password is updated successfully" });
    } catch (error) {
        throw new Error("Unable to change password",error );
    }
  
});

module.exports = {
    login,
    forgotPassword,
    changePassword,
    resetPassword,
};

