import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "./firebase"; // adjust path if needed

export const setDangerFlag = async (chatId, isDanger) => {
  const chatRef = doc(db, "chats", chatId);
  await updateDoc(chatRef, {
    isDanger,
  });
  return { success: true, isDanger };
};

export const listenToDangerFlag = (chatId, callback) => {
  const chatRef = doc(db, "chats", chatId);

  return onSnapshot(chatRef, (docSnap) => {
    const data = docSnap.data();
    if (data?.isDanger !== undefined) {
      callback(data.isDanger);
    }
  });
};
