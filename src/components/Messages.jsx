import React, { useEffect } from "react";
import { Icon } from "../IconsMap";

const Messages = ({ messages, currentUser }) => {
  // Sort messages by timestamp ascending (optional if already sorted)

  useEffect(() => {
    const container = document.getElementById("message-scroll-container");
    if (container) {
      container.scrollTo({
        top: container.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages && messages.length]);

  const sortedMessages = messages;

  // Helper functions
  const formatDate = (timestamp) => {
    const date = new Date(timestamp?.seconds * 1000);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return date
        .toLocaleDateString("en-US", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
        .toUpperCase();
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp?.seconds * 1000);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  let lastDate = null;
  // let lastSender = null;

  return (
    <main
      className="flex-1 overflow-y-auto px-4 py-3 "
      id="message-scroll-container"
    >
      {sortedMessages.map((msg, index) => {
        const isOwnerMessage = msg.senderId === currentUser.code;

        const msgDate = formatDate(msg.timestamp);
        const showDateSeparator = msgDate !== lastDate;
        lastDate = msgDate;

        const showProfileIcon =
          index === messages.length - 1 ||
          messages[index + 1].senderId !== msg.senderId;
        return (
          <React.Fragment key={msg.id}>
            {/* Date Separator */}
            {showDateSeparator && (
              <>
                <div className="flex justify-center py-2">
                  <span class="bg-gray-200 text-gray-700 text-xs font-medium inline-flex items-center px-2.5 py-0.5 rounded-sm ">
                    {msgDate}
                  </span>
                </div>
              </>
            )}

            {/* Message Row */}
            <div
              className={`flex ${
                isOwnerMessage ? "justify-end" : "items-start space-x-2"
              } ${"mb-2"}`}
            >
              {isOwnerMessage ? (
                <div className="flex flex-col items-end space-y-1">
                  <div className="relative bg-[#dfc3ff] p-3 rounded-xl rounded-br-none text-sm max-w-xs text-[#1f1f1f]">
                    <div className="pr-10">{msg.text}</div>
                    <div className="absolute bottom-0 right-1 flex items-center space-x-1 text-[8px] text-gray-800">
                      <span>{formatTime(msg.timestamp)}</span>
                      <Icon
                        name={msg.status === "S" ? "doubleTick" : "singleTick"}
                        size={15}
                        color={"b20ffd"}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex space-x-2 items-end">
                  {/* {showProfileIcon && (
                    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      A
                    </div>
                  )} */}
                  <div
                    className={`relative bg-[#f7b0fb] p-3 rounded-xl rounded-tl-none text-sm max-w-xs text-[#1f1f1f] `}
                  >
                    <div className="pr-10">{msg.text}</div>
                    <div className="absolute bottom-0 right-2 text-[8px] text-gray-800">
                      {formatTime(msg.timestamp)}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </React.Fragment>
        );
      })}
    </main>
  );
};

export default Messages;
