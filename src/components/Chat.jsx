import React, { useEffect, useRef, useState } from "react";

import {
  getOrCreateChatId,
  listenToMessages,
  listenToTypingStatus,
  listenToUserStatus,
} from "../services/messageService";
import ChatEditor from "./Editor";
import ChatHeader from "./ChatHeader";
import Messages from "./Messages";
import { listenToDangerFlag } from "../services/privacyService";

// const widowInnerHeight = window.innerHeight;

const Chat = ({ currentUser, otherUser, updateShowTheLoginScreen }) => {
  const [messages, setMessages] = useState([]);
  const [isOtherTyping, setIsOtherTyping] = useState(false);
  const [chatId, setChatId] = useState(null);
  const [status, setStatus] = useState({ isOnline: false, lastSeen: null });
  const [isDanger, setIsDanger] = useState(false);

  useEffect(() => {
    let unsubscribeMessages = () => {};
    let unsubscribeTyping = () => {};
    let unsubscribeOtherUserStatus = () => {};
    let unSubscribePrivacyButton = () => {};

    const initChat = async () => {
      const userChatId = await getOrCreateChatId(
        currentUser.code,
        otherUser.code
      );
      setChatId(userChatId);
      unsubscribeMessages = listenToMessages(
        userChatId,
        currentUser.code,
        (msgs) => {
          setMessages(msgs);
        }
      );

      unsubscribeTyping = listenToTypingStatus(
        userChatId,
        otherUser.code,
        (isTyping) => {
          setIsOtherTyping(isTyping);
        }
      );

      unsubscribeOtherUserStatus = listenToUserStatus(
        otherUser.userId,
        setStatus
      );

      unSubscribePrivacyButton = listenToDangerFlag(userChatId, setIsDanger);
    };

    if (currentUser && otherUser) {
      initChat();
    }

    return () => {
      unsubscribeMessages();
      unsubscribeTyping();
      unsubscribeOtherUserStatus();
      unSubscribePrivacyButton();
    };
  }, [currentUser, otherUser]);

  const handleMessagesState = (messages) => {
    setMessages(messages);
  };

  return (
    <>
      <div
        className="flex flex-col h-screen text-white bg-[#2d143e]"
        style={{ maxHeight: "100dvh" }}
      >
        <ChatHeader
          status={status}
          otherUser={otherUser}
          updateShowTheLoginScreen={updateShowTheLoginScreen}
          handleMessagesState={handleMessagesState}
          chatId={chatId}
          isDanger={isDanger}
        />
        <Messages messages={messages} currentUser={currentUser} />
        <ChatEditor
          currentUser={currentUser}
          otherUser={otherUser}
          isOtherTyping={isOtherTyping}
          chatId={chatId}
        />
      </div>
    </>
  );
};

export default Chat;
