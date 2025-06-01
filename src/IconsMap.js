import { BiLoaderCircle } from "react-icons/bi";
import { LuLoader } from "react-icons/lu";
import { MdOutlineDone } from "react-icons/md";
import { MdOutlineDoneAll } from "react-icons/md";
import { IoMdLogOut } from "react-icons/io";
import { IoMdTrash } from "react-icons/io";
import { FaSignalMessenger } from "react-icons/fa6";
import { BiSend } from "react-icons/bi";
import { BsEmojiSmileFill } from "react-icons/bs";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { RiUploadCloudLine } from "react-icons/ri";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { FaCloudDownloadAlt } from "react-icons/fa";
import { IoGameControllerOutline } from "react-icons/io5";
import { FaCarAlt } from "react-icons/fa";
import { BiSolidPhoneCall } from "react-icons/bi";
import { ImPhoneHangUp } from "react-icons/im";
import { MdVideoCall } from "react-icons/md";
import { GoDotFill } from "react-icons/go";

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
  dots: HiOutlineDotsHorizontal,
  upload: RiUploadCloudLine,
  close: IoIosCloseCircleOutline,
  download: FaCloudDownloadAlt,
  game: IoGameControllerOutline,
  car: FaCarAlt,
  calling: BiSolidPhoneCall,
  hangup: ImPhoneHangUp,
  videocall: MdVideoCall,
  dot: GoDotFill,
};

export const Icon = ({ name, ...props }) => {
  const IconComponent = IconsMap[name];

  if (!IconComponent) return null;

  return <IconComponent {...props} />;
};
