const express = require("express");
const { UserModel } = require("../model/user.model");
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
require("dotenv").config()

const userRouter = express.Router();

// Register
userRouter.post("/signup",async(req,res)=>{ 
    try {
        let {email, password, confirmPassword} = req.body;
        if(password!==confirmPassword){
            return res.status(400).send({
                error: "Password is not matching."
            })
        }
        const existingUser = await UserModel.find({email});
        if(existingUser.length>0){
            return res.status(400).send({
                error: "Registration failed. User already exists"
            })
        }
        bcrypt.hash(password, 5, async(err, hash)=>{
           if(err){
            res.status(200).json({msg: "Error occured."})
           }else{
             const user = new UserModel({email,password:hash,confirmPassword:hash})
             await user.save();
             res.status(200).json({msg: "The user has been registered.",registerdUser: req.body})
           }
        });

    } catch (err) {
        res.status(500).json({error: err.message})
    }
})

// Login
userRouter.post("/login",async(req,res)=> {
    try {
        let {email, password} = req.body;
        const user = await UserModel.findOne({email})
        if(user){
            bcrypt.compare(password, user.password, async(err,result)=> {
                if(result){
                    const token = jwt.sign({userID: user._id},process.env.secretKey);
                    res.status(200).json({msg: "Login Successful", token});
                }else{
                    res.status(200).json({msg: "Invalid Credentials"});
                }
            })
        }else{
            res.status(400).json({msg: "User does not exist"});
        }
    } catch (err) {
        res.status(500).json({error: err.message});
    }
})

module.exports = {
    userRouter
}