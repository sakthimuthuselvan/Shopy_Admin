const express = require("express");
const route = express();
const {createUser,loginUser} = require("../controllers/userRegister");

// shopy/create/wholeseller
route.post("/create/wholeseller",createUser)

// shopy/user/login
route.post("/user/login",loginUser)




module.exports = route;
