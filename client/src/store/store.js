import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/user/user.slice";
import socketReducer from "./slices/socket/socket.slice";
import messageReducer from "./slices/message/message.slice";

export const store = configureStore({
  reducer: { userReducer, socketReducer, messageReducer },
  middleware: (getDefaultMiddlware) =>
    getDefaultMiddlware({
      serializableCheck: {
        ignoredPaths: ["socketReducer.socket"],
      },
    }),
});
