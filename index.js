const bodyParser = require("body-parser");
const express = require("express");
const dbConnect = require("./config/database");
const { notFound, errorHandler } = require("./middlewares/errorHandler");
const app = express();
const dotenv = require("dotenv").config();
const PORT = process.env.PORT || 5000;

const morgan = require("morgan");
const cors = require("cors");

const socket = require('./utils/socket')


app.use(morgan("dev"));
app.use(cors());
app.use(bodyParser.json({limit:"50mb"}));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

app.use("/api/welcome", async(req,res)=>{
    return res.json({
        message:"Welcome to budget planning and execution website"
    })
});

const authRoutes=require("./routes/authRoutes");
const institutionRoutes  = require("./routes/institutionRoutes");
const userRoutes  = require("./routes/usersRoutes");
const budgetRouter = require("./routes/budgetRoutes")

app.use("/api/auth",authRoutes);
app.use("/api/institutions",institutionRoutes);
app.use("/api/users",userRoutes);
app.use("/api/budget",budgetRouter);

app.use(notFound);
app.use(errorHandler);

dbConnect().then(()=>{
  console.log("Database connected sucessfully");
  const server=app.listen(PORT, () => {
    app.emit("Started");
    console.log(`Server is running  at PORT ${PORT}`);
  })
  socket.socketMethod.socketStarter(server)
});

