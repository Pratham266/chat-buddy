// import React from "react";
// import { Icon } from "../IconsMap";

// const Messages = ({ messages, currentUser }) => {
//   console.log({ messages });
//   return (
//     <main className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
//       {messages.map((msg) => {
//         const isOwnerMessage = msg.senderId === currentUser.code;
//         return (
//           <div
//             key={msg.id}
//             className={`flex ${
//               isOwnerMessage ? "justify-end" : "items-start space-x-2"
//             }`}
//           >
//             {isOwnerMessage ? (
//               <div className="flex flex-col items-end space-y-1">
//                 <div className="bg-blue-600 p-3 rounded-lg text-sm max-w-xs text-white">
//                   {msg.text}
//                 </div>
//                 <Icon
//                   name={msg.status === "S" ? "doubleTick" : "singleTick"}
//                   size={20}
//                 />
//               </div>
//             ) : (
//               <>
//                 <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
//                   A
//                 </div>
//                 <div className="bg-gray-800 p-3 rounded-lg text-sm max-w-xs">
//                   {msg.text}
//                 </div>
//               </>
//             )}
//           </div>
//         );
//       })}
//     </main>
//   );
// };

// export default Messages;

import React from "react";
import { Icon } from "../IconsMap";

const Messages = ({ messages, currentUser }) => {
  // Sort messages by timestamp ascending (optional if already sorted)
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
  let lastSender = null;

  return (
    <main className="flex-1 overflow-y-auto px-4 py-3">
      {sortedMessages.map((msg, index) => {
        const isOwnerMessage = msg.senderId === currentUser.code;

        const msgDate = formatDate(msg.timestamp);
        const showDateSeparator = msgDate !== lastDate;
        lastDate = msgDate;

        const senderChanged = lastSender !== msg.senderId;
        lastSender = msg.senderId;

        // spacing between messages based on sender change
        // 8px if sender changed, else 4px
        const marginBottom = senderChanged ? "mb-4" : "mb-2";
        const showProfileIcon =
          index === messages.length - 1 ||
          messages[index + 1].senderId !== msg.senderId;
        return (
          <React.Fragment key={msg.id}>
            {/* Date Separator */}
            {showDateSeparator && (
              <>
                <div className="flex justify-center py-2">
                  <span className="text-gray-400 text-sm font-semibold">
                    <span class="bg-blue-100 text-blue-800 text-xs font-medium inline-flex items-center px-2.5 py-0.5 rounded-sm dark:bg-gray-700 dark:text-blue-400 border border-blue-400">
                      <svg
                        class="w-2.5 h-2.5 me-1.5"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm3.982 13.982a1 1 0 0 1-1.414 0l-3.274-3.274A1.012 1.012 0 0 1 9 10V6a1 1 0 0 1 2 0v3.586l2.982 2.982a1 1 0 0 1 0 1.414Z" />
                      </svg>
                      {msgDate}
                    </span>
                  </span>
                </div>
              </>
            )}

            {/* Message Row */}
            <div
              className={`flex ${
                isOwnerMessage ? "justify-end" : "items-start space-x-2"
              } ${marginBottom}`}
            >
              {isOwnerMessage ? (
                <div className="flex flex-col items-end space-y-1">
                  <div className="relative bg-blue-600 p-3 rounded-lg text-sm max-w-xs text-white">
                    <div className="pr-10">{msg.text}</div>
                    <div className="absolute bottom-0 right-2 text-[10px] text-gray-200">
                      {formatTime(msg.timestamp)}
                    </div>
                    <div className="absolute -bottom-2 -right-2">
                      <Icon
                        name={msg.status === "S" ? "doubleTick" : "singleTick"}
                        size={15}
                        color={msg.status === "S" ? "green" : "red"}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex space-x-2 items-end">
                  {showProfileIcon && (
                    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      A
                    </div>
                  )}
                  <div
                    className={`relative bg-gray-800 p-3 rounded-lg text-sm max-w-xs text-white ${
                      showProfileIcon ? "" : "ml-[40px]"
                    }`}
                  >
                    <div className="pr-10">{msg.text}</div>
                    <div className="absolute bottom-0 right-2 text-[10px] text-gray-400">
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
