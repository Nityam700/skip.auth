import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/app/globals.css";
import { Toaster } from "react-hot-toast";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { useTheme } from "@/hooks/useTheme";
import { connectDatabase } from "@/server/database/connect";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Authentication",
  description: "Created by skip.dev community",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // hooks
  const theme = useTheme();
  await connectDatabase();
  console.log("LOG FROM ROOT LAYOUT FILE");

  return (
    <html lang="en" className={theme}>
      <body className={inter.className}>
        <Toaster position="top-center" reverseOrder={false} />
        <Analytics />
        <SpeedInsights />
        {children}
      </body>
    </html>
  );
}
