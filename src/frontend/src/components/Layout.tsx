import type { ReactNode } from "react";
import type { TabId } from "../types";
import BottomNav from "./BottomNav";
import Header from "./Header";

interface LayoutProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
  children: ReactNode;
  notificationCount?: number;
}

export default function Layout({
  activeTab,
  onTabChange,
  children,
  notificationCount = 0,
}: LayoutProps) {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Animated background */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Radial gradient base */}
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse at 20% 20%, oklch(var(--primary) / 0.12) 0%, transparent 50%),
              radial-gradient(ellipse at 80% 80%, oklch(var(--secondary) / 0.08) 0%, transparent 50%),
              radial-gradient(ellipse at 50% 50%, oklch(0.52 0.18 142 / 0.04) 0%, transparent 70%)
            `,
          }}
        />
        {/* Floating orbs */}
        <div
          className="absolute rounded-full float-orb"
          style={{
            width: 300,
            height: 300,
            top: -150,
            left: -150,
            background:
              "linear-gradient(135deg, oklch(var(--primary) / 0.18), transparent)",
            animationDelay: "0s",
          }}
        />
        <div
          className="absolute rounded-full float-orb"
          style={{
            width: 200,
            height: 200,
            top: "50%",
            right: -100,
            background:
              "linear-gradient(135deg, oklch(var(--secondary) / 0.15), transparent)",
            animationDelay: "5s",
          }}
        />
        <div
          className="absolute rounded-full float-orb"
          style={{
            width: 150,
            height: 150,
            bottom: "10%",
            left: "20%",
            background:
              "linear-gradient(135deg, oklch(var(--primary) / 0.12), transparent)",
            animationDelay: "10s",
          }}
        />
      </div>

      {/* Fixed header */}
      <Header />

      {/* Scrollable content */}
      <main
        className="relative z-10 mt-[60px] pb-[70px] min-h-[calc(100vh-130px)]"
        data-ocid="main-content"
      >
        {children}
      </main>

      {/* Fixed bottom nav */}
      <BottomNav
        activeTab={activeTab}
        onTabChange={onTabChange}
        notificationCount={notificationCount}
      />
    </div>
  );
}
