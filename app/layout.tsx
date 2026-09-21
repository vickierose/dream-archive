import type { Metadata } from "next";
import { Caveat, Nunito } from "next/font/google";
import "./globals.css";

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
});

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dream Archive",
  description: "Explore your dreams and their reoccuring patterns",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${caveat.variable} ${nunito.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
