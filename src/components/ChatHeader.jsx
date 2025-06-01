import React from "react";
import { formatLastSeen } from "../helper/dateTimeFormater";
import { Icon } from "../IconsMap";
import Logout from "./Logout";
import { deleteAllMessages } from "../services/messageService";
import { setDangerFlag } from "../services/privacyService";
import CallComponent from "./CallComponent";

const ChatHeader = ({
  status,
  otherUser,
  updateShowTheLoginScreen,
  handleMessagesState,
  chatId,
  isDanger,
  currentUser,
}) => {
  const deleteMessages = async () => {
    handleMessagesState([]);
    await deleteAllMessages(chatId);
  };

  const handlePrivacyButtonClick = async () => {
    await setDangerFlag(chatId, !isDanger);
  };

  return (
    <header className="bg-[#f3ecf9] px-3 py-1  flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <div className="relative">
          <img
            className="w-10 h-10 rounded-full border border-[#9333ea] object-cover"
            src="Avatar2.png"
            alt="Rounded avatar"
          />
          {status.isOnline && (
            <div className="absolute top-0 -right-1">
              <Icon name="dot" color="green" />
            </div>
          )}
        </div>
        <div>
          <h2 className="text-[#1f1f1f] font-semibold text-base">
            {otherUser.username}
          </h2>
          <span
            className={`${
              status.isOnline ? "text-[#9333ea]" : "text-gray-500"
            } text-xs`}
          >
            {status.isOnline ? "Online" : formatLastSeen(status.lastSeen)}
          </span>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <CallComponent otherUser={otherUser} currentUser={currentUser} />
        <button
          className=" cursor-pointer p-2 rounded-lg border border-[#9333ea] hover:bg-[#e5d8f5]"
          onClick={handlePrivacyButtonClick}
        >
          <Icon name={"signal"} size={15} color={isDanger ? "red" : "green"} />
        </button>
        <button
          className=" cursor-pointer p-2 rounded-lg border border-[#9333ea] hover:bg-[#e5d8f5]"
          onClick={deleteMessages}
        >
          <Icon name={"delete"} size={15} color="#9333ea" />
        </button>
        <Logout updateShowTheLoginScreen={updateShowTheLoginScreen} />
      </div>
    </header>
  );
};

export default ChatHeader;
