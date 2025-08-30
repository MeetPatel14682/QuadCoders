import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import asynchandler from '../utils/asynchandler.js';
import { Status } from '../models/status.models.js';

const getStatus = asynchandler(async (req, res) => {
     console.log("User in getStatus:", req.user);
    const userId=req.user?._id;
     
    if(!userId){
        return res.status(400).json(new ApiError(400,"UserId is required"));
    }

    const status=await Status.findOne({ userId: userId }).populate('userId', 'companyName email ').sort({ createdAt: -1 });


    if (!status) {
        return res.status(404).json(new ApiError(404, "No status found"));
    }

    return res.status(200).json(new ApiResponse(200, "Status fetched successfully", status));
})

const createStatus = asynchandler(async (req, res) => {
    const { userId } = req.user?._id;
    
    if(!userId){
        return res.status(400).json(new ApiError(400,"UserId is required"));
    }
    
    const status=new Status({
        userId,
        credits:int(0),
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear()
    })

    await status.save();
    return res.status(201).json(new ApiResponse(201, "Status created successfully", status));
})

const updateCredits = asynchandler(async (req, res) => {
    const { userId } = req.params;
    const { amount } = req.body;

    if (!userId || !amount) {
        return res.status(400).json(new ApiError(400, "UserId and amount are required"));
    }
    const status = await Status.findOne({ userId: userId });

    if (!status) {
        return res.status(404).json(new ApiError(404, "No status found for this user"));
    }
    status.credits += amount;
    await status.save();
    return res.status(200).json(new ApiResponse(200, "Status updated successfully", status));
})

const changeMonthYear = asynchandler(async (req, res) => {
    const { userId } = req.params;

    if (!userId ) {
        return res.status(400).json(new ApiError(400, "UserId, month and year are required"));
    }

    const status = await Status.findOne({ userId: userId });
    if (!status) {
        return res.status(404).json(new ApiError(404, "No status found for this user"));
    }

    status.month = new Date().getMonth() + 1;
    status.year = new Date().getFullYear();
    status.credits = 0;//TODO :Add some constrain Here

    await status.save();
    return res.status(200).json(new ApiResponse(200, "Month and Year updated successfully", status));
})

export { getStatus, createStatus, updateCredits,changeMonthYear };