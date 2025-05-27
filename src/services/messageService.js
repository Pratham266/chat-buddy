import {
  addDoc,
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "./firebase";

export const getOrCreateChatId = async (user1, user2) => {
  const sortedIds = [user1, user2].sort();
  const chatId = `${sortedIds[0]}_${sortedIds[1]}`;

  const chatRef = doc(db, "chats", chatId);
  const chatSnap = await getDoc(chatRef);

  if (!chatSnap.exists()) {
    await setDoc(chatRef, {
      users: sortedIds,
      lastMessage: "",
      lastUpdated: new Date(),
    });
  }

  return chatId;
};

export const sendMessage = async (chatId, senderId, receiverId, text) => {
  const messageRef = collection(db, "chats", chatId, "messages");

  await addDoc(messageRef, {
    senderId,
    receiverId,
    text,
    timestamp: serverTimestamp(),
  });

  // Update parent chat doc with last message
  const chatRef = doc(db, "chats", chatId);
  await updateDoc(chatRef, {
    lastMessage: text,
    lastUpdated: serverTimestamp(),
  });
};

export const listenToMessages = (chatId, callback) => {
  const q = query(
    collection(db, "chats", chatId, "messages"),
    orderBy("timestamp", "asc")
  );

  return onSnapshot(q, (snapshot) => {
    const messages = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    callback(messages);
  });
};

export const setTypingStatus = async (chatId, userCode, isTyping) => {
  const typingDocRef = doc(db, "chats", chatId);
  await setDoc(
    typingDocRef,
    {
      typing: {
        [userCode]: isTyping,
      },
    },
    { merge: true }
  );
};

export const listenToTypingStatus = (chatId, userCode, callback) => {
  const typingDocRef = doc(db, "chats", chatId);
  return onSnapshot(typingDocRef, (docSnap) => {
    const data = docSnap.data();
    const isTyping = data?.typing?.[userCode] || false;
    callback(isTyping);
  });
};
