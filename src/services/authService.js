// src/services/authService.js

import { getDocs, query, collection, where } from "firebase/firestore"; // Firestore functions to read documents
import { signInAnonymously } from "firebase/auth"; // Firebase function to sign in without email/password
import { db, auth } from "./firebase"; // Import configured Firestore and Auth instances

// Function to handle login using a unique code (like 'me@123')

const getUSerDetailsByCode = async (code) => {
  const q = query(collection(db, "users"), where("code", "==", code));
  const snapshot = await getDocs(q);
  if (snapshot.empty) {
    return { success: false, message: "Invalid code or user note Found" };
  }
  const userData = snapshot.docs[0].data();
  return { success: true, userData };
};

export async function loginWithCode(code) {
  try {
    const { userData } = await getUSerDetailsByCode(code);
    // Sign in the user anonymously using Firebase Auth
    const authResult = await signInAnonymously(auth);
    const { userData: chatUserData } = await getUSerDetailsByCode(
      userData.otherUserCode
    );

    // Return success with user's UID and the username fetched from Firestore
    return {
      success: true,
      userData: {
        uid: authResult.user.uid, // Firebase-generated user ID
        user: userData,
        chatUser: chatUserData,
      },
    };
  } catch (error) {
    // Handle any unexpected error (e.g., Firebase/network issues)
    return { success: false, message: "Login failed" };
  }
}
