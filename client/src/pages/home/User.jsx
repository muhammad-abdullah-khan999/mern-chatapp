import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedUser } from "../../store/slices/user/user.slice";

const User = ({ userDetails, bgColor }) => {
  const dispatch = useDispatch();

  const { selectedUser } = useSelector((state) => state.userReducer);
  const { onlineUsers } = useSelector((state) => state.socketReducer);
  const isUserOnline = onlineUsers?.includes(userDetails?._id);

  const handleUserClick = () => {
    dispatch(setSelectedUser(userDetails));
  };

  return (
    <>
      <div
        onClick={handleUserClick}
        className={`hover:bg-gray-800 hover: cursor-pointer ${
        userDetails?._id === selectedUser?._id && bgColor}`}
      >
        <div className="pt-2 flex gap-3 items-center">
          <div className={`avatar avatar-${isUserOnline && "online"}`}>
            <div className="w-14 rounded-full ml-3">
              <img src={userDetails?.avatar} />
            </div>
          </div>
          <div className="w-full">
            <h1>{isUserOnline}</h1>
            <h1 className="text-lg text-gray-200 font-bold">{userDetails?.fullname}</h1>
            <p className="text-xs text-gray-350">{userDetails?.username}</p>
          </div>
        </div>
        <div className="w-full h-[1px] bg-primary mt-2"></div>
      </div>
    </>
  );
};

export default User;
