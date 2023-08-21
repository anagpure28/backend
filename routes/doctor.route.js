const express = require("express");
const { auth } = require("../middleware/auth.middleware");
const { DoctorModel } = require("../model/doctor.model");
require("dotenv").config()

const doctorRouter = express.Router();

//Search
doctorRouter.get("/search",async(req,res)=> {
    try {
        const {searchQuery} = req.query;
        const name = new RegExp(searchQuery,"i");
        const doctors = await DoctorModel.find({name})
        res.status(200).json(doctors)
    } catch (err) {
        res.status(400).json({error: err.message})
    }
})

// Add Doctor
doctorRouter.post("/appointments",auth,async(req,res)=> {
    try {
        const doctor = new DoctorModel(req.body);
        await doctor.save();
        res.status(200).json({msg: "Profile created successfully!!", profile: req.body})
    } catch (err) {
        res.status(400).json({error: err.message})
    }
})

// Get Doctor
doctorRouter.get("/",auth,async(req,res)=> {
    try {
        const doctors = await DoctorModel.find({userID: req.body.userID})
        res.status(200).json(doctors)
    } catch (err) {
        res.status(400).json({error: err.message})
    }
})

// Update
doctorRouter.patch("/update/:doctorID",auth,async(req,res)=> {

    const userIDinUserDoc = req.body.userID
    const {doctorID} = req.params
    try {
        const doctor = await DoctorModel.findOne({_id:doctorID})
        const userIDinDoctorDoc =  doctor.userID
        if(userIDinUserDoc === userIDinDoctorDoc) {
            await DoctorModel.findByIdAndUpdate({_id:doctorID},req.body)
            res.json({msg: `${doctor.name}'s data has been updated`})
        }else{
            res.json({msg: "Not Authorized!!"})
        }
    } catch (err) {
        res.json({error: err})
    }
})

//Delete
doctorRouter.delete("/delete/:doctorID",auth,async(req,res)=> {
    const userIDinUserDoc = req.body.userID
    const {doctorID} = req.params
    try {
        const doctor = await DoctorModel.findOne({_id:doctorID})
        const userIDinDoctorDoc =  doctor.userID
        if(userIDinUserDoc === userIDinDoctorDoc) {
            await DoctorModel.findByIdAndDelete({_id:doctorID})
            res.json({msg: `${doctor.name}'s data has been deleted`})
        }else{
            res.json({msg: "Not Authorized!!"})
        }
    } catch (err) {
        res.json({error: err})
    }
})

module.exports = {
    doctorRouter
}