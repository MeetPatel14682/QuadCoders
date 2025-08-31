import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import asynchandler from '../utils/asynchandler.js';
import { History } from '../models/history.models.js';
import mongoose from 'mongoose';


const createHistory = asynchandler(async (req, res) => {
    const { userId, produceCount, amount,company } = req.body;
    console.log("Request body:", userId, produceCount, amount);
    if (!userId || !produceCount || !amount || !company) {
        return res.status(400).json(new ApiError(400, "All fields are required"));
    }
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json(new ApiError(400, "Invalid userId"));
    }

    const newHistory = new History({
        userId,
        company,
        produceCount,
        amount
    });

    await newHistory.save();

    return res.status(201).json(new ApiResponse(201, "History created successfully", newHistory));
})
const getHistory = asynchandler(async (req, res) => {
     
     const history=await History.find().populate('userId', 'company email -_id').sort({ createdAt: -1 });

     if(!history) {
        return  res.status(404).json(new ApiError(404,"No history found"));
     }

     return res.status(200).json(new ApiResponse(200,"History fetched successfully",history));
})

const getHistoryByUserId = asynchandler(async (req, res) => {
     const { userId } = req.params;
     if(!userId || !mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json(new ApiError(400,"Invalid userId"));
     }

     const history=await History.find({ userId: userId }).populate('userId', 'companyName email').sort({ createdAt: -1 });

     if(!history) {
        return res.status(404).json(new ApiError(404,"No history found for this user"));
     }

        return res.status(200).json(new ApiResponse(200,"History fetched successfully",history));
})

export { getHistory , getHistoryByUserId, createHistory };