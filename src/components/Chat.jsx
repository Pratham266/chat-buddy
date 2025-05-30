import React, { useEffect, useRef, useState } from "react";

import {
  getOrCreateChatId,
  listenToMessages,
  listenToTypingStatus,
  listenToUserStatus,
} from "../services/messageService";
import Logout from "./Logout";
import { formatLastSeen } from "../helper/dateTimeFormater";
import { Icon } from "../IconsMap";
import ChatEditor from "./Editor";
import ChatHeader from "./ChatHeader";
import Messages from "./Messages";

// const widowInnerHeight = window.innerHeight;

const Chat = ({ currentUser, otherUser }) => {
  const [messages, setMessages] = useState([]);
  const [isOtherTyping, setIsOtherTyping] = useState(false);

  const [status, setStatus] = useState({ isOnline: false, lastSeen: null });

  useEffect(() => {
    let unsubscribeMessages = () => {};
    let unsubscribeTyping = () => {};
    let unsubscribeOtherUserStatus = () => {};

    const initChat = async () => {
      const chatId = await getOrCreateChatId(currentUser.code, otherUser.code);

      unsubscribeMessages = listenToMessages(
        chatId,
        currentUser.code,
        (msgs) => {
          setMessages(msgs);
        }
      );

      unsubscribeTyping = listenToTypingStatus(
        chatId,
        otherUser.code,
        (isTyping) => {
          setIsOtherTyping(isTyping);
        }
      );

      unsubscribeOtherUserStatus = listenToUserStatus(
        otherUser.userId,
        setStatus
      );
    };

    if (currentUser && otherUser) {
      initChat();
    }

    return () => {
      unsubscribeMessages();
      unsubscribeTyping();
      unsubscribeOtherUserStatus();
    };
  }, [currentUser, otherUser]);
  console.log({ currentUser, otherUser });
  return (
    <>
      <div
        class="flex flex-col h-screen text-white"
        style={{ maxHeight: "100dvh" }}
      >
        <ChatHeader status={status} otherUser={otherUser} />
        <Messages messages={messages} currentUser={currentUser} />
        <ChatEditor
          currentUser={currentUser}
          otherUser={otherUser}
          isOtherTyping={isOtherTyping}
        />
      </div>
    </>
  );
};

export default Chat;
