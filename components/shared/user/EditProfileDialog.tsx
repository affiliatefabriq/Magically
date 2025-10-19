"use client";

import { Pencil } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useUpdateAvatar, useUpdateProfile } from "@/hooks/useProfile";
import { UserAttributes } from "@/types";
import { UserAvatar } from "./UserAvatar";

export const EditProfileDialog = ({ user, setOpen }: { user: UserAttributes; setOpen: (open: boolean) => void }) => {
  const { register, handleSubmit } = useForm({
    defaultValues: {
      fullname: user.fullname,
      bio: user.bio,
    },
  });
  const updateProfileMutation = useUpdateProfile();
  const updateAvatarMutation = useUpdateAvatar();

  const onProfileSubmit = (data: any) => {
    updateProfileMutation.mutate(data, {
      onSuccess: () => {
        toast.success("Profile updated!");
        setOpen(false);
      },
      onError: () => toast.error("Failed to update profile."),
    });
  };

  const onAvatarChange = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("avatar", file);
      updateAvatarMutation.mutate(formData, {
        onSuccess: () => toast.success("Avatar updated!"),
        onError: () => toast.error("Failed to update avatar."),
      });
    }
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Edit Profile</DialogTitle>
      </DialogHeader>
      <div className="flex flex-col items-center gap-4">
        <label htmlFor="avatar-upload" className="cursor-pointer relative">
          <UserAvatar {...user} />
          <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 hover:opacity-100">
            <Pencil strokeWidth={1} className="text-white" />
          </div>
        </label>
        <Input id="avatar-upload" type="file" accept="image/*" className="hidden" onChange={onAvatarChange} />
      </div>
      <form onSubmit={handleSubmit(onProfileSubmit)} className="space-y-4">
        <div className="flex flex-col gap-2">
          <label>Full Name</label>
          <Input {...register("fullname")} />
        </div>
        <div className="flex flex-col gap-2">
          <label>Bio</label>
          <Textarea {...register("bio")} />
        </div>
        <Button type="submit" disabled={updateProfileMutation.isPending} className="w-full mt-2 btn-solid">
          {updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
        </Button>
      </form>
    </DialogContent>
  );
};
