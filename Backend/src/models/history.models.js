import mongoose from "mongoose";

const HistorySchema = new mongoose.Schema({

    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Backend', required: true },
    produceCount: { type: Number, required: true }, //In Tone
    amount: { type: Number, required: true}
    
},{ timestamps: true});

export const History =mongoose.model('History', HistorySchema);