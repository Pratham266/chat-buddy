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

  return (
    <>
      <div className="relative flex  flex-col justify-center overflow-hidden  py-12 h-dvh">
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
                {/* Username Input */}
                <input
                  className="w-full h-[50px] text-center px-5 outline-none rounded-xl border border-[#5f317e] text-lg bg-white focus:bg-gray-50 focus:ring-1 ring-[#5f317e]"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="off"
                  autoCorrect="off"
                  spellCheck={false}
                />

                {/* Symbol Input */}
                <div className="flex justify-center">
                  <input
                    className="w-16 h-16 text-center px-5 outline-none rounded-xl border border-[#5f317e] text-lg bg-white focus:bg-gray-50 focus:ring-1 ring-[#5f317e]"
                    type="text"
                    maxLength={1}
                    value={symbol}
                    onChange={(e) => setSymbol(e.target.value)}
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

                {/* Verify Button */}
                <button
                  type="submit"
                  className="w-full py-5 bg-[#2d143e] cursor-pointer  hover:bg-[#5f317e] text-white rounded-xl text-sm shadow-sm"
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
    </>
  );
};

export default Login;
