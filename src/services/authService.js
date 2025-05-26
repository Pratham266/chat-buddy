// src/services/authService.js

import { getDocs, query, collection, where } from "firebase/firestore"; // Firestore functions to read documents
import { signInAnonymously } from "firebase/auth"; // Firebase function to sign in without email/password
import { db, auth } from "./firebase"; // Import configured Firestore and Auth instances

// Function to handle login using a unique code (like 'me@123')
export async function loginWithCode(code) {
  try {
    // Create a Firestore query to search for the code in the 'users' collection
    const q = query(collection(db, "users"), where("code", "==", code));

    // Execute the query and get matching documents
    const snapshot = await getDocs(q);

    // If no matching document is found, return failure
    if (snapshot.empty) {
      return { success: false, message: "Invalid code" };
    }

    // Extract the first (and only) matched document's data
    const userData = snapshot.docs[0].data();

    // Sign in the user anonymously using Firebase Auth
    const authResult = await signInAnonymously(auth);

    // Return success with user's UID and the username fetched from Firestore
    return {
      success: true,
      userData: {
        uid: authResult.user.uid, // Firebase-generated user ID
        username: userData.username, // Custom username from Firestore
        code: userData.code, // Code used to login (for reference)
      },
    };
  } catch (error) {
    // Handle any unexpected error (e.g., Firebase/network issues)
    return { success: false, message: "Login failed" };
  }
}
