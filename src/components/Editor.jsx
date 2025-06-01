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
      <footer className="bg-[#f3ecf9] px-4 py-3 border-t flex items-center space-x-2 chat-editor relative">
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
          <div className="w-full relative h-auto p-1 border border-gray-200 rounded-md max-w-sm mx-auto flex items-center justify-center bg-[#2d143e]">
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
          </div>
        </Modal>
      )}
    </>
  );
};

export default ChatEditor;
