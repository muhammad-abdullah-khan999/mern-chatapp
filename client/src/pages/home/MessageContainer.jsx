import React, { useEffect, useRef } from "react";
import User from "./User";
import Message from "./Message";
import { MdSend } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { getMessageThunk, sendMessageThunk } from "../../store/slices/message/message.thunk";

const MessageContainer = () => {
  const dispatch = useDispatch();
  const { selectedUser } = useSelector((state) => state.userReducer);
  const { messages } = useSelector((state) => state.messageReducer);
  const textareaRef = useRef(null);

  useEffect(() => {
    if (selectedUser?._id) {
      dispatch(getMessageThunk({ recieverId: selectedUser?._id }));
    }
  }, [selectedUser]);

  const handleInput = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // stop new line
      handleSend(); // send message
    }
  };

  const handleSend = () => {
    if (textareaRef.current) {
      const message = textareaRef.current.value.trim();
      if (message.length > 0) {
        dispatch(
          sendMessageThunk({
            recieverId: selectedUser?._id,
            message,
          })
        ); // <-- Replace with your send logic
        textareaRef.current.value = "";
        textareaRef.current.style.height = "auto"; // reset height
      }
    }
  };

  return (
    <>
      {!selectedUser ? (
        <div className="w-full flex items-center justify-center flex-col gap-1 bg-gray-800">
          <h1 className="text-3xl font-bold">Welcome to GUP SHUP</h1>
          <p className="text-xl">Please select a person to continue your chat!!</p>
          </div>
      ) : (
    <div className="max-h-screen w-full flex flex-col bg-gray-900">
      {/* User Header */}
      <div className="shrink-0 border-b border-gray-700 bg-gray-900 p-3">
        <User userDetails={selectedUser} bgColor="bg-gray-900" />
      </div>

      {/* Messages Section */}
      <div className="flex-1 p-4 h-full overflow-y-auto bg-gray-800 space-y-3 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent ">
        {messages?.map((messageDetails) => {
          return (
            <Message
              key={messageDetails?._id}
              messageDetails={messageDetails}
            />
          );
        })}
      </div>

      {/* Input Section */}
      <div className="shrink-0 m-5 border-2 border-primary rounded-3xl px-3 py-2 flex items-start shadow-lg">
        <textarea
          ref={textareaRef}
          placeholder="Type a message..."
          className="px-3 py-2 w-full rounded-2xl bg-transparent outline-none focus:outline-none border-none resize-none overflow-y-auto text-lg placeholder-gray-400 hover:bg-gray-800"
          rows={1}
          style={{ maxHeight: "150px" }}
          onInput={handleInput}
          onKeyDown={handleKeyDown}
        />
        <button
          onClick={handleSend}
          className="btn btn-primary rounded-xl ml-3 flex items-center gap-2 px-4 py-2 shadow-md hover:scale-105 transition-transform"
        >
          <MdSend size={18} />
          <span className="hidden sm:inline">Send</span>
        </button>
      </div>
    </div>
      )}
    </>
  );
};

export default MessageContainer;
