import { useEffect, useState } from "react";
import Login from "./components/Login";
import { loginWithCode } from "./services/authService";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./services/firebase";
import Logout from "./components/Logout";

function App() {
  const [user, setUser] = useState(null);
  const userLoggedInOrNot = async (currentUser) => {
    if (currentUser) {
      const savedCode = localStorage.getItem("token_code");

      if (savedCode) {
        const data = await loginWithCode(savedCode);

        if (data) {
          setUser(data.userData);
        }
      }
    } else {
      setUser(null);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      userLoggedInOrNot(user);
    });

    // Cleanup when component unmounts
    return () => unsubscribe();
  }, []);

  if (!user) return <Login onLogin={setUser} />;

  return (
    <div className="p-4">
      <Logout />
      <h1 className="text-xl font-bold">Welcome, {user.username}</h1>
      {/* Load Chat UI Here */}
    </div>
  );
}

export default App;
