import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import asynchandler from '../utils/asynchandler.js';
import { Register } from '../models/register.models.js';
import { Backend } from '../models/own_backend.models.js';
import jwt from 'jsonwebtoken';
import { Status } from '../models/status.models.js';
//Genrarate Access Token
const generateAccessTokenAndRefreshToken =async (user) => {
   const user1=await Register.findById(user._id);

   if(!user1) {
    throw new Error("User not found");
   }

   try {
    //Generate Access Token and Refresh Token
    const accessToken = user1.generateAccessToken();
    const refreshToken = user1.generateRefreshToken();

    //Save Refresh Token in DB
    user1.refreshToken = refreshToken;
    await user1.save({validateBeforeSave: false});
    return { accessToken, refreshToken };
   }catch(error) {
    return res.status(400).json(new ApiError(500,"Generating tokens failed: ", error.message));
   }
}

const registerUser = asynchandler(async (req, res) => {
    const { companyName, email, password } = req.body;
    if (!companyName || !email || !password) {
        return res.status(400).json(new ApiError(400, "All fields are required"));
    }

     if (!email.includes('@')) {
        return res.status(400).json(new ApiError(400, "Invalid email format"));
    }
    if (password.length < 6) {
        return res.status(403).json(new ApiError(403, "Password must be at least 6 characters long"));
    }

    //check  authentication
    const entry=await Backend.findOne({company:companyName});
    if(!entry){
        return res.status(404).json(new ApiError(404,"No valid company register"));
    }
    const existingUser = await Register.findOne({
        $or: [
            { email: email },
            { companyName: companyName }
        ]
    });

    if (existingUser) {
        return res.status(409).json(new ApiError(409, "User with this email already exists"));
    }

    const newUser = new Register({
        id:entry._id,
        companyName,
        email,
        password
    });
    await newUser.save();
    
    

    return res.status(201).json(new ApiResponse(201, "User registered successfully", {companyName: newUser.companyName, email: newUser.email }));
});


const loginUser = asynchandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json(new ApiError(400, "Email and password are required"));
    }
    
    const user = await Register.findOne({$or: [{ email: email }, { companyName: email }] });
    if (!user) {
        return res.status(404).json(new ApiError(404, "User not found"));
    }

    const isPasswordValid = await user.isPasswordCorrect(password);
    if (!isPasswordValid) {
        return res.status(401).json(new ApiError(401, "Invalid password"));
    }

    //Generate Access Token and Refresh Token
    const tokens = await generateAccessTokenAndRefreshToken(user);
    if(!tokens) {
        return res.status(500).json(new ApiError(500,"Token generation failed"));
    }

    const loggedInUser = await Register.findById(user._id).select('-password -refreshToken');

    const cookiesOptions = {
        httpOnly: true,
        secure: true, // Set to true in production
        };

        return res
        .cookie('refreshToken', tokens.refreshToken, cookiesOptions)
        .cookie('accessToken', tokens.accessToken, cookiesOptions)
        .status(200).json(new ApiResponse(200, {user: loggedInUser, accessToken: tokens.accessToken,refreshToken:tokens.refreshToken}, "Login successful"));
})

const logoutUser = asynchandler(async (req, res) => {
    const user = await Register.findByIdAndUpdate(req.user._id, {
        $unset: { refreshToken: 1 } // unSet refreshToken
    }, {
        new: true, // Return the updated user document
    })

    const cookieOptions = {
        //httpOnly and secure options use because this change only in production not in development(frontend cannot access the cookie)
        httpOnly: true, // Prevents client-side access to the cookie 
        secure: true, // Use secure cookies in production (HTTPS)
    }
    return res.
        status(200).
        clearCookie("accessToken", cookieOptions). // Clear the access token cookie
        clearCookie("refreshToken", cookieOptions). // Clear the refresh token cookie
        json(new ApiResponse(200, {}, "User logged out successfully"));
});

const updatedUser =  asynchandler(async (req, res) => {
    const {id}=req.user.id;
    const { companyName, email } = req.body;

    if (!companyName || !email) {
        return res.status(400).json(new ApiError(400, "Full name and email are required"));
    }
    const check=await Backend.findOne({id:id});

    if(!check){
        return res.status(404).json(new ApiError(404,"No valid company register"));
    }

    if(companyName && check.company!== companyName){
        return res.status(402).json(new ApiError(402,"New company name doesn't  update in goverment database"))
    }

    if(email && check.findOne({email:email})){
         return res.status(402).json(new ApiError(402,"New company email doesn't  update in goverment database"))
    }
     const entry= await Backend.findOne({company:companyName});
    if(!entry){
        return res.status(404).json(new ApiError(404,"No valid company register"));
    }
    
    const user = await Register.findByIdAndUpdate(req.user?._id, {
        $set: {
            companyName: companyName,
            email: email.toLowerCase(),
        }
    }, {
        new: true, // Return the updated user document
        runValidators: true, // Run validation on the updated fields
    }).select('-password -refreshToken'); // Exclude password and refreshToken from the response

    if (!user) {
        return res.status(404).json(new ApiError(404, "User not found"));
    }

    return res.status(200).json(new ApiResponse(200, user, "User details updated successfully"));
})

const changePassword =  asynchandler(async (req, res) => {
    const { currentPassword, newPassword } = req.body;

    // Validate current password and new password
    if (currentPassword === newPassword) {
        return res.status(400).json(new ApiError(400, "New password cannot be the same as current password"));
    }

    const user = await Register.findById(req.user._id).select('+password'); // Include password field for validation
    const correct = await user.isPasswordCorrect(currentPassword)

    if (!correct) {
        return res.status(401).json(new ApiError(401, "Current password is incorrect"));
    }

    // Update the password
    user.password = newPassword;
    await user.save({ validateBeforeSave: false }) // Save the user document without validation

    // Remove password and refresh token from user object before sending response
    const updatedUser = await Register.findById(user._id).select('-password -refreshToken'); // Exclude password and refreshToken from the response

    return res.status(200).json(new ApiResponse(200, updatedUser, "Password changed successfully"));
})


const refreshTokenHandler = asynchandler(async (req, res) => {
    const refreshToken1 = req.cookies?.refreshToken || req.header("Authorization")?.replace("Bearer ", "") || req.body.refreshToken; // Get refresh token from cookies, Authorization header, or request body

    if (!refreshToken1) {
        return res.status(401).json(new ApiError(401, "Refresh token is required"));
    }
    console.log("Refresh Token received:", refreshToken1); // Log the token for debugging
   try {
        const decoded = jwt.verify(refreshToken1, process.env.REFRESH_TOKEN_SECRET);
        const user = await Register.findById(decoded._id) // Exclude password and refreshToken from the response
        if (!user) {
            return res.status(404).json(new ApiError(404, "User not found"));
        } 
        console.log("User found for refresh token:", user.refreshToken); // Log the user for debugging

        // Check if the refresh token matches the one stored in the user document
        if (user.refreshToken !== refreshToken1) {
            return res.status(403).json(new ApiError(403, "Invalid refresh token or Expired"));
        }

        // Generate new access token and refresh token
        const { accessToken, newRefreshToken } = await generateAccessTokenAndRefreshToken(user._id);

        const cookieOptions = {
            httpOnly: true, // Prevents client-side access to the cookie 
            secure: true, // Use secure cookies in production (HTTPS)
        }
        return res.status(200)
            .cookie("accessToken", accessToken, cookieOptions) // Set the new access token cookie
            .cookie("refreshToken", newRefreshToken, cookieOptions) // Set the new refresh token cookie
            .json(new ApiResponse(200, { user, accessToken, refreshToken: newRefreshToken }, "Access token refreshed successfully"));
    } catch (error) {
        return res.status(401).json(new ApiError(401, "Invalid refresh token"));
    }
}); 



export { registerUser, loginUser, logoutUser, updatedUser, changePassword,refreshTokenHandler };    