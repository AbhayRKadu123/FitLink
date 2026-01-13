import { UserModel } from "../modal/users.js"
import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const Login = async (req, res) => {
  try {
    let { username, password } = req.body;

    username = username.trim()
    password = password.trim()
    const user = await UserModel.findOne({ username });

    if (!user) return res.status(400).json({ message: "Invalid email or password" });
    user.LoginCount = 1;

    await user?.save()

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).json({ message: "Invalid email or password" });

    const token = jwt.sign({ id: user._id }, 'TOKEN', { expiresIn: "10h" });

    res.status(200).json({ message: "Login successful", token, username: user?.username, id: user?.id });



  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
  ;
const SignUp = async (req, res) => {
  try {
    const userlst = await UserModel.find()
    if (userlst.length > 5) {
      return res.status(400).json({ message: "Registration full" });

    }
    console.log('userlst', userlst)
    let { username, email, password } = req.body;
    console.log('signup', req.body)
    username = username.trim()
    email = email.trim()
    password = password.trim()
    const existingUser = await UserModel.findOne({ username });
    console.log('existingUser', existingUser)
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new UserModel({ username, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
const UpdateOldPassword = async (req, res) => {
  try {
    console.log("value=", req.body)
    let { username, email, password, resetpassword } = req?.body;
    if (username.trim() == "" || email.trim() == "" || password.trim() == "") {
      return res.status(400).json({ message: "something went wrong!" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    let existingUser = await UserModel.findOne({ username: username });
    console.log(existingUser)

    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }
    existingUser.password = hashedPassword;
    await existingUser.save()
    res.status(200).json({ message: "Password Updated succesfully !" });


  } catch (err) {

    res.status(500).json({ message: "Internal server error" });

  }
}

export { Login, SignUp, UpdateOldPassword }