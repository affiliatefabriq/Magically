import { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getLocale } from "next-intl/server";

import { RootLayoutProps } from "@/types";
import { ThemeProviders } from "./providers/ThemeProviders";

import "./globals.css";

import { QueryProvider } from "./providers/QueryProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Volshebny",
  description: "Volshebny Bot is a AI powered generation model for generating an images.",
};

export default async function RootLayout({ children }: RootLayoutProps) {
  const locale = await getLocale();

  return (
    <html lang={locale}>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <QueryProvider>
          <NextIntlClientProvider>
            <ThemeProviders>{children}</ThemeProviders>
          </NextIntlClientProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
