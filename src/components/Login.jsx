import React from "react";
import { useState } from "react";
import { loginWithCode } from "../services/authService";

const Login = ({ onLogin }) => {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    const result = await loginWithCode(code);
    if (result.success) {
      onLogin(result.userData);
      localStorage.setItem("token_code", result.userData.code);
    } else {
      setError(result.message);
    }
  };

  return (
    // <div className="min-h-screen flex items-center justify-center bg-gray-100">
    //   <div className="bg-white p-6 rounded shadow-md w-80">
    //     <h2 className="text-2xl font-semibold mb-4 text-center">
    //       Login with Code
    //     </h2>
    //     <input
    //       type="text"
    //       placeholder="Enter your code"
    //       value={code}
    //       onChange={(e) => setCode(e.target.value)}
    //       className="w-full border px-3 py-2 rounded mb-3 focus:outline-none"
    //     />
    //     {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
    //     <button
    //       onClick={handleLogin}
    //       className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
    //     >
    //       Login
    //     </button>
    //   </div>
    // </div>

    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12 login-screen">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-sky-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
            <div>
              <h1 className="text-2xl font-semibold">Game Be Careful</h1>
            </div>
            <div className="divide-y divide-gray-200">
              <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                <div className="relative">
                  <input
                    autocomplete="off"
                    id="code"
                    name="code"
                    type="text"
                    className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600"
                    onChange={(e) => setCode(e.target.value)}
                    autoFocus
                  />
                  {error && (
                    <p className="text-red-500 text-sm mb-3">{error}</p>
                  )}
                  <label
                    for="email"
                    className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
                  >
                    Add Game Code
                  </label>
                </div>
                {/* <div className="relative">
                  <input
                    autocomplete="off"
                    id="password"
                    name="password"
                    type="password"
                    className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600"
                    placeholder="Password"
                  />
                  <label
                    for="password"
                    className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
                  >
                    Password
                  </label>
                </div> */}
              </div>
            </div>
          </div>

          <div className="w-full flex justify-center">
            <button
              className="cursor-pointer flex items-center bg-white border border-gray-300 rounded-lg shadow-md px-6 py-2 text-sm font-medium text-gray-800 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              onClick={handleLogin}
            >
              <span>Go</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
