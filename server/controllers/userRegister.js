const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const { WholeSeller, SuperAdmin, Retailer } = require("../models/userCreateModels")

// "contactPerson": "John Doe",
// "companyName": "ABC wholesellerss Inc.",
// "businessRegistrationNumber": "123456789",
// "industryType": "Electronics",
// "phone": "123-456-7890",
// "email": "john.doe@example.com",
// "password": "hashed_password"

const createWholeSeller = async (req, res) => {
  const { contactPerson, companyName, businessRegistrationNumber, industryType, phone, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await WholeSeller.create({
      contactPerson,
      companyName,
      businessRegistrationNumber,
      industryType,
      phone,
      email,
      password: hashedPassword,
      role: "whole_seller"
    });
    res.status(201).json(newUser);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

const loginWholeSeller = async (req, res) => {
  const { email, password } = req.body;
  console.log(req.body);
  const superAdmin = await SuperAdmin.findOne({ email });
  const wholesellers = await WholeSeller.findOne({ email });
  const retailer = await Retailer.findOne({ email });

  let checkPass = "";
  let role = "";
  let userId = ""
  if (superAdmin) {
    console.log("super admin");
    checkPass = superAdmin.password
    role = "super_admin"
    userId = superAdmin._id
  } else if (wholesellers) {
    console.log("wholesellers");
    checkPass = wholesellers.password
    role = "whole_sellers"
    userId = wholesellers._id
  } else if (retailer) {
    console.log("retailers");
    checkPass = retailer.password
    role = "retailers"
    userId = retailer._id
  } else {
    console.log("invaild");
  }

  try {
    if (!email || !password) {
      return res.status(400).json({ response: "failure", message: "Invalid email or password" })
    }
    const isValidPassword = await bcrypt.compare(password, checkPass)
    if (!isValidPassword) {
      return res.status(400).json({ response: "failure", message: "Invalid password" })
    }
    const token = jwt.sign({ user_id: userId }, "_PRODUCTBAZZAR", { expiresIn: '15min' })
    return res.status(200).json({ response_type: "success", response_message: "Login Successfully", data: { token, role } })
  } catch {
    res.status(500).json({ response: "failure", message: err.message })
  }
}

// {
//   "wholeseller_id":{
//     "$oid": "6559e9bbb803969a20c3fa62"
//   },
//   "email": "retailer@example.com",
//   "password": "securePassword123",
//   "storeName": "ABC Retailers Inc.",
//   "contactPerson": "John Doe",
//   "businessRegistrationNumber": "RB789012",
//   "address": {
//     "street": "789 Retail Street",
//     "city": "Retailville",
//     "state": "tamil Nadu",
//     "zipCode": "627811"
//   },
//   "phone": "567-890-1234",
//   "preferredWholesaler": "ABC Wholesalers Inc."
// }
const createRetailer = async (req, res) => {
  const { wholeseller_id, email, password, storeName, contactPerson, businessRegistrationNumber, phone, preferredWholesaler } = req.body;
  const { street, city, state, zipCode } = req.body.address;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await Retailer.create({
      wholeseller_id,
      email,
      password,
      storeName,
      contactPerson,
      businessRegistrationNumber,
      password: hashedPassword,
      address:{
        street,
        city,
        state,
        zipCode
      },
      phone,
      preferredWholesaler,
      role: "retailer"
    });
    res.status(201).json(newUser);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}


module.exports = { createWholeSeller, loginWholeSeller, createRetailer}