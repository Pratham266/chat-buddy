import { BiLoaderCircle } from "react-icons/bi";
import { LuLoader } from "react-icons/lu";
import { MdOutlineDone } from "react-icons/md";
import { MdOutlineDoneAll } from "react-icons/md";
import { IoMdLogOut } from "react-icons/io";
import { IoMdTrash } from "react-icons/io";
import { FaSignalMessenger } from "react-icons/fa6";
import { BiSend } from "react-icons/bi";
import { BsEmojiSmileFill } from "react-icons/bs";

const IconsMap = {
  dotloader: BiLoaderCircle,
  screenLoader: LuLoader,
  singleTick: MdOutlineDone,
  doubleTick: MdOutlineDoneAll,
  logout: IoMdLogOut,
  delete: IoMdTrash,
  signal: FaSignalMessenger,
  send: BiSend,
  smile: BsEmojiSmileFill,
};

export const Icon = ({ name, ...props }) => {
  const IconComponent = IconsMap[name];

  if (!IconComponent) return null;

  return <IconComponent {...props} />;
};
