const Users=require("../models/users");
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
    const findInstitution=await Institutions.findOne({email});

    if (findUser && (await findUser.isPasswordMatched(password))) {
        res.json({
          token: generateToken(findUser?._id),
          loginAs:0
        });
    } else if(findInstitution && (await findInstitution.isPasswordMatched(password))){
        res.json({
            token: generateToken(findInstitution?._id),
            loginAs:1
          });
    } else {
        throw new Error("Email or password don't match");
    }
})

const viewProfile=asyncHandler(async(req,res)=>{
    const {_id,type}=req.user;
    validateMongodbId(_id);
    let getProfile;
    try{
        if(type === 0){
            getProfile= await Users.findById(_id,{password:0,passwordResetToken:0,passwordResetExpires:0});
        }else{
            getProfile= await Institutions.findById(_id,{password:0,passwordResetToken:0,passwordResetExpires:0});
        } 
        res.json({
            getProfile,
            type
          });
    } catch (error) {
        throw new Error(error);
    }
})

const forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;
    
    if(!email) throw new Error("All fields are required");

    try {  
        const user = await Users.findOne({ email });
        const institution = await Institutions.findOne({ email });
        let OTPCode;
        let email;
        if (user) {
            OTPCode = await Users.createPasswordResetToken();
            user.email
            await user.save();
        }else if(institution){
            OTPCode = await Institutions.createPasswordResetToken();
            email=institution.email
            await institution.save();
            
        }else
         throw new Error("User with this email not found");
        await sendEmail({
            email: email,
            subject: "Your password Reset OTP code (valid for 10 min )",
            message:"Kode yo guhindura ijambo banga ryawe ni \n \n ${OTPCode}.\n Niba utasabye guhindura ijambo banga ryawe,irengangize iyi message.",
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
    const { OTPCode } = req.params;
    const user = await Users.findOne({
      passwordResetToken: OTPCode,
      passwordResetExpires: { $gt: Date.now() },
    });

    const institution = await Institutions.findOne({
        passwordResetToken: OTPCode,
        passwordResetExpires: { $gt: Date.now() },
    });

    if (user){
        user.password = password;
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save();
        res.json({
          message:"Password changed succesfully"
        });
    }else if (institution){
        institution.password = password;
        institution.passwordResetToken = undefined;
        institution.passwordResetExpires = undefined;
        await institution.save();
        res.json({
          message:"Password changed succesfully"
        });
    }else throw new Error(" OTP Code Expired or is invalid, Request another one");
  });
  
  
  const changePassword = asyncHandler(async (req, res) => {
    const { _id,type } = req.user;
    validateMongodbId(_id);
    let user;
    try {
        if(type===0){
            user= await Users.findOne({_id});
        }else{
            user= await Institutions.findOne({_id});
        }
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
    viewProfile
};

