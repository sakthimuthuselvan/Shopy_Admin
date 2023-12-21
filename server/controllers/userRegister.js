const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const { UserSchema, } = require("../models/userCreateModels")


const createUser = async (req, res) => {
  const { name, phone, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await UserSchema.create({
      name,
      phone,
      email,
      password: hashedPassword,
    });
    res.status(201).json(newUser);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  console.log(req.body);
  const user = await UserSchema.findOne({ email });


  try {
    if (!email || !password) {
      return res.status(400).json({ response: "failure", message: "Invalid email or password" })
    }
    const isValidPassword = await bcrypt.compare(password, user.password)
    if (!isValidPassword) {
      return res.status(400).json({ response: "failure", message: "Invalid password" })
    }
    const token = jwt.sign({ user_id: user._id }, "_SHOPY", { expiresIn: '15min' })
    return res.status(200).json({ response_type: "success", response_message: "Login Successfully", data: { token: token } })
  } catch {
    res.status(500).json({ response: "failure", message: err.message })
  }
}

module.exports = { createUser, loginUser}