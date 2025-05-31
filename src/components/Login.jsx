import React, { useEffect } from "react";
import { useState } from "react";
import { loginUser } from "../redux/actions/userDetailsActions";
import { useDispatch, useSelector } from "react-redux";
import { Icon } from "../IconsMap";

const Login = () => {
  const dispatch = useDispatch();
  const { error: userError, status: userStatus } = useSelector(
    (state) => state.userDetails
  );

  const handleLogin = (code) => {
    dispatch(loginUser(code));
  };

  const [username, setUsername] = useState("");
  const [symbol, setSymbol] = useState("");
  const [otp, setOtp] = useState(["", "", ""]);

  const handleVerify = (e) => {
    e.preventDefault();
    const fullString = `${username}${symbol}${otp.join("")}`;
    const code = fullString && fullString.trim();
    if (userStatus === "pending") return;
    handleLogin(code);
  };

  const handleOtpChange = (value, index) => {
    const updatedOtp = [...otp];
    updatedOtp[index] = value;
    setOtp(updatedOtp);
  };

  useEffect(() => {
    if (userError) {
      setUsername("");
      setSymbol("");
      setOtp(["", "", ""]);
    }
  }, [userError]);

  const plc = { 0: "O", 1: "T", 2: "P" };

  return (
    <>
      <div
        className="relative flex  flex-col justify-center overflow-hidden bg-black py-12"
        style={{ maxHeight: "100dvh" }}
      >
        <div className="relative bg-white px-6 pt-10 pb-9 shadow-xl mx-auto w-full max-w-lg rounded-2xl">
          <div className="mx-auto flex w-full max-w-md flex-col space-y-4">
            <div className="flex flex-col items-center justify-center text-center space-y-2">
              <div className="font-semibold text-3xl">
                <p>Email Verification</p>
              </div>
              <div className="flex flex-row text-sm font-medium text-gray-400">
                <p>Enter Username Symbol OTP </p>
              </div>
            </div>

            {userError && (
              <p className="text-red-500 text-sm mb-3">{userError}</p>
            )}
            <form onSubmit={handleVerify}>
              <div className="flex flex-col space-y-4">
                {/* Username Input */}
                <input
                  className="w-full h-[50px] text-center px-5 outline-none rounded-xl border border-gray-200 text-lg bg-white focus:bg-gray-50 focus:ring-1 ring-blue-700"
                  type="text"
                  placeholder="Enter username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />

                {/* Symbol Input */}
                <div className="flex justify-center">
                  <input
                    className="w-16 h-16 text-center px-5 outline-none rounded-xl border border-gray-200 text-lg bg-white focus:bg-gray-50 focus:ring-1 ring-blue-700"
                    type="text"
                    maxLength={1}
                    value={symbol}
                    placeholder="S"
                    onChange={(e) => setSymbol(e.target.value)}
                  />
                </div>

                {/* OTP Inputs */}
                <div className="flex justify-between max-w-xs mx-auto space-x-2">
                  {otp.map((digit, idx) => (
                    <input
                      key={idx}
                      className="w-16 h-16 text-center px-5 outline-none rounded-xl border border-gray-200 text-lg bg-white focus:bg-gray-50 focus:ring-1 ring-blue-700"
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(e.target.value, idx)}
                      placeholder={plc[idx]}
                    />
                  ))}
                </div>

                {/* Verify Button */}
                <button
                  type="submit"
                  className="w-full py-5 bg-blue-700 text-white rounded-xl text-sm shadow-sm"
                >
                  {userStatus === "pending" ? (
                    <div className="dotLoader-animation item-center justify-center flex flex-center">
                      <Icon name="dotloader" size={20} />
                    </div>
                  ) : (
                    <span> Verify Account</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
