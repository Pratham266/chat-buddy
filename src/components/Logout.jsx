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
      logoutUser();
      await logutUserFromFirbaseAndLocalStorage();
      updateShowTheLoginScreen(true);
    } catch (error) {
      // nothing
    }
  };

  return (
    <button
      className="p-2 rounded-full bg-purple-600 text-white hover:bg-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-opacity-75 transition-all duration-200 cursor-pointer"
      onClick={handleLogout}
    >
      <Icon name={"logout"} size={15} color="text-white" />
    </button>
  );
};

export default Logout;
