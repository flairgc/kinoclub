import { Button } from "@heroui/react";
import { clsx } from "clsx";
import { FC } from "react";
import { useLocation } from "wouter";
import {
  Bookmark,
  Users,
  Settings,
  IconProps as FeatherIconProps,
} from "react-feather";

type IconWithClassname<Props> = Props & { className?: string };

type BottomButtonProps = {
  label: string;
  path: string;
  Icon: FC<IconWithClassname<FeatherIconProps>>;
};

const BottomButton = ({ label, path, Icon }: BottomButtonProps) => {
  const [location, navigate] = useLocation();

  const isActive = location === path;

  return (
    <Button
      isIconOnly
      aria-label={label}
      variant="light"
      className="w-24 h-16"
      onPress={() => navigate(path)}
    >
      <div className="flex flex-col items-center">
        <Icon className={isActive ? "stroke-primary" : undefined} />
        <div className={clsx(["mt-2", { "text-primary": isActive }])}>
          {label}
        </div>
      </div>
    </Button>
  );
};

export const BottomNav = () => {
  const bottomButtonProps = [
    {
      label: "Кинотека",
      path: "/",
      Icon: Bookmark,
    },
    {
      label: "Клуб",
      path: "/club",
      Icon: Users,
    },
    {
      label: "Профиль",
      path: "/profile",
      Icon: Settings,
    },
  ];

  return (
    <div className="border-t flex flex-1 justify-around items-center ">
      {bottomButtonProps.map((props) => (
        <BottomButton key={props.path} {...props} />
      ))}
    </div>
  );
};
