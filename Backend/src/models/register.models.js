import mongoose from "mongoose";
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";

const registerSchema = new mongoose.Schema({
    id:{type: mongoose.Schema.Types.ObjectId, ref: 'Backend',required:true},
    companyName: { type: String, required: true , unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    refreshToken:{type:String},
});
registerSchema.virtual("information", {
  ref: "Information",        // Model to populate
  localField: "_id",         // Field in Register
  foreignField: "company",   // Field in Information that references Register
  justOne: true              // Return single document
});

//Password hashing before saving the user
registerSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
         this.password = await bcrypt.hash(this.password, 10);
    }
    next();

});

//Method to compare password
registerSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
}

//Method to generate JWT token

//Generate Access Token
registerSchema.methods.generateAccessToken = function () {
    return jwt.sign({ 
        _id: this._id,
        companyName: this.companyName,
        email: this.email
     }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    });
}

//Generate Refresh Token
registerSchema.methods.generateRefreshToken = function () {
    return jwt.sign({
        _id: this._id,
    }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: process.env.REFRESH_TOKEN_EXPIRY 
    });
}

export const Register = mongoose.model('Register', registerSchema);

