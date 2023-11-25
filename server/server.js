const express = require("express");
const dbConnect= require("./config/database")
const wholeSellerSignUp  = require("./routes/usersCreate");
var bodyParser = require('body-parser')
const nodemailer = require('nodemailer');
require('dotenv').config()

const port = process.env.PORT;

const app = express();

app.use(bodyParser.json())
dbConnect()

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'productbazzar531@gmail.com',
      pass: 'hctg fslr aqvn zfss'
    },
    debug: true,
  });

  app.post('/send/email', (req, res) => {
    const { email } = req.body;
  console.log(email);
    const mailOptions = {
      from: 'productbazzar531@gmail.com',
      to: email,
      subject : "hello",
      text: "check email"
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('Error:', error.message);
          res.status(500).json({ error: 'Failed to send email' });
        } else {
          console.log('Email sent:', info.response);
          res.json({ message: 'Email sent successfully' });
        }
      });
    });

  
app.use("/productBazzar",wholeSellerSignUp)

app.listen(port,()=>{
    console.log("running port",port)
})