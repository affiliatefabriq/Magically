import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { API_URL } from "@/lib/api";

type UserAvatarProps = {
  username: string;
  fullname: string;
  avatar?: string | null;
  size?: "sm" | "md" | "lg" | "xl";
};

export const UserAvatar = ({ username, fullname, avatar, size = "md" }: UserAvatarProps) => {
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
      <AvatarFallback
        className={`rounded-full text-black dark:text-white         
          ${size === "sm" && "text-base"}
          ${size === "md" && "text-lg"}
          ${size === "lg" && "text-xl"}
          ${size === "xl" && "text-2xl"}
        `}
      >
        {!avatar ? fullname.charAt(0) : ""}
      </AvatarFallback>
    </Avatar>
  );
};
