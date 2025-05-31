import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  writeBatch,
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

export const sendMessage = async (
  chatId,
  senderId,
  receiverId,
  text = "",
  mediaUrl = ""
) => {
  const messageRef = collection(db, "chats", chatId, "messages");

  await addDoc(messageRef, {
    senderId,
    receiverId,
    text,
    timestamp: serverTimestamp(),
    status: "P",
    mediaUrl,
  });

  // Update parent chat doc with last message
  const chatRef = doc(db, "chats", chatId);
  await updateDoc(chatRef, {
    lastMessage: text,
    lastMedia: mediaUrl,
    lastUpdated: serverTimestamp(),
  });
};

export const listenToMessages = (chatId, currentUserCode, callback) => {
  const q = query(
    collection(db, "chats", chatId, "messages"),
    orderBy("timestamp", "asc")
  );

  return onSnapshot(q, async (snapshot) => {
    const batch = writeBatch(db);
    const messages = snapshot.docs.map((doc) => {
      const data = doc.data();

      // If the message is for current user and is still pending, mark it as seen

      if (data.receiverId === currentUserCode && data.status === "P") {
        const msgRef = doc.ref;
        batch.update(msgRef, { status: "S" });
      }

      return {
        id: doc.id,
        ...data,
      };
    });

    await batch.commit(); // apply status updates
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

export const updateOnlineStatus = async (userId, isOnline) => {
  const userRef = doc(db, "users", userId);
  await updateDoc(userRef, {
    isOnline,
    lastSeen: serverTimestamp(),
  });
};

export const listenToUserStatus = (userId, callback) => {
  const userRef = doc(db, "users", userId);
  return onSnapshot(userRef, (docSnap) => {
    const data = docSnap.data();
    if (data) {
      callback({
        isOnline: data.isOnline,
        lastSeen: data.lastSeen?.toDate(), // Convert Firestore timestamp to JS Date
      });
    }
  });
};

export const deleteAllMessages = async (chatId) => {
  const messagesRef = collection(db, "chats", chatId, "messages");

  const snapshot = await getDocs(messagesRef);

  const deletePromises = snapshot.docs.map((docSnap) =>
    deleteDoc(doc(db, "chats", chatId, "messages", docSnap.id))
  );

  await Promise.all(deletePromises);
  return {
    message: `All messages deleted for chatId: ${chatId}`,
    success: true,
  };
};
