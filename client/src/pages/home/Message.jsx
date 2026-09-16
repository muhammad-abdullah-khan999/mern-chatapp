import React from "react";
import { useEffect } from "react";
import { useRef } from "react";
import { useSelector } from "react-redux";

const Message = ({ messageDetails }) => {
  const messageRef = useRef(null);
  const { userProfile, selectedUser } = useSelector(
    (state) => state.userReducer
  );

  const messageDate = new Date(messageDetails?.updatedAt);
  const formattedDateTime = messageDate.toLocaleString([], {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  useEffect(() => {
    if (messageRef.current) {
      messageRef.current.scrollIntoView({ behavior: "smooth" });
    }
    console.log("messageDetails: ", messageDetails)
  }, [messageDetails]);

  return (
    <div>
      <div
        className={`chat ${
          userProfile?._id !== messageDetails?.senderId || messageDetails?.senderId?._id
            ? "chat-start"
            : "chat-end"
        }`}
      >
        <div className="chat-image avatar">
          <div className="w-10 rounded-full">
            <img
              alt="Tailwind CSS chat bubble component"
              src={
                userProfile?._id === messageDetails?.senderId
                  ? userProfile?.avatar
                  : selectedUser?.avatar
              }
            />
          </div>
        </div>
        <div className="chat-header">
          {userProfile?._id === messageDetails?.senderId
            ? userProfile?.username
            : selectedUser?.username}

          <time className="text-xs opacity-50">
            {formattedDateTime}
          </time>
        </div>
        <div className="chat-bubble">{messageDetails?.message}</div>
      </div>
    </div>
  );
};

export default Message;
