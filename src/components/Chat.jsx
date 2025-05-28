import React, { useEffect, useRef, useState } from "react";

import {
  getOrCreateChatId,
  listenToMessages,
  listenToTypingStatus,
  listenToUserStatus,
  sendMessage,
  setTypingStatus,
} from "../services/messageService";
import Logout from "./Logout";
import { formatLastSeen } from "../helper/dateTimeFormater";
import { Icon } from "../IconsMap";

// const widowInnerHeight = window.innerHeight;

const Chat = ({ currentUser, otherUser }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isOtherTyping, setIsOtherTyping] = useState(false);
  const typingTimeout = useRef(null);
  const [status, setStatus] = useState({ isOnline: false, lastSeen: null });

  useEffect(() => {
    let unsubscribeMessages = () => {};
    let unsubscribeTyping = () => {};
    let unsubscribeOtherUserStatus = () => {};

    const initChat = async () => {
      const chatId = await getOrCreateChatId(currentUser.code, otherUser.code);

      unsubscribeMessages = listenToMessages(
        chatId,
        currentUser.code,
        (msgs) => {
          setMessages(msgs);
        }
      );

      unsubscribeTyping = listenToTypingStatus(
        chatId,
        otherUser.code,
        (isTyping) => {
          setIsOtherTyping(isTyping);
        }
      );

      unsubscribeOtherUserStatus = listenToUserStatus(
        otherUser.userId,
        setStatus
      );
    };

    if (currentUser && otherUser) {
      initChat();
    }

    return () => {
      unsubscribeMessages();
      unsubscribeTyping();
      unsubscribeOtherUserStatus();
    };
  }, [currentUser, otherUser]);

  const handleInputChange = async (e) => {
    const value = e.target.value;
    setInputMessage(value);

    const chatId = await getOrCreateChatId(currentUser.code, otherUser.code);
    setTypingStatus(chatId, currentUser.code, true);

    clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => {
      setTypingStatus(chatId, currentUser.code, false);
    }, 1000);
  };

  const handleSend = async () => {
    if (inputMessage.trim() === "") return;

    const chatId = await getOrCreateChatId(currentUser.code, otherUser.code);
    await sendMessage(chatId, currentUser.code, otherUser.code, inputMessage);
    setTypingStatus(chatId, currentUser.code, false);
    setInputMessage("");
  };

  return (
    // Header
    <div
      className="bg-gray-100 h-screen flex flex-col max-w-lg mx-auto"
      style={{ maxHeight: "100dvh" }}
    >
      <div className="bg-blue-500 p-4 text-white flex justify-between items-center">
        <button id="login" className="hover:bg-blue-400 rounded-md p-1">
          userProfile
        </button>
        <span>{otherUser.username}</span>
        <div className="text-sm text-gray-500">
          {status.isOnline ? "Online" : formatLastSeen(status.lastSeen)}
        </div>
        <div className="relative inline-block text-left">
          <Logout />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="flex flex-col space-y-2">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${
                msg.senderId === currentUser.code ? "justify-end" : ""
              }`}
            >
              <div
                className={`text-black p-2 rounded-lg max-w-xs  break-all ${
                  msg.senderId === currentUser.code
                    ? "bg-blue-200"
                    : "bg-gray-300"
                }`}
              >
                {msg.text}
              </div>
              {msg.senderId === currentUser.code && (
                <Icon
                  name={`${msg.status === "S" ? "doubleTick" : "singleTick"}`}
                  size={20}
                />
              )}
            </div>
          ))}
          {isOtherTyping && (
            <div className="italic text-sm text-gray-500">
              {otherUser.code} is typing...
            </div>
          )}
        </div>
      </div>

      <div className="bg-white p-4 flex items-center">
        <input
          type="text"
          placeholder="Type your message..."
          className="flex-1 border rounded-full px-4 py-2 focus:outline-none"
          value={inputMessage}
          onChange={handleInputChange}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button
          className="bg-blue-500 text-white rounded-full p-2 ml-2 hover:bg-blue-600 focus:outline-none"
          onClick={handleSend}
        >
          send message
        </button>
      </div>
    </div>
  );
};

export default Chat;
