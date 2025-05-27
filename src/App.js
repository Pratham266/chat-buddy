import { useEffect, useState } from "react";
import Login from "./components/Login";

import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./services/firebase";
import Logout from "./components/Logout";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "./redux/actions/userDetailsActions";
import { decryptData, encryptData } from "./helper/encodeDecode";
import { Icon } from "./IconsMap";

function App() {
  const { user, status: userStatus } = useSelector(
    (state) => state.userDetails
  );

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
    }
  }, [userStatus, user]);

  const handleLogin = (code) => {
    dispatch(loginUser(code));
  };

  if (!user && !tokenCode) return <Login />;

  if (user)
    return (
      <div className="p-4">
        <Logout />
        <h1 className="text-xl font-bold">Welcome, {user.username}</h1>
        {/* Load Chat UI Here */}
      </div>
    );
  return (
    <div className="dotLoader-animation flex justify-center items-center min-h-screen">
      <Icon name="screenLoader" size={40} />
    </div>
  );
}

export default App;
