import React from "react";
import { signOut } from "firebase/auth";
import { auth } from "../services/firebase";
import { logout } from "../redux/reducer/userDetailsReducer";
import { useDispatch } from "react-redux";

const Logout = () => {
  const dispatch = useDispatch();

  const logoutUser = () => {
    dispatch(logout()); // this will clear user from the store
  };

  const handleLogout = async () => {
    try {
      await signOut(auth); // this logs the user out from Firebase
      localStorage.removeItem("token_code");
      logoutUser();
    } catch (error) {
      // nothing
    }
  };
  return <button onClick={handleLogout}>Logout</button>;
};

export default Logout;
