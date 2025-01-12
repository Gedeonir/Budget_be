const dotenv = require("dotenv").config();
const Users = require("../models/users");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

const authMiddleware = asyncHandler(async (req, res, next) => {
  let token;
  if (req?.headers?.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1].replace(/"/g, '');
    
    try {
      if (token) {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await Users.findById(decoded?.id).populate("institution")
        req.user = user;
        next();
      }
    } catch (error) {
      throw new Error("Not Authorized or token expired, Please Login again",error);
    }
  } else {
    throw new Error(" There is no token attached to header");
  }
});

const isAdmin = asyncHandler(async (req, res, next) => {
  const { email } = req.user;
  const adminUser = await Users.findOne({ email });
  if (adminUser.role !== "admin") {
    throw new Error("This task require administrator privileges");
  } else {
    next();
  }
});

module.exports = { authMiddleware, isAdmin };