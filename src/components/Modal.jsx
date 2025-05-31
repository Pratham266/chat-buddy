import React from "react";
import { Icon } from "../IconsMap";

const Modal = ({
  children,
  saveText = "save",
  cancleText = "cancle",
  handleOpen,
  onModalClose,
  onModalCalcle,
  onSave,
  open,
  title,
}) => {
  return (
    <div
      id="modelConfirm"
      className="fixed z-50 inset-0 bg-transparent backdrop-blur-sm overflow-y-auto h-full w-full px-4 bg-[#2d143e]"
      style={{ display: "block" }}
    >
      <div className="relative top-40 mx-auto shadow-xl rounded-md bg-white max-w-md  bg-[#2d143e]">
        <div className="flex justify-end item-center p-2">
          <div>
            <h3 className="text-black">{title}</h3>
          </div>

          <button
            onClick={() => {
              onModalClose(false);
            }}
            type="button"
            className=" cursor-pointer text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
          >
            <Icon name="close" size={24} />
          </button>
        </div>
        {children}
        <div className="p-6 pt-4 text-center">
          {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
          <button
            onClick={onSave}
            className=" cursor-pointer text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-base inline-flex items-center px-3 py-2.5 text-center mr-2"
            dataModalToggle="delete-user-modal"
          >
            {saveText}
          </button>
          {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
          <a
            onClick={() => {
              onModalCalcle(false);
            }}
            className=" cursor-pointer text-gray-900 bg-white hover:bg-gray-100 focus:ring-4 focus:ring-cyan-200 border border-gray-200 font-medium inline-flex items-center rounded-lg text-base px-3 py-2.5 text-center"
            dataModalToggle="delete-user-modal"
          >
            {cancleText}
          </a>
        </div>
      </div>
    </div>
  );
};

export default Modal;
