import mongoose from "mongoose";

const BackendSchema =  new mongoose.Schema({
    company:{type:String,required:true,unique:true},
    email:{type:String,required:true,unique:true},
    address: { type: String, required: true},
    phoneNumber: { type: String, required: true,unique:true},
    pancardId: {type: String, required: true, unique: true},
    owner: { type: String, required: true },
    license:{type:String,required:true,unique:true},
    gstno:{type:String,required:true,unique:true},
    RazorpayId:{type:String,required:true,unique:true},
    RazorpaySecret:{type:String,required:true,unique:true},
    CIN:{type:String, required:true, unique:true},
    taxId:{type:String,required:true,unique:true,length:11},
},{ timestamps: true});



export const Backend = mongoose.model('Backend', BackendSchema);