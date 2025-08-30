import mongoose from 'mongoose';
import {Information} from '../models/information.models.js';
import {Register} from '../models/register.models.js';
import asynchandler from '../utils/asynchandler.js';
import  ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import { Backend } from '../models/own_backend.models.js';

// Create Information Controller
const createInformation = asynchandler(async (req, res) => {
    const { address, phoneNumber, owner,
      license, gstno, RazorpayId, RazorpaySecret, taxId, } = req.body;
    if (!address || !phoneNumber || !owner || !license || !gstno || !RazorpayId || !RazorpaySecret || !taxId) {
        return res.status(400).json(new ApiError(400, "All fields are required"));
    }

    const newInfo = new Information({
        company: req.user._id,
        address,
        phoneNumber,
        owner,
        license,
        gstno,
        RazorpayId,
        RazorpaySecret,
        taxId,
    });
    
    //TODO: Check if license, gstno, RazorpayId, RazorpaySecret, taxId are unique and it's is true
  

    await newInfo.save();
    await newInfo.populate('company', 'companyName email -_id');
    res.status(201).json(new ApiResponse(201, "Information created successfully", newInfo));
});

const getInformation = asynchandler(async (req, res) => {
    const { id } = req.user?._id;
    const info = await Information.findOne({ company: id }).populate('company', 'companyName email -_id');
    if (!info) {
        return res.status(404).json(new ApiError(404, "Information not found"));
    }
    res.status(200).json(new ApiResponse(200, "Information fetched successfully", info));
});

const updateInformation = asynchandler(async (req, res) => {
    const { id } = req.user.id;
    const { address, phoneNumber, owner,
        license, gstno, RazorpayId, RazorpaySecret, taxId, } = req.body;
    if (!address && !phoneNumber && !owner && !license && !gstno && !RazorpayId && !RazorpaySecret && !taxId) {
        return res.status(400).json(new ApiError(400, "At least one field is required to update"));
    }
    const info = await Information.findOne({ company: id });
    if (!info) {
        return res.status(404).json(new ApiError(404, "Information not found"));
    }
    if (address) info.address = address;
    if (phoneNumber) info.phoneNumber = phoneNumber;
    if (owner) info.owner = owner;
    if (license) info.license = license;
    if (gstno) info.gstno = gstno;
    if (RazorpayId) info.RazorpayId = RazorpayId;
    if (RazorpaySecret) info.RazorpaySecret = RazorpaySecret;
    if (taxId) info.taxId = taxId;

   

    await info.save();
    await info.populate('company', 'companyName email -_id');
    res.status(200).json(new ApiResponse(200, "Information updated successfully", info));
});

const deleteInformation = asynchandler(async (req, res) => {
    const { id } = req.user?._id;
    const info = await Information.findOne({ company: id });
    if (!info) {
        return res.status(404).json(new ApiError(404, "Information not found"));
    }
    await info.remove();
    res.status(200).json(new ApiResponse(200, "Information deleted successfully", null));
});


// Export Controllers
export {
    createInformation,
    getInformation,
    updateInformation,
    deleteInformation
};

