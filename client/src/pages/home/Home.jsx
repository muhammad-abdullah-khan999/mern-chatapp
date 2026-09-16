import UserSidebar from "./UserSidebar";
import MessageContainer from "./MessageContainer";
import {
  disconnectSocket,
  initializeSocket,
  setOnlineUsers,
} from "../../store/slices/socket/socket.slice";
import { useDispatch, useSelector } from "react-redux";
import { setNewMessage } from "../../store/slices/message/message.slice";
import { useEffect } from "react";

const Home = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, userProfile } = useSelector(
    (state) => state.userReducer
  );
  const { socket, onlineUsers } = useSelector((state) => state.socketReducer);

  useEffect(() => {
    if (!isAuthenticated) return;
    dispatch(initializeSocket(userProfile?._id));
  }, [isAuthenticated]);

  useEffect(() => {
    if (!socket) return;
    socket.on("onlineUsers", (onlineUsers) => {
      dispatch(setOnlineUsers(onlineUsers));
    });
    socket.on("newMessage", (newMessage) => {
      dispatch(setNewMessage(newMessage));
    });
    return () => {
      socket.off("onlineUsers");
      socket.off("newMessage");
      dispatch(disconnectSocket()); // ✅ This disconnects properly
    };
  }, [socket]);

  return (
    <div className='flex data-theme="dark'>
      <UserSidebar />
      <MessageContainer />
    </div>
  );
};

export default Home;
