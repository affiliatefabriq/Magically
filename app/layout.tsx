import { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getLocale } from "next-intl/server";

import { RootLayoutProps } from "@/types";
import { ClientLayout } from "./providers/ClientLayout";
import { QueryProvider } from "./providers/QueryProvider";
import { TelegramProvider } from "./providers/TelegramProvider";
import { ThemeProviders } from "./providers/ThemeProviders";

import "./globals.css";

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
            <ThemeProviders>
              <TelegramProvider>
                <ClientLayout>{children}</ClientLayout>
              </TelegramProvider>
            </ThemeProviders>
          </NextIntlClientProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
