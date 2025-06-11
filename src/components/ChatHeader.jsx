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
    // <header className="bg-[#f3ecf9] px-3 py-1  flex items-center justify-between">
    //   <div className="flex items-center space-x-2">
    //     <div className="relative">
    //       <img
    //         className="w-10 h-10 rounded-full border border-[#9333ea] object-cover"
    //         src="Avatar2.png"
    //         alt="Rounded avatar"
    //       />
    //       {status.isOnline && (
    //         <div className="absolute top-0 -right-1">
    //           <Icon name="dot" color="green" />
    //         </div>
    //       )}
    //     </div>
    //     <div>
    //       <h2 className="text-[#1f1f1f] font-semibold text-base">
    //         {otherUser.username}
    //       </h2>
    //       <span
    //         className={`${
    //           status.isOnline ? "text-[#9333ea]" : "text-gray-500"
    //         } text-xs`}
    //       >
    //         {status.isOnline ? "Online" : formatLastSeen(status.lastSeen)}
    //       </span>
    //     </div>
    //   </div>

    //   <div className="flex items-center space-x-2">
    //     <CallComponent otherUser={otherUser} currentUser={currentUser} />
    //     <button
    //       className=" cursor-pointer p-2 rounded-lg border border-[#9333ea] hover:bg-[#e5d8f5]"
    //       onClick={handlePrivacyButtonClick}
    //     >
    //       <Icon name={"signal"} size={15} color={isDanger ? "red" : "green"} />
    //     </button>
    //     <button
    //       className=" cursor-pointer p-2 rounded-lg border border-[#9333ea] hover:bg-[#e5d8f5]"
    //       onClick={deleteMessages}
    //     >
    //       <Icon name={"delete"} size={15} color="#9333ea" />
    //     </button>
    //     <Logout updateShowTheLoginScreen={updateShowTheLoginScreen} />
    //   </div>
    // </header>
    <header className="bg-gradient-to-r from-purple-700 to-indigo-700 px-4 py-2 flex items-center justify-between shadow-md">
      <div className="flex items-center space-x-3">
        <div className="relative">
          <img
            className="w-12 h-12 rounded-full border-2 border-purple-300 object-cover"
            src="Avatar2.png" // Consider dynamic path if avatars change
            alt={`${otherUser.username}'s avatar`}
          />
          {status.isOnline && (
            <div className="absolute bottom-0 right-0">
              {/* Using a rounded online indicator instead of a simple dot for better visibility */}
              <span className="block w-3 h-3 bg-green-500 rounded-full ring-2 ring-white"></span>
            </div>
          )}
        </div>
        <div>
          <h2 className="text-white font-semibold text-lg">
            {otherUser.username}
          </h2>
          <span
            className={`${
              status.isOnline ? "text-green-300" : "text-gray-300"
            } text-sm`}
          >
            {status.isOnline ? "Online" : formatLastSeen(status.lastSeen)}
          </span>
        </div>
      </div>

      <div className="flex items-center space-x-3">
        <CallComponent otherUser={otherUser} currentUser={currentUser} />
        <button
          className={`p-2 rounded-full bg-purple-600 ${
            isDanger ? "text-red-400" : "text-green-400"
          } hover:bg-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-opacity-75 transition-all duration-200 cursor-pointer`}
          onClick={handlePrivacyButtonClick}
          aria-label="Toggle privacy status"
        >
          <Icon name={"signal"} size={16} />
        </button>
        <button
          className="p-2 rounded-full bg-purple-600 text-white hover:bg-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-opacity-75 transition-all duration-200 cursor-pointer"
          onClick={deleteMessages}
          aria-label="Delete messages"
        >
          <Icon name={"delete"} size={16} color="text-white" />
        </button>
        <Logout updateShowTheLoginScreen={updateShowTheLoginScreen} />
      </div>
    </header>
  );
};

export default ChatHeader;
