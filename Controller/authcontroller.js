import { UserModel } from "../modal/users.js"
import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sendEmail } from "../utils/sendEmail.js";

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
    // 1️⃣ Limit total users
    const userCount = await UserModel.countDocuments();
    if (userCount >= 5) {
      return res.status(400).json({ message: "Registration full" });
    }

    let { username, email, password, referralCode } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    username = username.trim();
    email = email.trim();
    password = password.trim();

    // 2️⃣ Check existing user
    const existingUser = await UserModel.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // 3️⃣ Handle referral
    let referrer = null;

    if (referralCode) {
      referrer = await UserModel.findOne({ YourCode: referralCode });
      if (!referrer) {
        return res.status(400).json({ message: "Invalid referral code" });
      }
    }

    // 4️⃣ Create user
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new UserModel({
      username,
      email,
      password: hashedPassword,
      Points: 10 // signup bonus
    });

    let result=await newUser.save();
   

    // 5️⃣ Referral rewards
    if (referrer) {
      referrer.Points = (referrer.Points || 0) + 10;
      await referrer.save();

      newUser.Points += 10;
      await newUser.save();

      sendEmail(
        referrer.email,
        "Referral Bonus",
        "Congratulations! You received 10 points for a successful referral."
      );

      sendEmail(
        newUser.email,
        "Referral Bonus",
        "Congratulations! You received 10 referral bonus points."
      );
    }

    return res.status(201).json({
      message: "User created successfully",
    });

  } catch (error) {
    console.error("Signup Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

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