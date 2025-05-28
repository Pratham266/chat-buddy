import { useEffect } from "react";
import Login from "./components/Login";

import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./services/firebase";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "./redux/actions/userDetailsActions";
import { decryptData, encryptData } from "./helper/encodeDecode";
import { Icon } from "./IconsMap";
import Chat from "./components/Chat";
import { updateOnlineStatus } from "./services/messageService";

function App() {
  const {
    user,
    chatUser,
    status: userStatus,
  } = useSelector((state) => state.userDetails);

  const dispatch = useDispatch();
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

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      userLoggedInOrNot(user);
    });

    // Cleanup when component unmounts
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (userStatus === "succeeded" && user) {
      const tokenCode = encryptData(user.code);
      localStorage.setItem("token_code", tokenCode);

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

  if (!user && !tokenCode) return <Login />;

  if (user)
    return (
      <>
        <Chat currentUser={user} otherUser={chatUser} />
      </>
    );
  return (
    <div className="dotLoader-animation flex justify-center items-center min-h-screen">
      <Icon name="screenLoader" size={40} />
    </div>
  );
}

export default App;
