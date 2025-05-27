import { BiLoaderCircle } from "react-icons/bi";
import { LuLoader } from "react-icons/lu";

const IconsMap = {
  dotloader: BiLoaderCircle,
  screenLoader: LuLoader,
};

export const Icon = ({ name, ...props }) => {
  const IconComponent = IconsMap[name];

  if (!IconComponent) return null;

  return <IconComponent {...props} />;
};
