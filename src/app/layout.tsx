import { type Metadata } from "next";
import { Geist } from "next/font/google";

import Providers from "@/app/(providers)";
import "@/shared/styles/globals.css";
import { Header } from "@/widgets/header";

export const metadata: Metadata = {
  title: "D3V",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${geist.variable}`}>
      <body className="scroll-smooth antialiased">
        <Providers>
          <Header />
          {children}
        </Providers>
      </body>
    </html>
  );
}
