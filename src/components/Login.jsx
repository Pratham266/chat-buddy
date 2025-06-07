import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../redux/actions/userDetailsActions";
import { Icon } from "../IconsMap";

const Login = () => {
  const dispatch = useDispatch();
  const { error: userError, status: userStatus } = useSelector(
    (state) => state.userDetails
  );

  const [username, setUsername] = useState("");
  const [symbol, setSymbol] = useState("");
  const [otp, setOtp] = useState(["", "", ""]);

  // Refs for inputs
  const symbolRef = useRef(null);
  const otpRefs = useRef([]);
  const usernameRef = useRef(null);

  const handleLogin = (code) => {
    dispatch(loginUser(code));
  };

  const handleVerify = (e) => {
    e.preventDefault();
    const fullString = `${username}${symbol}${otp.join("")}`;
    const code = fullString && fullString.trim();
    if (userStatus === "pending") return;
    handleLogin(code);
  };

  const handleSymbolChange = (value) => {
    setSymbol(value);
    if (value.length === 1) {
      otpRefs.current[0]?.focus();
    }
  };

  const handleOtpChange = (value, index) => {
    const updatedOtp = [...otp];
    updatedOtp[index] = value;
    setOtp(updatedOtp);

    if (value.length === 1) {
      if (index < otp.length - 1) {
        otpRefs.current[index + 1]?.focus();
      } else {
        usernameRef.current?.focus();
      }
    }
  };

  useEffect(() => {
    if (userError) {
      setUsername("");
      setSymbol("");
      setOtp(["", "", ""]);
      symbolRef.current?.focus();
    }
  }, [userError]);

  return (
    <div className="relative flex flex-col justify-center overflow-hidden py-12 h-dvh area">
      <ul className="circles">
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
      </ul>
      <div className="relative px-6 pt-10 pb-9 shadow-xl mx-auto w-full max-w-lg rounded-2xl bg-[#dfc3ff]">
        <div className="mx-auto flex w-full max-w-md flex-col space-y-4">
          <div className="flex flex-col items-center justify-center text-center space-y-2">
            <Icon name="game" size={50} />
            <div className="font-semibold text-3xl">
              <p>RealmRunners</p>
            </div>
            <div className="flex flex-row text-sm font-medium text-black-400">
              <p>Only the brave survive the run.</p>
            </div>
          </div>

          {userError && (
            <p className="text-red-500 text-sm mb-3">{userError}</p>
          )}

          <form onSubmit={handleVerify}>
            <div className="flex flex-col space-y-4">
              {/* Symbol Input */}
              <div className="flex justify-center">
                <input
                  ref={symbolRef}
                  className="w-16 h-16 text-center px-5 outline-none rounded-xl border border-[#5f317e] text-lg bg-white focus:bg-gray-50 focus:ring-1 ring-[#5f317e]"
                  type="text"
                  maxLength={1}
                  value={symbol}
                  onChange={(e) => handleSymbolChange(e.target.value)}
                  autoComplete="off"
                  autoCorrect="off"
                  spellCheck={false}
                />
              </div>

              {/* OTP Inputs */}
              <div className="flex justify-between max-w-xs mx-auto space-x-2">
                {otp.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={(el) => (otpRefs.current[idx] = el)}
                    className="w-16 h-16 text-center px-5 outline-none rounded-xl border border-[#5f317e] text-lg bg-white focus:bg-gray-50 focus:ring-1 ring-[#5f317e]"
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(e.target.value, idx)}
                    autoComplete="off"
                    autoCorrect="off"
                    spellCheck={false}
                  />
                ))}
              </div>

              {/* Username Input */}
              <input
                ref={usernameRef}
                className="w-full h-[50px] text-center px-5 outline-none rounded-xl border border-[#5f317e] text-lg bg-white focus:bg-gray-50 focus:ring-1 ring-[#5f317e]"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="off"
                autoCorrect="off"
                spellCheck={false}
              />

              {/* Verify Button */}
              <button
                type="submit"
                className="w-full py-5 bg-[#2d143e] cursor-pointer hover:bg-[#5f317e] text-white rounded-xl text-sm shadow-sm"
              >
                {userStatus === "pending" ? (
                  <div className="dotLoader-animation item-center justify-center flex flex-center">
                    <Icon name="dotloader" size={20} />
                  </div>
                ) : (
                  <div className="item-center justify-center flex flex-center">
                    <Icon name="car" size={20} />
                  </div>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
