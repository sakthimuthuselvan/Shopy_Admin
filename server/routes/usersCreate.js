const express = require("express");
const route = express();
const {createWholeSeller, loginWholeSeller,createRetailer, forgotPassword, emailSend} = require("../controllers/userRegister");

// productBazzar/create/wholeseller
route.post("/create/wholeseller",createWholeSeller)

// productBazzar/user/login
route.post("/user/login",loginWholeSeller)

// productBazzar/create/retailer
route.post("/create/retailer",createRetailer)


module.exports = route;
