import { useEffect, useState } from "react";
import Login from "./components/Login";

import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./services/firebase";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "./redux/actions/userDetailsActions";
import { decryptData, encryptData } from "./helper/encodeDecode";
import { Icon } from "./IconsMap";
import Chat from "./components/Chat";
import { updateOnlineStatus } from "./services/messageService";
import { logout } from "./redux/reducer/userDetailsReducer";
import { logutUserFromFirbaseAndLocalStorage } from "./components/Logout";

function App() {
  const {
    user,
    chatUser,
    status: userStatus,
  } = useSelector((state) => state.userDetails);
  const [showLoginScreen, setShowLoginScreen] = useState(false);
  const dispatch = useDispatch();
  const logoutUser = () => {
    dispatch(logout()); // this will clear user from the store
  };

  const savedCode = localStorage.getItem("token_code");
  const tokenCode = decryptData(savedCode);

  const userLoggedInOrNot = async (currentUser) => {
    if (currentUser) {
      if (tokenCode) {
        handleLogin(tokenCode);
      }
    } else {
    }
  };

  const handleVisibilityChange = async () => {
    if (document.visibilityState === "hidden") {
      if (user && user.code) updateOnlineStatus(user.userId, false);
      // setShowLoginScreen(true);
      // logoutUser();
      // await logutUserFromFirbaseAndLocalStorage();
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      userLoggedInOrNot(user);
    });
    document.addEventListener("visibilitychange", handleVisibilityChange);
    // Cleanup when component unmounts
    return () => {
      unsubscribe();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  useEffect(() => {
    if (userStatus === "succeeded" && user) {
      const tokenCode = encryptData(user.code);
      localStorage.setItem("token_code", tokenCode);
      setShowLoginScreen(false);
      updateOnlineStatus(user.userId, true);
    }

    const handleBeforeUnload = () => {
      if (user && user.code) updateOnlineStatus(user.userId, false);
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      if (user && user.code) updateOnlineStatus(user.userId, false);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [userStatus, user]);

  const handleLogin = (code) => {
    dispatch(loginUser(code));
  };

  const updateShowTheLoginScreen = (value) => {
    setShowLoginScreen(value);
  };

  if ((!user && !tokenCode) || showLoginScreen) return <Login />;

  if (user)
    return (
      <>
        <Chat
          currentUser={user}
          otherUser={chatUser}
          updateShowTheLoginScreen={updateShowTheLoginScreen}
        />
      </>
    );
  return (
    <div className="dotLoader-animation flex justify-center items-center min-h-screen bg-[#2d143e]">
      <Icon name="screenLoader" size={40} color="white" />
    </div>
  );
}

export default App;
