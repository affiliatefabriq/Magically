import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";

import { API_URL } from "@/lib/api";

export const UserAvatar = (user: { username: string; avatar?: string; fullname: string }) => {
  return (
    <Avatar className="flex items-center flex-wrap justify-center theme-2 size-10 rounded-full">
      <AvatarImage
        src={user.avatar !== null ? API_URL + user.avatar : ""}
        alt={user.username}
        className="rounded-full h-full w-full"
      />
      <AvatarFallback className="rounded-full text-black dark:text-white">
        {user.avatar === null ? user.fullname!.charAt(0) : ""}
      </AvatarFallback>
    </Avatar>
  );
};
