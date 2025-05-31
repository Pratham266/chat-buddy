import React, { useEffect, useRef, useState } from "react";
import { Picker } from "emoji-mart";
import "emoji-mart/css/emoji-mart.css";
import {
  getOrCreateChatId,
  sendMessage,
  setTypingStatus,
} from "../services/messageService";
import { Icon } from "../IconsMap";

const ChatEditor = ({ currentUser, otherUser, isOtherTyping }) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const typingTimeout = useRef(null);
  const pickerRef = useRef(null);
  const [inputMessage, setInputMessage] = useState("");

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSend = async () => {
    if (inputMessage.trim() === "") return;
    const chatId = await getOrCreateChatId(currentUser.code, otherUser.code);
    setInputMessage("");
    await sendMessage(chatId, currentUser.code, otherUser.code, inputMessage);
    setTypingStatus(chatId, currentUser.code, false);
  };

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

  const handleEmojiSelect = (emoji) => {
    setInputMessage((prev) => `${prev}${emoji.native}`);
  };

  return (
    <>
      <footer className="bg-[#f3ecf9] px-4 py-3 border-t flex items-center space-x-2 chat-editor relative">
        {showEmojiPicker && (
          <div className="absolute bottom-16 z-50">
            <div ref={pickerRef}>
              <Picker onSelect={handleEmojiSelect} showPreview={false} />
            </div>
          </div>
        )}

        {isOtherTyping && (
          <div className="absolute -top-[40px]   left-1/2 transform -translate-x-1/2 bg-gray-100 text-white px-6 py-2 rounded-full flex items-center space-x-2 shadow-md">
            <div className="flex space-x-1">
              <span
                className="w-1.5 h-1.5 bg-black rounded-full animate-bounce"
                style={{ animationDelay: "0s" }}
              ></span>
              <span
                className="w-1.5 h-1.5 bg-black rounded-full animate-bounce"
                style={{ animationDelay: "0.2s" }}
              ></span>
              <span
                className="w-1.5 h-1.5 bg-black rounded-full animate-bounce"
                style={{ animationDelay: "0.4s" }}
              ></span>
            </div>
          </div>
        )}

        <button
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          className="bg-[#9333ea] text-white px-1 py-1 rounded-full hover:bg-[#7e22ce]"
        >
          <Icon name="smile" size={24} />
        </button>

        <input
          type="text"
          placeholder="Type your message..."
          className="flex-1 px-4 py-2 bg-white text-[#1f1f1f] border border-gray-300 rounded-full placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-400"
          value={inputMessage}
          onChange={handleInputChange}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />

        <button
          className="bg-[#9333ea] text-white px-1 py-1  rounded-full hover:bg-[#7e22ce]"
          onClick={handleSend}
        >
          <Icon name="send" size={24} />
        </button>
      </footer>
    </>
  );
};

export default ChatEditor;
