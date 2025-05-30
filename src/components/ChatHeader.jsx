import React from "react";
import { formatLastSeen } from "../helper/dateTimeFormater";
import { Icon } from "../IconsMap";
import Logout from "./Logout";

const ChatHeader = ({ status, otherUser }) => {
  return (
    <header className="bg-[#f3ecf9] px-3 py-1  flex items-center justify-between rounded-4xl">
      <div className="flex items-center space-x-2">
        <img
          className="w-10 h-10 rounded-full"
          src="https://avatar.iran.liara.run/public/61"
          alt="Rounded avatar"
        />
        <div>
          <h2 className="text-[#1f1f1f] font-semibold text-base">
            {otherUser.username}
          </h2>
          <span className="text-gray-500 text-xs">
            {status.isOnline ? "Online" : formatLastSeen(status.lastSeen)}
          </span>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <button className="p-2 rounded-lg border border-gray-300 hover:bg-[#e5d8f5]">
          <Icon name={"signal"} size={15} color="red" />
        </button>
        <button className="p-2 rounded-lg border border-gray-300 hover:bg-[#e5d8f5]">
          <Icon name={"delete"} size={15} color="#9333ea" />
        </button>
        <Logout />
      </div>
    </header>
  );
};

export default ChatHeader;
