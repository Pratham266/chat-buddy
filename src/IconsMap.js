import { BiLoaderCircle } from "react-icons/bi";
import { LuLoader } from "react-icons/lu";
import { MdOutlineDone } from "react-icons/md";
import { MdOutlineDoneAll } from "react-icons/md";

const IconsMap = {
  dotloader: BiLoaderCircle,
  screenLoader: LuLoader,
  singleTick: MdOutlineDone,
  doubleTick: MdOutlineDoneAll,
};

export const Icon = ({ name, ...props }) => {
  const IconComponent = IconsMap[name];

  if (!IconComponent) return null;

  return <IconComponent {...props} />;
};
