import express from "express";
import jwt from "jsonwebtoken";
import bcrypt, { hash } from "bcrypt";
import { UserModel } from "../models/Users.js";

const router = express.Router()

router.post("/register", async (req, res) => {
    const {username, password} = req.body;

    const user = await UserModel.findOne({ username });

    // if user exist return message
    if (user) {
        return res.json({message: "User already exists"});
    } 

    // if user doesnt exist create new user with password
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new UserModel({username, password: hashedPassword});
    await newUser.save();
    res.json({message: "User registered"});
});

router.post("/login", async (req, res) => {
    const {username, password} = req.body;
    const user = await UserModel.findOne({ username });

    // if not user
    if (!user) {
        return res.json({message: "User doesnt exist"});
    }

    // password we want to compare it with password from database of user
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    // if password is not true return message
    if (!isPasswordValid) {
        return res.json({message: "Username or password is incorrect"});
    }

    // if user exist return token and id
    const token = jwt.sign({id: user._id}, "secret");
    res.json({token, userID: user._id});
});

export { router as userRouter };