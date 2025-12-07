import { API_URL } from "@/lib/api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type UserAvatarProps = {
  username: string;
  fullname: string;
  avatar?: string | null;
  size?: "sm" | "md" | "lg" | "xl";
};

export const UserAvatar = ({
  username,
  fullname,
  avatar,
  size="md"
}: UserAvatarProps) => {
  return (
    <Avatar
      className={`
        flex items-center flex-wrap justify-center theme-2 rounded-full
        ${size === "sm" && "size-10"}
        ${size === "md" && "size-12"}
        ${size === "lg" && "size-16"}
        ${size === "xl" && "size-24"}
      `}
    >
      <AvatarImage
        src={avatar ? API_URL + avatar : ""}
        alt={username}
        className="rounded-full h-full w-full object-cover"
      />
      <AvatarFallback className="rounded-full text-black dark:text-white">
        {!avatar ? fullname.charAt(0) : ""}
      </AvatarFallback>
    </Avatar>
  );
};
