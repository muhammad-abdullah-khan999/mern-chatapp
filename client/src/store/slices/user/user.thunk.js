import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../../components/utils/axiosInstance.js";
import toast from "react-hot-toast";

export const loginUserThunk = createAsyncThunk(
  "user/login",
  async ({ username, password }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/user/login", {
        username,
        password,
      });
      toast.success("Login successfull");
      return response.data;
    } catch (error) {
      console.log("error thunk login user:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
export const registerUserThunk = createAsyncThunk(
  "user/signup",
  async ({ fullname, username, password, gender }, { rejectWithValue }) => {
    try {
      console.log("fullname:", fullname, "username: ", username, "password: ", password, "gender: ",  gender)
      const response = await axiosInstance.post("/user/register", {
        fullname,
        username,
        password,
        gender,
      });
      toast.success("Account created successfully");
      return response.data;
    } catch (error) {
      console.log("error thunk:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
export const logoutUserThunk = createAsyncThunk(
  "user/logout",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/user/logout");
      toast.success("Logut Successfull");
      return response.data;
    } catch (error) {
      console.log("error thunk:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
export const getUserProfileThunk = createAsyncThunk(
  "user/getProfile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/user/get-profile");
      return response.data;
    } catch (error) {
      console.log("error thunk get user profile:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
export const getOtherUsersThunk = createAsyncThunk(
  "user/getOtherUsers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/user/get-other-users");
      return response.data;
    } catch (error) {
      console.error(error);
      const errorOutput = error?.response?.data?.errMessage;
      // toast.error(errorOutput);
      return rejectWithValue(errorOutput);
    }
  }
);