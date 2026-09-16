import { asyncHandler } from "../utils/asyncHandler.utils.js";
import { errorHandler } from "../utils/errorHandler.utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

//Controller to Handle User Registration
export const register = asyncHandler(async (req, res, next) => {
  console.log("register controller runned")
  console.log("req.body: ", req.body)
  const { fullname, username, password, gender } = req.body;
  if (!fullname || !username || !password || !gender) {
    return next(
      new errorHandler(
        "Provide all fields, eg: fullname, username, password, gender",
        400
      )
    );
  }
  const user = await User.findOne({ username });
  if (user) {
    return next(new errorHandler("User already Exists", 400));
  }

  //Hashing Password
  const hashedPassword = await bcrypt.hash(password, 10);

  //Configuring avatar (profile pic) for user
  const avatarType = gender === "male" ? "boy" : "girl";
  const avatar = `https://avatar.iran.liara.run/public/${avatarType}?username=${username}`;

  const newUser = await User.create({
    username,
    fullname,
    password: hashedPassword,
    gender,
    avatar,
  });

  const tokenData = {
    _id: newUser?._id,
  };
  const token = jwt.sign(tokenData, process.env.JWT_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
  });

  res
    .status(200)
    .cookie("token", token, {
      expires: new Date(
        Date.now() +
          Number(process.env.COOKIE_EXPIRY_TIME_IN_DAYS) * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
      secure: !(process.env.NODE_ENV === "production"),
      sameSite: "None",
    })
    .json({
      success: true,
      responseData: {
        newUser,
      },
    });
});

//Controller to Handle User Login
export const login = asyncHandler(async (req, res, next) => {
  console.log("login controller runned")
  const { username, password } = req.body;

  //Display Error if username or password is not provided
  if (!username || !password) {
    return next(
      new errorHandler("Please provide both username or password", 400)
    );
  }

  //Fetch user details from Database (if user exists), otherwise return error
  const user = await User.findOne({ username });
  if (!user) {
    return next(
      new errorHandler("Please enter a valid username or password", 400)
    );
  }

  //Decrypting password
  const isValidPassword = bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    return next(
      new errorHandler("Please enter a valid username or password", 400)
    );
  }

  //Generating JsonWebToken
  const tokenData = {
    _id: user?._id,
  };
  const token = jwt.sign(tokenData, process.env.JWT_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
  });

  res
    .status(200)
    .cookie("token", token, {
      expires: new Date(
        Date.now() +
          Number(process.env.COOKIE_EXPIRY_TIME_IN_DAYS) * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
      secure: !(process.env.NODE_ENV === "production"),
      sameSite: "None",
    })
    .json({
      success: true,
      responseData: {
        user,
        token,
      },
    });
});

//Controller to get Profile
export const getProfile = asyncHandler(async (req, res, next) => {
  console.log("getProfile controller runned")
  const userId = req.user._id;
  console.log("userID: ", userId);

  const profile = await User.findById(userId);

  res.status(200).json({
    success: true,
    responseData: profile,
  });
});

export const logout = asyncHandler(async (req, res, next) => {
  console.log("logout controller runned")
  res
    .status(200)
    .cookie("token", "", {
      expires: new Date(Date.now()),
      httpOnly: true,
    })
    .json({
      success: true,
      message: "Logout Successfull",
    });
});

export const getOtherUsers = asyncHandler(async (req, res, next) => {

  // Fetching all registered users except the user itself
  const otherUsers = await User.find({ _id: { $ne: req.user._id } });

  res.status(200).json({
    success: true,
    responseData: otherUsers,
  })
});
