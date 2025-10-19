"use client";

import { ExploreError, NotAuthorized } from "@/components/states/error/Error";
import { useUser } from "@/hooks/useAuth";

export const Library = () => {
  const { data: user, isError } = useUser();

  return (
    <section className="flex items-center justify-center w-full h-full section-padding">
      {/* States Handler */}
      <div className="flex items-center justify-center w-full max-w-96">
        {!user && <NotAuthorized />}
        {user && isError && <ExploreError />}
      </div>
    </section>
  );
};
