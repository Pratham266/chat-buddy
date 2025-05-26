import React from "react";
import { signOut } from "firebase/auth";
import { auth } from "../services/firebase";

const Logout = () => {
  const handleLogout = async () => {
    try {
      await signOut(auth); // this logs the user out from Firebase
      localStorage.removeItem("token_code"); // optional: clean up
      //   setUser(null); // reset your user state
    } catch (error) {
      console.error("Logout error:", error);
    }
  };
  return <button onClick={handleLogout}>Logout</button>;
};

export default Logout;
