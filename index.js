const bodyParser = require("body-parser");
const express = require("express");
const sendEmail = require("./utils/sendEmail");
const app = express();
const dotenv = require("dotenv").config();
const PORT = process.env.PORT || 7000;

const morgan = require("morgan");
const cors = require("cors");

app.use(morgan("dev"));
app.use(cors());
app.use(bodyParser.json({limit:"50mb"}));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

app.use("/api/welcome", async(req,res)=>{
    return res.json({
        message:"Welcome to budget planning and execution website"
    })
});

app.post("/api/sendEmail",async(req,res)=>{
  const {ticket}=req.body;
  await sendEmail({
    email: ticket.email,
    subject: "Your Ticket ID",
    message:"Your complaint on"+formData.title+" has been successfully submitted. Your ticket ID is "+ticket.id,
});
  
})

app.listen(PORT, () => {
  app.emit("Started");
  console.log(`Server is running  at PORT ${PORT}`);
})

