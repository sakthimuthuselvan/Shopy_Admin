const express = require("express");
const dbConnect= require("./config/database")
const userSignup  = require("./routes/usersCreate");
var bodyParser = require('body-parser')
const cors = require('cors');

require('dotenv').config()

const port = process.env.PORT;

const app = express();

app.use(bodyParser.json())
app.use(cors())
dbConnect()


  app.post("/update", (req, res) => {
    res.status(200).json({ message: "success" });
  });
  
app.use("/shopy",userSignup)

app.listen(port,()=>{
    console.log("running port",port)
})