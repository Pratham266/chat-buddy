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
      <footer class="bg-gray-900 px-4 py-3 border-t border-gray-700 flex items-center space-x-2 chat-editor">
        {isOtherTyping && (
          <div className="italic text-sm text-gray-500">
            {otherUser.code} is typing...
          </div>
        )}
        {showEmojiPicker && (
          <div className="absolute bottom-16 z-50">
            <div ref={pickerRef}>
              <Picker onSelect={handleEmojiSelect} showPreview={false} />
            </div>
          </div>
        )}
        <button
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          className="ml-2 text-xl"
        >
          <Icon name="smile" size={20} />
        </button>
        <input
          type="text"
          placeholder="Type your message..."
          class="flex-1 px-4 py-2 bg-gray-800 text-white border border-gray-700 rounded-full placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={inputMessage}
          onChange={handleInputChange}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />

        <button
          class="bg-blue-600 text-white px-2 py-2 rounded-full hover:bg-blue-700"
          onClick={handleSend}
        >
          <Icon name="send" size={20} />
        </button>
      </footer>
    </>
  );
};

export default ChatEditor;
