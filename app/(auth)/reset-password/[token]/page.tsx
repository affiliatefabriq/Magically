"use client";

import { useParams } from "next/navigation";
import { useTheme } from "next-themes";
import Starfield from "react-starfield";

import { ResetPassword } from "@/components/pages/auth/ResetPassword";

const Page = () => {
  const { theme } = useTheme();
  const params = useParams();
  const token = typeof params?.token === "string" ? params.token : Array.isArray(params?.token) ? params.token[0] : "";

  if (token) {
    return (
      <section className="flex items-center justify-center flex-col min-h-screen section-padding">
        <Starfield
          starCount={1000}
          starColor={theme === "dark" ? [255, 255, 255] : [0, 0, 0]}
          speedFactor={0.05}
          backgroundColor={theme === "dark" ? "black" : "white"}
        />
        <ResetPassword token={token} />
      </section>
    );
  }

  <section className="flex-center flex-col min-h-screen">
    <Starfield
      starCount={1000}
      starColor={theme === "dark" ? [255, 255, 255] : [0, 0, 0]}
      speedFactor={0.05}
      backgroundColor={theme === "dark" ? "black" : "white"}
    />
    <div></div>
  </section>;
};

export default Page;
