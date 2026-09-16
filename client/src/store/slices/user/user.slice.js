import { createSlice } from "@reduxjs/toolkit";
import { getOtherUsersThunk, getUserProfileThunk, loginUserThunk, logoutUserThunk, registerUserThunk } from "./user.thunk";

const initialState = {
  isAuthenticated: false,
  userProfile: null,
  buttonLoading: false,
  screenLoading: true,
};

export const userReducer = createSlice({
  name: "user",
  initialState,
  reducers: {
    setSelectedUser: (state, action) => {
      localStorage.setItem("selectedUser",JSON.stringify(action.payload))
      state.selectedUser = action.payload;
    },
  },
  extraReducers: (builder) => {
    // login user
    builder.addCase(loginUserThunk.pending, (state) => {
      state.buttonLoading = true;
    });
    builder.addCase(loginUserThunk.fulfilled, (state, action) => {
      state.userProfile = action.payload?.responseData?.user; // ✅ simpler
      console.log("state.userProfile: ",state.userProfile)
      state.isAuthenticated = true;
      state.buttonLoading = false;
      state.screenLoading = false; // ✅ stop screen loading
    });
    builder.addCase(loginUserThunk.rejected, (state) => {
      state.buttonLoading = false;
      state.screenLoading = false; // ✅ stop screen loading
    });

    // register user
    builder.addCase(registerUserThunk.pending, (state) => {
      state.buttonLoading = true;
    });
    builder.addCase(registerUserThunk.fulfilled, (state, action) => {
      state.userProfile = action.payload?.responseData?.user; // ✅ simpler
      state.isAuthenticated = true;
      state.buttonLoading = false;
      state.screenLoading = false;
    });
    builder.addCase(registerUserThunk.rejected, (state) => {
      state.buttonLoading = false;
      state.screenLoading = false;
    });

    // logout user
    builder.addCase(logoutUserThunk.pending, (state) => {
      state.buttonLoading = true;
    });
    builder.addCase(logoutUserThunk.fulfilled, (state) => {
      console.log("logoutUserThunk fulfilled")
      state.userProfile = null;
      state.isAuthenticated = false;
      state.buttonLoading = false;
      state.screenLoading = false;
      localStorage.clear();

    });
    builder.addCase(logoutUserThunk.rejected, (state) => {
      state.buttonLoading = false;
      state.screenLoading = false;
    });

    // get-user-profile thunk
    builder.addCase(getUserProfileThunk.pending, (state) => {
      state.screenLoading = true;
    });
    builder.addCase(getUserProfileThunk.fulfilled, (state, action) => {
      state.userProfile = action.payload?.responseData;
      state.isAuthenticated = true;
      state.screenLoading = false;
    });
    builder.addCase(getUserProfileThunk.rejected, (state) => {
      state.screenLoading = false;
    });

    // get other users
    builder.addCase(getOtherUsersThunk.pending, (state, action) => {
      state.screenLoading = true;
    });
    builder.addCase(getOtherUsersThunk.fulfilled, (state, action) => {
      state.screenLoading = false;
      state.otherUsers = action.payload?.responseData;
    });
    builder.addCase(getOtherUsersThunk.rejected, (state, action) => {
      state.screenLoading = false;
    });
  },
});

export const { setSelectedUser } = userReducer.actions;
export default userReducer.reducer;
