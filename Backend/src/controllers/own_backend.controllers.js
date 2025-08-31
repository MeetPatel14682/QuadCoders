import mongoose from "mongoose";
import { Backend } from "../models/own_backend.models.js";
import ApiResponse from '../utils/ApiResponse.js';
import ApiError from '../utils/ApiError.js';
import asynchandler from '../utils/asynchandler.js';

// Create Backend Controller
const insertInformation = asynchandler(async (req, res) => {

    const {company, address, phoneNumber, owner, email,
        license, gstno, pancardId, RazorpayId, RazorpaySecret, taxId, CIN} = req.body;
    if (!address || !email || !phoneNumber || !owner || !license || !gstno || !RazorpayId || !RazorpaySecret || !taxId || !CIN || !pancardId) {
        return res.status(400).json(new ApiError(400, "All fields are required"));
    }
    const newBackend = new Backend({
        company,
        address,    
        phoneNumber,
        owner,
        license,
        email,
        gstno,
        pancardId,
        RazorpayId,
        RazorpaySecret,
        taxId,
        CIN
    });
    await newBackend.save();
    await newBackend.populate('company', 'companyName email -_id');
    res.status(201).json(new ApiResponse(201, "Information created successfully", newBackend));

});

const getInformation = asynchandler(async (req, res) => {
    const { id } = req.user?._id;
    const info = await Backend.findOne({ company: id }).populate('company', 'companyName email -_id');
    if (!info) {
        return res.status(404).json(new ApiError(404, "Information not found"));
    }
    res.status(200).json(new ApiResponse(200, "Information fetched successfully", info));
});

const updateInformation = asynchandler(async (req, res) => {
    const { id } = req.user?._id;
    const { address, phoneNumber, owner,
        license, gstno, RazorpayId, RazorpaySecret, taxId, CIN} = req.body;
    if (!address && !phoneNumber && !owner && !license && !gstno && !RazorpayId && !RazorpaySecret && !taxId) {
        return res.status(400).json(new ApiError(400, "At least one field is required to update"));
    }   
    const info = await Backend.findOne({ company: id });
    if (!info) {
        return res.status(404).json(new ApiError(404, "Information not found"));
    }
    if (address) info.address = address;
    if (phoneNumber) info.phoneNumber = phoneNumber;
    if (owner) info.owner = owner;
    if (license) info.license = license;
    if (gstno) info.gstno = gstno;
    if (RazorpayId) info.RazorpayId = RazorpayId;
    if (RazorpaySecret) info.RazorpaySecret = Razorpay
    if (taxId) info.taxId = taxId;
    
    await info.save();
    await info.populate('company', 'companyName email -_id');
    res.status(200).json(new ApiResponse(200, "Information updated successfully", info));
});

export { getInformation, insertInformation, updateInformation };    

