import type { Metadata } from "next";
import { AppShell } from "@/components/ionco/app-shell";
export const metadata: Metadata = {
  title: "Dashboard",
  robots: { index: false, follow: false },
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return <AppShell>{children}</AppShell>;
}
