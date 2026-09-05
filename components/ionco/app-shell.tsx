"use client";
import { type ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Layers3,
  ArrowLeftRight,
  Wallet,
  History,
  Settings2,
  CircleHelp,
  ArrowUpRight,
  Globe,
  ShieldCheck,
  Users,
  FileText,
  ScrollText,
  Bell,
  ChevronRight,
} from "lucide-react";
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Logo, WalletConnect } from "./shared";
import { useDemo } from "./demo-provider";
const userNav = [
  { name: "Overview", path: "/dashboard", icon: LayoutDashboard },
  { name: "Staking", path: "/dashboard/staking", icon: Layers3 },
  { name: "Buy & sell", path: "/dashboard/trade", icon: ArrowLeftRight },
  { name: "My wallet", path: "/dashboard/wallet", icon: Wallet },
  { name: "Activity", path: "/dashboard/activity", icon: History },
];
const adminNav = [
  { name: "Overview", path: "/admin", icon: LayoutDashboard },
  { name: "Members", path: "/admin/users", icon: Users },
  { name: "Wallets", path: "/admin/wallets", icon: Wallet },
  { name: "Transactions", path: "/admin/transactions", icon: ArrowLeftRight },
  { name: "Staking pools", path: "/admin/staking", icon: Layers3 },
  { name: "Website content", path: "/admin/content", icon: FileText },
  { name: "Settings", path: "/admin/settings", icon: Settings2 },
  { name: "Audit log", path: "/admin/audit", icon: ScrollText },
];
function ShellInner({
  children,
  admin,
}: {
  children: ReactNode;
  admin: boolean;
}) {
  const path = usePathname();
  const router = useRouter();
  const { setOpenMobile } = useSidebar();
  const { state } = useDemo();
  const nav = admin ? adminNav : userNav;
  const current =
    [
      ...nav,
      { name: "Settings", path: "/dashboard/settings" },
      { name: "Help & resources", path: "/dashboard/help" },
    ].find((n) => n.path === path)?.name || "Overview";
  return (
    <>
      <Sidebar className="app-sidebar">
        <Logo />
        <SidebarContent className="px-3 gap-1">
          <div className="nav-group-label">
            {admin ? "ADMINISTRATION" : "YOUR WORKSPACE"}
          </div>
          <SidebarMenu>
            {nav.map((n) => (
              <SidebarMenuItem key={n.path}>
                <SidebarMenuButton asChild isActive={path === n.path}>
                  <Link href={n.path} onClick={() => setOpenMobile(false)}>
                    <n.icon strokeWidth={1.5} />
                    <span>{n.name}</span>
                    {n.name === "Members" &&
                      state.members.some((m) => m.kyc === "Pending") && (
                        <span className="ml-auto rounded bg-[#244149] px-1.5 text-[10px]">
                          {
                            state.members.filter((m) => m.kyc === "Pending")
                              .length
                          }
                        </span>
                      )}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
          {!admin && (
            <>
              <div className="nav-group-label mt-7">PREFERENCES</div>
              <SidebarMenu>
                {[
                  {
                    name: "Settings",
                    path: "/dashboard/settings",
                    icon: Settings2,
                  },
                  {
                    name: "Help & resources",
                    path: "/dashboard/help",
                    icon: CircleHelp,
                  },
                ].map((n) => (
                  <SidebarMenuItem key={n.path}>
                    <SidebarMenuButton asChild isActive={path === n.path}>
                      <Link href={n.path} onClick={() => setOpenMobile(false)}>
                        <n.icon strokeWidth={1.5} />
                        <span>{n.name}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </>
          )}
        </SidebarContent>
        <SidebarFooter className="p-0 gap-0">
          <div className="sidebar-bottom">
            <h4>
              {admin
                ? "Explore the member experience"
                : "A little more possibility."}
            </h4>
            <p>
              {admin
                ? "See how your demo settings appear in the app."
                : "Get to know INC and the IONCO ecosystem."}
            </p>
            <Link href={admin ? "/dashboard" : "/"}>
              {admin ? "Open dashboard" : "Explore IONCO"} ↗
            </Link>
          </div>
          <div className="sidebar-profile">
            <div className="avatar">{admin ? "IA" : "AM"}</div>
            <div className="profile-label">
              <strong>{admin ? "IONCO Admin" : "Alex Morgan"}</strong>
              <span>
                {admin
                  ? "Administrator · demo access"
                  : "Personal account · demo"}
              </span>
            </div>
          </div>
        </SidebarFooter>
      </Sidebar>
      <div className="app-body">
        <header className="app-header">
          <div className="app-breadcrumb">
            <SidebarTrigger className="md:hidden !min-h-11 !min-w-9" />
            <span>{admin ? "Administration" : "Workspace"}</span>
            <ChevronRight size={12} className="hidden md:block" />
            <strong>{current}</strong>
          </div>
          <div className="header-actions">
            <div className="network-pill">
              <Globe />
              IONCO SmartChain
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="View notifications"
                  className="!min-h-10 !min-w-10 text-[#83a5b5]"
                >
                  <Bell size={17} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-72">
                <DropdownMenuLabel className="text-xs p-3">
                  Demo notifications
                </DropdownMenuLabel>
                <DropdownMenuLabel className="font-normal text-xs leading-6 px-3 pb-3 text-muted-foreground">
                  {admin
                    ? `${state.members.filter((m) => m.kyc === "Pending").length} sample members are awaiting identity review.`
                    : "Your demo workspace is ready. Explore staking, trading, and your wallet."}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href={admin ? "/admin/users" : "/dashboard/activity"}>
                    {admin ? "Review members" : "View activity"}
                    <ArrowUpRight />
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            {admin ? (
              <div className="flex items-center gap-2 text-xs text-[#a9c5d2]">
                <ShieldCheck size={15} />
                <span className="hidden sm:inline">Demo admin</span>
              </div>
            ) : (
              <WalletConnect compact />
            )}
          </div>
        </header>
        <main className="workspace" id="main">
          <div className="demo-banner">
            <ShieldCheck />
            <span>
              <strong>Demo workspace.</strong>{" "}
              {admin
                ? "Sample records and local controls. This is not an authenticated production admin."
                : "Prices, balances, and rewards are simulated. No real funds or wallet signatures."}
            </span>
            <Link href={admin ? "/dashboard" : "/dashboard/help"}>
              {admin ? "Member view" : "About this demo"} ↗
            </Link>
          </div>
          {state.settings.maintenance && (
            <div className="admin-alert">
              <CircleHelp />
              <div>
                <strong>Demo maintenance is enabled</strong>
                <p>
                  Trading, staking, and reward actions are temporarily paused by
                  the demo administrator.
                </p>
              </div>
            </div>
          )}
          {admin && (
            <div className="mobile-page-select">
              <Select value={path} onValueChange={(v) => router.push(v)}>
                <SelectTrigger
                  className="w-full min-h-11"
                  aria-label="Admin page"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {adminNav.map((n) => (
                    <SelectItem key={n.path} value={n.path}>
                      {n.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          {children}
          <footer className="app-footer">
            <span>© 2026 IONCO SmartChain</span>
            <span>
              Local demo · <Link href="/dashboard/help">Resources</Link> ·{" "}
              <Link href={admin ? "/dashboard" : "/admin"}>
                {admin ? "Member dashboard" : "Admin demo"}
              </Link>
            </span>
          </footer>
        </main>
      </div>
      <nav
        className="mobile-bottom-nav"
        aria-label={
          admin ? "Admin quick navigation" : "Dashboard quick navigation"
        }
      >
        {(admin
          ? [adminNav[0], adminNav[1], adminNav[3], adminNav[4], adminNav[6]]
          : userNav
        ).map((n) => (
          <Link
            key={n.path}
            href={n.path}
            className={path === n.path ? "active" : ""}
            aria-current={path === n.path ? "page" : undefined}
          >
            <n.icon strokeWidth={1.6} />
            {n.name === "My wallet"
              ? "Wallet"
              : n.name === "Staking pools"
                ? "Pools"
                : n.name}
          </Link>
        ))}
      </nav>
    </>
  );
}
export function AppShell({
  children,
  admin = false,
}: {
  children: ReactNode;
  admin?: boolean;
}) {
  return (
    <SidebarProvider className="app-root">
      <ShellInner admin={admin}>{children}</ShellInner>
    </SidebarProvider>
  );
}
