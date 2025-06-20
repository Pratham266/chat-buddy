import React, { useEffect } from "react";
import { Icon } from "../IconsMap";
import { Img } from "react-image";
import ImageLoader from "./ImageLoader";

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
        const { text, mediaUrl, senderId, timestamp, status } = msg;
        const downloadUrl =
          mediaUrl &&
          mediaUrl?.url.replace("/upload/", "/upload/fl_attachment/");
        return (
          <React.Fragment key={msg.id}>
            {/* Date Separator */}
            {showDateSeparator && (
              <div className="flex justify-center py-3">
                <span className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs font-medium px-3 py-1 rounded-full shadow-sm">
                  {msgDate}
                </span>
              </div>
            )}

            {/* Message Row */}
            <div
              className={`flex ${
                isOwnerMessage ? "justify-end" : "justify-start"
              } mb-3`}
            >
              {isOwnerMessage ? (
                // Owner's Message (Sent)
                <div className="flex flex-col items-end space-y-1">
                  <div className="relative bg-purple-600 text-white p-4 rounded-xl rounded-br-none text-sm max-w-xs shadow-md">
                    {mediaUrl && (
                      <>
                        <div className="mb-2">
                          <a
                            href={downloadUrl}
                            download
                            target="blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="inline-flex items-center justify-center p-1 rounded-full bg-purple-700 hover:bg-purple-800 transition-colors duration-200"
                            aria-label="Download media"
                          >
                            <Icon
                              name="download"
                              size={18}
                              color="text-white"
                            />
                          </a>
                        </div>
                        {mediaUrl?.type === "image" ? (
                          <Img
                            className="w-60 h-60 rounded-md object-cover"
                            src={mediaUrl.url}
                            loader={<ImageLoader />}
                            alt={`chat-image-${senderId}-${index}`}
                          />
                        ) : mediaUrl?.type === "video" ? (
                          <video
                            className="w-60 h-60 rounded-md object-cover"
                            src={mediaUrl.url}
                            controls
                          >
                            Your browser does not support the video tag.
                          </video>
                        ) : null}
                      </>
                    )}
                    {text && (
                      <div
                        className={`${
                          mediaUrl?.url ? "mt-2" : ""
                        } break-words pr-14 `}
                      >
                        {text}
                      </div>
                    )}

                    <div className="absolute bottom-1 right-2 flex items-center space-x-1 text-[10px] text-gray-200">
                      <span>{formatTime(timestamp)}</span>
                      <Icon
                        name={status === "S" ? "doubleTick" : "singleTick"}
                        size={14}
                        color={
                          status === "S" ? "text-blue-300" : "text-gray-200"
                        } // Blue for delivered/read, gray for sent
                      />
                    </div>
                  </div>
                </div>
              ) : (
                // Other User's Message (Received)
                <div className="flex flex-col items-start space-y-1">
                  {/* You had a commented-out profile icon here. If you want to add avatars for received messages, this is where it would go. */}
                  {/* {showProfileIcon && (
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                A
              </div>
            )} */}
                  <div
                    className={`relative bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 p-3 rounded-xl rounded-tl-none text-sm max-w-xs shadow-md`}
                  >
                    {mediaUrl && (
                      <>
                        <div className="mb-2">
                          <a
                            href={downloadUrl}
                            download
                            target="blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="inline-flex items-center justify-center p-1 rounded-full bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors duration-200"
                            aria-label="Download media"
                          >
                            <Icon
                              name="download"
                              size={18}
                              color="text-gray-700 dark:text-gray-300"
                            />
                          </a>
                        </div>
                        {mediaUrl?.type === "image" ? (
                          <Img
                            className="w-60 h-60 rounded-md object-cover"
                            src={mediaUrl.url}
                            loader={<ImageLoader />}
                            alt={`chat-image-${senderId}-${index}`}
                          />
                        ) : mediaUrl?.type === "video" ? (
                          <video
                            className="w-60 h-60 rounded-md object-cover"
                            src={mediaUrl.url}
                            controls
                          >
                            Your browser does not support the video tag.
                          </video>
                        ) : null}
                      </>
                    )}
                    <div
                      className={`${
                        mediaUrl?.url ? "mt-2" : ""
                      } break-words pr-14`}
                    >
                      {text}
                    </div>
                    <div className="absolute bottom-1 right-2 text-[10px] text-gray-600 dark:text-gray-400">
                      {formatTime(timestamp)}
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
