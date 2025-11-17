"use client";

import { UserAttributes } from "@/types";
import { FollowButton } from "./FollowButton";
import { UserProfile } from "./UserProfile";

export const UserCard = ({
  user,
}: {
  user: UserAttributes,
}) => (
  <div key={user.id} className="flex items-center justify-between px-4 py-2 rounded-lg empty hover:bg-muted">
    <UserProfile {...user} />
    <FollowButton {...user} />
  </div>
);
