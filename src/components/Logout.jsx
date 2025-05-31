import React from "react";
import { signOut } from "firebase/auth";
import { auth } from "../services/firebase";
import { logout } from "../redux/reducer/userDetailsReducer";
import { useDispatch } from "react-redux";
import { Icon } from "../IconsMap";

export const logutUserFromFirbaseAndLocalStorage = async () => {
  try {
    await signOut(auth);
    localStorage.removeItem("token_code");
  } catch (error) {
    // nothing
  }
};

const Logout = ({ updateShowTheLoginScreen }) => {
  const dispatch = useDispatch();
  const logoutUser = () => {
    dispatch(logout()); // this will clear user from the store
  };

  const handleLogout = async () => {
    try {
      updateShowTheLoginScreen(true);
      logoutUser();
      await logutUserFromFirbaseAndLocalStorage();
    } catch (error) {
      // nothing
    }
  };

  return (
    <button
      className="p-2 rounded-lg border border-gray-300 hover:bg-[#e5d8f5]"
      onClick={handleLogout}
    >
      <Icon name={"logout"} size={15} color="#9333ea" />
    </button>
  );
};

export default Logout;
