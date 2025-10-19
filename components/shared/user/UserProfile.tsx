import Link from "next/link";

import { Author } from "@/types";
import { UserAvatar } from "./UserAvatar";

export const UserProfile = (author: Author) => {
  return (
    <Link href={`/profile/${author.username}`} className="flex items-center justify-center gap-2">
      <UserAvatar {...author} />
      <div className="flex flex-col items-start justify-center">
        <span className="text-sm font-semibold">{author.fullname}</span>
        <span className="text-neutral-400 text-sm">@{author.username}</span>
      </div>
    </Link>
  );
};
