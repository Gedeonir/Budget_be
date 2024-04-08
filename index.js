const bodyParser = require("body-parser");
const express = require("express");
const dbConnect = require("./config/database");
const { notFound, errorHandler } = require("./middlewares/errorHandler");
const app = express();
const dotenv = require("dotenv").config();
const PORT = process.env.PORT || 5000;

const morgan = require("morgan");
const cors = require("cors");

app.use(morgan("dev"));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/", async(req,res)=>{
    return res.json({
        message:"Welcome to budget planning and execution website"
    })
});

const {authRoutes}=require("./routes/authRoutes")

app.use(notFound);
app.use(errorHandler);

app.use("api/auth/",authRoutes);

dbConnect().then(()=>{
  console.log("Database connected sucessfully");
  app.listen(PORT, () => {
    console.log(`Server is running  at PORT ${PORT}`);
  })
}
);