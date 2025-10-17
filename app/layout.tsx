import type { Metadata } from "next";
import "./globals.css";
import { Geist } from "next/font/google";

const geist = Geist({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Threads of Time",
  description: "Your life is a story. See the plot unfold.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={geist.className}>
      <body className="bg-base-300 min-h-dvh text-base-content flex flex-col justify-center">
        {children}
      </body>
    </html>
  );
}
