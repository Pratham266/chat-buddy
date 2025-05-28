import React, { useEffect, useRef, useState } from "react";
import { Picker } from "emoji-mart";
import "emoji-mart/css/emoji-mart.css";
import "draft-js/dist/Draft.css";
import {
  getOrCreateChatId,
  sendMessage,
  setTypingStatus,
} from "../services/messageService";

const ChatEditor = ({ currentUser, otherUser }) => {
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
    <div className="bg-white p-4 flex items-center relative chat-editor">
      <input
        type="text"
        placeholder="Type your message..."
        className="flex-1 border rounded-full px-4 py-2 focus:outline-none"
        value={inputMessage}
        onChange={handleInputChange}
        onKeyDown={(e) => e.key === "Enter" && handleSend()}
      />

      <button
        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
        className="ml-2 text-xl"
      >
        😊
      </button>

      {showEmojiPicker && (
        <div className="absolute bottom-16 right-4 z-50">
          <div ref={pickerRef}>
            <Picker onSelect={handleEmojiSelect} showPreview={false} />
          </div>
        </div>
      )}

      <button
        className="bg-blue-500 text-white rounded-full p-2 ml-2 hover:bg-blue-600 focus:outline-none"
        onClick={handleSend}
      >
        send
      </button>
    </div>
  );
};

export default ChatEditor;
