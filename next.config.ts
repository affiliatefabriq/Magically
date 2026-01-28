import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  devIndicators: false,
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "5000",
        pathname: "**",
      },
    ],
  },
  allowedDevOrigins: ['l.app.volshebny.by']
};

const withNextIntl = createNextIntlPlugin("./app/i18n/requests.ts");

export default withNextIntl(nextConfig);
