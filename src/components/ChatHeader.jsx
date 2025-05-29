import React from "react";
import { formatLastSeen } from "../helper/dateTimeFormater";
import { Icon } from "../IconsMap";
import Logout from "./Logout";

const ChatHeader = ({ status, otherUser }) => {
  return (
    <header className="bg-gray-900 px-4 py-3 flex items-center justify-between border-b border-gray-700">
      <div className="flex items-center space-x-3">
        <img
          className="w-10 h-10 rounded-full"
          src="https://avatar.iran.liara.run/public/61"
          alt="Rounded avatar"
        />
        <div>
          <h2 className="text-white font-semibold text-base">
            {otherUser.username}
          </h2>
          <span className="text-green-500 text-xs">
            {status.isOnline ? "Online" : formatLastSeen(status.lastSeen)}
          </span>
        </div>
      </div>

      <div className="flex items-center space-x-3">
        <button className="p-2 rounded-lg border border-gray-600 hover:bg-gray-800">
          <Icon name={"signal"} size={20} color="red" />
        </button>
        <button className="p-2 rounded-lg border border-gray-600 hover:bg-gray-800">
          <Icon name={"delete"} size={20} />
        </button>
        <Logout />
      </div>
    </header>
  );
};

export default ChatHeader;
