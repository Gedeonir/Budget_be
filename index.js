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

app.use("/api/welcome", async(req,res)=>{
    return res.json({
        message:"Welcome to budget planning and execution website"
    })
});

const authRoutes=require("./routes/authRoutes");
const institutionRoutes  = require("./routes/institutionRoutes");
const userRoutes  = require("./routes/usersRoutes");

app.use("/api/auth",authRoutes);
app.use("/api/institutions",institutionRoutes);
app.use("/api/users",userRoutes);

app.use(notFound);
app.use(errorHandler);

dbConnect().then(()=>{
  console.log("Database connected sucessfully");
  app.listen(PORT, () => {
    console.log(`Server is running  at PORT ${PORT}`);
  })
}
);