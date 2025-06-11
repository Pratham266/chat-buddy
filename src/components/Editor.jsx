import React, { useEffect, useRef, useState } from "react";
import EmojiPicker from "emoji-picker-react";
import {
  getOrCreateChatId,
  sendMessage,
  setTypingStatus,
} from "../services/messageService";
import { Icon } from "../IconsMap";
import Modal from "./Modal";
import { Img } from "react-image";
import ImageLoader from "./ImageLoader";

const ChatEditor = ({ currentUser, otherUser, isOtherTyping, chatId }) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const typingTimeout = useRef(null);
  const pickerRef = useRef(null);
  const [inputMessage, setInputMessage] = useState("");
  const [mediaUrl, setMediaUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUploadMendiaError, setIsUploadMendiaError] = useState(false);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "chat_buddy"); // your unsigned preset
    formData.append("folder", "chat_images");

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await res.json();

    if (data?.error) {
      setIsUploadMendiaError(data?.error?.message);
      return;
    }
    return data?.secure_url; // This is the image URL to store in Firestore
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    setIsUploadMendiaError(false);
    if (file) {
      setUploading(true);
      setIsModalOpen(true);
      const imgUrl = await uploadToCloudinary(file);
      setMediaUrl(imgUrl);
      setUploading(false);
    }
  };

  const handleSend = async () => {
    if (inputMessage.trim() === "" && mediaUrl.trim() === "") return;
    // const chatId = await getOrCreateChatId(currentUser.code, otherUser.code);

    await sendMessage(
      chatId,
      currentUser.code,
      otherUser.code,
      inputMessage,
      mediaUrl
    );
    setInputMessage("");
    setIsModalOpen(false);
    setMediaUrl(null);
    setTypingStatus(chatId, currentUser.code, false);
  };

  const handleInputChange = async (e) => {
    const value = e.target.value;
    setInputMessage(value);

    // const chatId = await getOrCreateChatId(currentUser.code, otherUser.code);
    setTypingStatus(chatId, currentUser.code, true);

    clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => {
      setTypingStatus(chatId, currentUser.code, false);
    }, 1000);
  };

  const handleEmojiSelect = (emoji) => {
    setInputMessage((prev) => `${prev}${emoji.emoji}`);
  };

  const handleOpenModal = (val) => {
    setIsModalOpen(val);
  };

  return (
    <>
      {/* <footer className="bg-[#f3ecf9] px-4 py-3 border-t flex items-center space-x-2 chat-editor relative">
        {showEmojiPicker && (
          <div className="absolute bottom-16 z-50">
            <div ref={pickerRef}>
              <EmojiPicker
                onEmojiClick={handleEmojiSelect}
                showPreview={false}
                theme="dark"
              />
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

        <div className="flex item-center justify-center">
          <button
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="cursor-pointer bg-[#9333ea] text-white px-0.5 py-0.5 rounded-full hover:bg-[#7e22ce] mr-2"
          >
            <Icon name="smile" size={20} />
          </button>

          <input
            type="file"
            id="file-upload"
            className="hidden"
            onChange={handleFileChange}
            accept="image/*"
          />

          <label
            htmlFor="file-upload"
            className=" cursor-pointer cursor-pointer bg-[#9333ea] text-white px-0.5 py-0.5 rounded-full hover:bg-[#7e22ce] inline-flex items-center justify-center"
          >
            <Icon name="upload" size={20} />
          </label>
        </div>
        <input
          type="text"
          placeholder="Type your message..."
          className="flex-1 px-4 py-2 bg-white text-[#1f1f1f] border border-gray-300 rounded-full placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-400"
          value={inputMessage}
          onChange={handleInputChange}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />

        <button
          className="cursor-pointer bg-[#9333ea] text-white px-1 py-1  rounded-full hover:bg-[#7e22ce]"
          onClick={handleSend}
        >
          <Icon name="send" size={24} />
        </button>
      </footer> */}
      <footer className="bg-white dark:bg-gray-800 px-4 py-3 border-t border-gray-200 dark:border-gray-700 flex items-center space-x-3 relative shadow-lg">
        {showEmojiPicker && (
          <div className="absolute bottom-full left-4 mb-3 z-50">
            <div ref={pickerRef}>
              <EmojiPicker
                onEmojiClick={handleEmojiSelect}
                showPreview={false}
                theme="dark" // Keep dark theme for the picker, or adjust based on your app's overall theme
              />
            </div>
          </div>
        )}

        {isOtherTyping && (
          <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 px-4 py-2 rounded-full flex items-center space-x-2 shadow-md text-sm animate-fade-in-up">
            <span>Typing...</span>
          </div>
        )}

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="cursor-pointer bg-purple-600 text-white p-2 rounded-full hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-opacity-75 transition-colors duration-200"
            aria-label={
              showEmojiPicker ? "Hide emoji picker" : "Show emoji picker"
            }
          >
            <Icon name="smile" size={20} />
          </button>

          <input
            type="file"
            id="file-upload"
            className="hidden"
            onChange={handleFileChange}
            accept="image/*" // Corrected accept attribute for common image formats
          />

          <label
            htmlFor="file-upload"
            className="cursor-pointer bg-purple-600 text-white p-2 rounded-full hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-opacity-75 inline-flex items-center justify-center transition-colors duration-200"
            aria-label="Upload file"
          >
            <Icon name="upload" size={20} />
          </label>
        </div>

        <input
          type="text"
          placeholder="Type your message..."
          className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-transparent rounded-full placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
          value={inputMessage}
          onChange={handleInputChange}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />

        <button
          className="cursor-pointer bg-purple-600 text-white p-2 rounded-full hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-opacity-75 transition-colors duration-200"
          onClick={handleSend}
          aria-label="Send message"
        >
          <Icon name="send" size={24} />
        </button>
      </footer>
      {isModalOpen && (
        <Modal
          open={isModalOpen}
          handleOpen={handleOpenModal}
          saveText="Done"
          cancleText="Cancle"
          onModalClose={handleOpenModal}
          onModalCalcle={handleOpenModal}
          onSave={handleSend}
          title={"Send Image"}
          bsClass={"top-30"}
        >
          {/* <div className="w-full relative h-auto p-1 border border-gray-200 rounded-md max-w-sm mx-auto flex items-center justify-center bg-[#2d143e]">
            {uploading ? (
              <div className="dotLoader-animation">
                <Icon name="dotloader" size={100} color={"#f7b0fb"} />
              </div>
            ) : (
              <>
                {isUploadMendiaError && (
                  <div className="text-red-900 bg-[#f4ecf9] p-1 rounded max-h-[300px] overflow-y-auto">
                    <p className="font-bold">
                      Sorry We Note Able To Upload An Image
                    </p>
                    <span text="font-bold">Reason: </span>
                    <span className="text-sm italic">
                      {isUploadMendiaError}
                    </span>
                  </div>
                )}
                <Img
                  src={mediaUrl}
                  alt="uploadImage"
                  className="rounded-md max-w-full h-auto"
                  loader={<ImageLoader />}
                />
              </>
            )}
          </div> */}
          <div className="w-full relative h-auto p-2 border-2 border-dashed border-purple-400 dark:border-purple-600 rounded-lg max-w-sm mx-auto flex items-center justify-center bg-purple-50 dark:bg-gray-700 min-h-[150px]">
            {uploading ? (
              <div className="flex flex-col items-center justify-center text-purple-600 dark:text-purple-300">
                {/* Using a pulsing effect for the loader, making it more subtle than 'dotloader' if it's a very active animation */}
                <Icon name="loadingSpinner" size={60} color="currentColor" />{" "}
                {/* Assuming 'loadingSpinner' is a suitable icon */}
                <p className="mt-2 text-sm font-semibold">Uploading...</p>
              </div>
            ) : (
              <>
                {isUploadMendiaError && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-red-100 dark:bg-red-900 bg-opacity-90 dark:bg-opacity-90 p-4 rounded-lg text-center text-red-800 dark:text-red-200">
                    <Icon
                      name="error"
                      size={40}
                      color="text-red-600 dark:text-red-400"
                    />{" "}
                    {/* Assuming 'error' icon */}
                    <p className="font-bold mt-2 text-lg">Upload Failed!</p>
                    <span className="text-sm italic mt-1 max-h-[100px] overflow-y-auto">
                      {isUploadMendiaError}
                    </span>
                    <p className="mt-2 text-xs text-red-700 dark:text-red-300">
                      Please try again.
                    </p>
                  </div>
                )}
                <Img
                  src={mediaUrl}
                  alt="Uploaded media preview"
                  className="rounded-md max-w-full h-auto max-h-[calc(100%-10px)] object-contain" // Added object-contain
                  loader={<ImageLoader />}
                />
              </>
            )}
          </div>
        </Modal>
      )}
    </>
  );
};

export default ChatEditor;
