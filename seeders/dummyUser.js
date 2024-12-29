const Users =require("../models/users");
const dbConnect = require("../config/database");
const { default: mongoose } = require("mongoose");
const dotenv = require("dotenv").config();
const bcrypt = require("bcrypt");
const institutions = require("../models/institutions");


const seedUser=async()=>{
    const salt = await bcrypt.genSaltSync(10);


    const institution={
        "institutionName":"Ministry of Finance and Economic Planning",
        "email":"info@minecofin.gov.rw",
        "mobile":"0100",
        "acronym":"MINECOFIN",
        "profilePicture": ""
    }

    try {
        const email=process.env.USER_EMAIL
        
        await Users.deleteOne({email});
        await institutions.deleteMany({})
        const createInstitution= await institutions.insertMany(institution);

        const adminUser=[{
            "Title":"Mr",
            fullNames: "Administartor",
            email: process.env.USER_EMAIL,
            mobile:"070000000",
            password:await bcrypt.hash(process.env.USER_PASSWORD, salt),
            role:'admin',
            position:"BMO",
            institution:createInstitution[0]._id,
            passwordResetToken: undefined,
            passwordResetExpires: undefined,
        }]
        await Users.insertMany(adminUser);
        console.log("success")
    } catch (error) {

        console.log("seeds failed\n",error);
        
    }

}

dbConnect().then(() => {
    console.log("Database connected!");
    seedUser().then(()=>{
        mongoose.connection.close();
    });
})