import mongoose from 'mongoose';
import {Information} from '../models/information.models.js';
import {Register} from '../models/register.models.js';
import asynchandler from '../utils/asynchandler.js';
import  ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import { Backend } from '../models/own_backend.models.js';
import { Status } from '../models/status.models.js';
// Create Information Controller
const createInformation = asynchandler(async (req, res) => {
    const { address, phoneNumber, owner,
      license, gstno, RazorpayId, RazorpaySecret, taxId} = req.body;
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
    const info=await Backend.findById(req.user?.id);
    if(!info){
        return res.status(404).json(new ApiError(404,"No valid company register"));
    }
   console.log("Backend info:", info);
    if(license!==info.license || gstno!==info.gstno || RazorpayId!==info.RazorpayId || RazorpaySecret!==info.RazorpaySecret || taxId!==info.taxId || address!==info.address || phoneNumber!==info.phoneNumber){
        return res.status(400).json(new ApiError(400,"Details must be same as own_backend details"));
    }

   

    await newInfo.save();
     //Add status entry for new user
        const status=new Status({
            userId:req.user._id,
            credits:0,
            month: new Date().getMonth() + 1,
            year: new Date().getFullYear()
        })
        await status.save();
    await newInfo.populate('company', 'companyName email -_id');
    res.status(201).json(new ApiResponse(201, "Information created successfully", newInfo));
});

const getInformation = asynchandler(async (req, res) => {
    const { id } = req.user?._id;
    const objectId = new mongoose.Types.ObjectId(id);
    const info = await Information.findOne({ company: objectId }).populate('company', 'companyName email -_id');
    if (!info) {
        return res.status(404).json(new ApiError(404, "Information not found"));
    }
    res.status(200).json(new ApiResponse(200, "Information fetched successfully", info));
});

const updateInformation = asynchandler(async (req, res) => {
    const { address, phoneNumber, owner,
        license, gstno, RazorpayId, RazorpaySecret, taxId, } = req.body;
    if (!address && !phoneNumber && !owner && !license && !gstno && !RazorpayId && !RazorpaySecret && !taxId) {
        return res.status(400).json(new ApiError(400, "At least one field is required to update"));
    }
     
    // Check if the information exists
    const entry=await Backend.findById(req.user?.id);
    if(!entry){
        return res.status(404).json(new ApiError(404,"No valid company register"));
    }
     
    const user=await  Information.findOne({company:req.user?._id});
    if(!user){
        return res.status(404).json(new ApiError(404,"No information found"));
    }

    // Update only the fields that are provided in the request body
    if (address) user.address = address;
    if (phoneNumber) user.phoneNumber = phoneNumber;
    if (owner) user.owner = owner;
    if (license) user.license = license;
    if (gstno) user.gstno = gstno;
    if (RazorpayId) user.RazorpayId = RazorpayId;
    if (RazorpaySecret) user.RazorpaySecret = RazorpaySecret;
    if (taxId) user.taxId = taxId;

    //check this detail is same as own_backend details
    if(license!==entry.license || gstno!==entry.gstno || RazorpayId!==entry.RazorpayId || RazorpaySecret!==entry.RazorpaySecret || taxId!==entry.taxId || address!==entry.address || phoneNumber!==entry.phoneNumber){
        return res.status(400).json(new ApiError(400,"Details must be same as own_backend details"));
    }

    await user.save();
    res.status(200).json(new ApiResponse(200, "Information updated successfully", user));
});

const deleteInformation = asynchandler(async (req, res) => {
    const { id } = req.user?._id;
    const objectId = new mongoose.Types.ObjectId(id);
    const info = await Information.findOne({ company: objectId });
    if (!info) {
        return res.status(404).json(new ApiError(404, "Information not found"));
    }
    await Information.findByIdAndDelete(info._id);
    res.status(200).json(new ApiResponse(200, "Information deleted successfully", null));
});


// Export Controllers
export {
    createInformation,
    getInformation,
    updateInformation,
    deleteInformation
};

