import React, { useEffect, useRef, useState } from "react";

import {
  getOrCreateChatId,
  listenToMessages,
  listenToTypingStatus,
  sendMessage,
  setTypingStatus,
} from "../services/messageService";

// const Chat = ({ currentUser, otherUser }) => {
//   const [messages, setMessages] = useState([]);
//   const [inputMessage, setInputMessage] = useState("");

//   useEffect(() => {
//     const loadMessages = async () => {
//       const chatId = await getOrCreateChatId(currentUser.code, otherUser.code);

//       const unsubscribe = listenToMessages(chatId, (msgs) => {
//         setMessages(msgs);
//       });

//       return () => unsubscribe();
//     };

//     if (currentUser && otherUser) {
//       loadMessages();
//     }
//   }, [currentUser, otherUser]);

//   const handleSend = async () => {
//     if (inputMessage.trim() === "") return;

//     const chatId = await getOrCreateChatId(currentUser.code, otherUser.code);
//     await sendMessage(chatId, currentUser.code, otherUser.code, inputMessage);
//     setInputMessage("");
//   };

//   return (
//     <div className="flex flex-col h-screen max-w-md mx-auto p-4 bg-gray-100 rounded shadow">
//       <div className="flex-1 overflow-y-auto space-y-2 mb-4">
//         {messages.map((msg) => (
//           <div
//             key={msg.id}
//             className={`p-2 rounded max-w-[70%] ${
//               msg.senderId === currentUser.code
//                 ? "bg-blue-500 text-white self-end ml-auto"
//                 : "bg-white text-black"
//             }`}
//           >
//             {msg.text}
//           </div>
//         ))}
//       </div>

//       <div className="flex items-center space-x-2">
//         <input
//           type="text"
//           className="flex-1 px-4 py-2 border rounded"
//           placeholder="Type a message..."
//           value={inputMessage}
//           onChange={(e) => setInputMessage(e.target.value)}
//           onKeyDown={(e) => e.key === "Enter" && handleSend()}
//         />
//         <button
//           onClick={handleSend}
//           className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
//         >
//           Send
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Chat;

const Chat = ({ currentUser, otherUser }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isOtherTyping, setIsOtherTyping] = useState(false);
  const typingTimeout = useRef(null);

  useEffect(() => {
    const initChat = async () => {
      const chatId = await getOrCreateChatId(currentUser.code, otherUser.code);

      const unsubscribeMessages = listenToMessages(chatId, (msgs) => {
        setMessages(msgs);
      });

      const unsubscribeTyping = listenToTypingStatus(
        chatId,
        otherUser.code,
        (isTyping) => {
          setIsOtherTyping(isTyping);
        }
      );

      return () => {
        unsubscribeMessages();
        unsubscribeTyping();
      };
    };

    if (currentUser && otherUser) {
      initChat();
    }
  }, [currentUser, otherUser]);

  const handleInputChange = async (e) => {
    const value = e.target.value;
    setInputMessage(value);

    const chatId = await getOrCreateChatId(currentUser.code, otherUser.code);
    setTypingStatus(chatId, currentUser.code, true);

    clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => {
      setTypingStatus(chatId, currentUser.code, false);
    }, 1000);
  };

  const handleSend = async () => {
    if (inputMessage.trim() === "") return;

    const chatId = await getOrCreateChatId(currentUser.code, otherUser.code);
    await sendMessage(chatId, currentUser.code, otherUser.code, inputMessage);
    setTypingStatus(chatId, currentUser.code, false);
    setInputMessage("");
  };

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto p-4 bg-gray-100 rounded shadow">
      <div className="flex-1 overflow-y-auto space-y-2 mb-2">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`p-2 rounded max-w-[70%] ${
              msg.senderId === currentUser.code
                ? "bg-blue-500 text-white ml-auto"
                : "bg-white text-black"
            }`}
          >
            {msg.text}
          </div>
        ))}
        {isOtherTyping && (
          <div className="italic text-sm text-gray-500">
            {otherUser.code} is typing...
          </div>
        )}
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="text"
          className="flex-1 px-4 py-2 border rounded"
          placeholder="Type a message..."
          value={inputMessage}
          onChange={handleInputChange}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button
          onClick={handleSend}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
