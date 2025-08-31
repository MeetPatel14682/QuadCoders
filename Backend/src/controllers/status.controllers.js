import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import asynchandler from '../utils/asynchandler.js';
import { Status } from '../models/status.models.js';
import { Backend } from '../models/own_backend.models.js';
import { Register } from '../models/register.models.js';
import { Information } from '../models/information.models.js';
const getStatus = asynchandler(async (req, res) => {
   
     const status = await Status.find()
  .populate('userId', 'company email _id')
  .lean(); // Convert all docs to plain objects immediately

for (let i = 0; i < status.length; i++) {
  const aggregation = await Register.findOne({ companyName: status[i].userId.company }).select('_id');
  if (aggregation) {
    const aggregation2 = await Information.findOne({ company: aggregation._id }).select('RazorpayId RazorpaySecret -_id');
    if (aggregation2) {
      status[i].RazorpayId = aggregation2.RazorpayId;
      status[i].RazorpaySecret = aggregation2.RazorpaySecret;
    }
  }
}

return res.status(200).json(new ApiResponse(200, "Status fetched successfully", status));

});


const createStatus = asynchandler(async (req, res) => {
    const { userId } = req.user?._id;

    if (!userId) {
        return res.status(400).json(new ApiError(400, "UserId is required"));
    }

    const status = new Status({
        userId,
        credits: int(0),
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear()
    })

    await status.save();
    return res.status(201).json(new ApiResponse(201, "Status created successfully", status));
})

const updateCredits = asynchandler(async (req, res) => {
    const { company } = req.body;
    const { amount } = req.body;

    const search = await Backend.findOne({ company: company }).select('_id');

    if (!search) {
        return res.status(404).json(new ApiError(404, "No valid company found"));
    }
    if (!amount) {
        return res.status(400).json(new ApiError(400, "UserId and amount are required"));
    }
    const status = await Status.findOne({ userId: search._id });

    if (!status) {
        return res.status(404).json(new ApiError(404, "No status found for this user"));
    }
    status.credits += parseInt(amount)
    await status.save();
    return res.status(200).json(new ApiResponse(200, "Status updated successfully", status));
})

const changeMonthYear = asynchandler(async (req, res) => {
    const { userId } = req.params;

    if (!userId) {
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

export { getStatus, createStatus, updateCredits, changeMonthYear };