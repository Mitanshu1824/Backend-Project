import {asyncHandler} from  "../utils/ayncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import  {User} from "../models/user.model.js"
import { uploadOnCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js"

const generateAccessandRefreshTokens = async(userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()
        return {accessToken , refreshToken}

        user.refreshToken = refreshToken
        await user.save({validateBeforeSave : false})
    } catch (error) {
        throw new ApiError(500 , "Something went wrong while generating tokens")
    }
}


const registerUser = asyncHandler(async (req , res) => {
    // get user detail from frontend
    // validation - not empty
    // check if user already exist
    // check for images or avatar
    // upload avatar them to cloudinary
    // create user object - create entry in db
    // remove password and refresh token filed from response
    // check for user creation
    // return res 

    console.log("FILES:", req.files);   
    console.log("BODY:", req.body);


    const {fullname , email , username , password} = req.body
    // console.log("email:" , email);

   if (
    [fullname, email, username, password].some((field) => 
        field?.trim() === "")
   ) {
    throw new ApiError(400, "All fields are required")
   }

  const existedUser = await User.findOne({
    $or: [{username} , {email}]
   })

   if (existedUser) {
    throw new ApiError(409, "User with this email or username already exists")
   }

   const avatarLocalPath = req.files?.avatar?.[0]?.path;
   const coverImageLocalPath = req.files?.coverImage?.[0]?.path;

   if(!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required")
   }
    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if (!avatar) {
        throw new ApiError(400 , "Avatar file is required")
    }

   const user = await User.create ({
        fullname,
        avatar : avatar.url,
        coverImage : coverImage?.url || " ",
        email,
        password,
        username : username.toLowerCase()
    })

    const createdUser =  await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if(!createdUser) {
        throw new ApiError(500 , "Something went wrong while registering the user")
    }

    return res.status(201).json (
        new ApiResponse(200 , createdUser, "User registered successfully")
    )

})

const loginUser = asyncHandler (async (req ,res) => {
    // req body -> data
    // get username , email id 
    // if usually login then says user login (find the user)
    // password check
    // access and refresh token
    // send cookies
    // respone successfully login
    
    // data taken //
    const {email , username , password} = req.body

    if (!username || !email) {
        throw new ApiError(400 , "without this how you can login username or email? so add it now!")
    }

    const user = await User.findOne({
        $or : [{username} , {email}]
    });

    if(!user) {
        throw new ApiError(404 , "User does not exist")
    }

    const isPasswordValid = await user.isPasswordCorrect(password);

    if(isPasswordValid) {
        throw new ApiError(401 , "Invalid user credentials")
    }

    const {accessToken , refreshToken} = await 
    generateAccessandRefreshTokens(user._id)

   const loggedInUser = await User.findById(user._id).
   select("-password -refreshToken")

   const options = {
    httpOnly : true,
    sercure : true 
   }

   return res.status(200)
   .cookie("accessToken", accessToken , options)
   .cookie("refreshToken" , refreshToken , options)
   .json (
    new ApiResponse (
        200, {
            user : loggedInUser , accessToken, refreshToken
        },
        "User logged in successfully"
    )
   )
})

const logoutUser = asyncHandler(async(req , res) => {
  await  User.findByIdAndUpdate(
        req.user._id , {
            $set : {
                refreshToken : undefined
            }
        } , {
            new : true
        }
    )

    const options = {
    httpOnly : true,
    sercure : true 
   }

   return res
   .status(200)
   .clearCookie
   .cookie("accessToken", options)
   .cookie("refreshToken", options)
   .json(new ApiResponse(200, {}, "User logged out"))
})

export {registerUser , loginUser , logoutUser }