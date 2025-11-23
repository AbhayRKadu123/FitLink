import { UserModel } from "../modal/users.js"
import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const Login=async (req, res) => {
  try {
    const { username, password } = req.body;
    
    const user = await UserModel.findOne({ username });

    if (!user) return res.status(400).json({ message: "Invalid email or password" });
    user.LoginCount=1;
    await user?.save()

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).json({ message: "Invalid email or password" });

    const token = jwt.sign({ id: user._id },'TOKEN', { expiresIn: "10h" });
    setTimeout(()=>{
    res.status(200).json({ message: "Login successful", token,username:user?.username,id:user?.id });

    },2000)

  } catch (error) {
    res.status(500).json({ error: error.message });
  }}
;
const SignUp=async(req,res)=>{
   try {
    const { username, email, password } = req.body;
    console.log('signup',req.body)

    const existingUser = await UserModel.findOne({username });
    console.log('existingUser',existingUser)
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new UserModel({ username, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export {Login,SignUp}