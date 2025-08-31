import mongoose from "mongoose";

const InformationSchema = new mongoose.Schema({
    company:{type:mongoose.Schema.Types.ObjectId,ref:'Register',required:true},
    CIN:{type:String, required:true, unique:true},
    address: { type: String, required: true },
    pancardId: { type: String , required: true, unique: true},
    phoneNumber: { type: String, required: true },
    owner: { type: String, required: true },
    license:{type:String,required:true,unique:true},
    gstno:{type:String,required:true,unique:true},
    RazorpayId:{type:String,required:true,unique:true},
    RazorpaySecret:{type:String,required:true,unique:true},
    taxId:{type:String,required:true,unique:true,length:11},
},{ timestamps: true});



export const Information = mongoose.model('Information', InformationSchema);