import { app, server } from "./socket/socket.js";
import express from "express";
import { connectDB } from "./database/connection1.db.js";
import cookieParser from "cookie-parser";
import { errorMiddleware } from "./middlewares/error.middlewares.js";
import userRoute from "./routes/user.route.js";
import messageRoute from "./routes/message.route.js";
import cors from "cors";

connectDB();

app.use(
  cors({
    origin: [process.env.CLIENT_URL],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

const PORT = process.env.PORT || 5000;

// routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/message", messageRoute);

// middlwares
app.use(errorMiddleware);

server.listen(PORT, () => {
  console.log(`your server listening at port ${PORT}`);
});