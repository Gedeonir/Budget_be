const mongoose = require("mongoose"); // Erase if already required
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const { type } = require("os");
// Declare the Schema of the Mongo model

let userModel = new mongoose.Schema(
  {
    title: {
      type: String,
      default:"Mr"
    },
    fullNames: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique:true
    },
    mobile: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default:'user'
    },
    position:{
      type:String 
    },   
    profilePicture: {
      type: String,
      default: "",
    },
    institution:{
      type: mongoose.Schema.Types.ObjectId, ref: "Institutions"
    },
    passwordChanged:{type:Boolean,default:false},
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
  },
  {
    timestamps: true,
  }
);

userModel.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSaltSync(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});
userModel.methods.isPasswordMatched = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};
userModel.methods.createPasswordResetToken = async function () {
  this.passwordResetCode = Math.floor(Math
    .random() * (99999 - 10000 + 1)) + 10000;

  this.passwordResetExpires = Date.now() + 30 * 60 * 1000; // 10 minutes
  return this.passwordResetCode;
};

//Export the model
module.exports = mongoose.model("Users", userModel);