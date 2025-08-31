import mongoose from "mongoose";

const  statusSchema = new mongoose.Schema({

    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Backend', required: true },
    credits:{ type: Number, required: true },
    month: { type: String, required: true },
    year: { type: String, required: true }
},{ timestamps: true});

export const Status = mongoose.model('Status', statusSchema);