import type { Metadata } from "next";
import "./globals.css";
import "./marketing.css";
import { DemoProvider } from "@/components/ionco/demo-provider";
export const metadata: Metadata = {
  title: { default: "IONCO — A new dimension of Web3", template: "%s · IONCO" },
  description:
    "Explore IONCO SmartChain, the INC ecosystem, and a new way to connect with Web3. Discover the network, tokenomics, and interactive staking demo.",
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased">
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <DemoProvider>{children}</DemoProvider>
      </body>
    </html>
  );
}
