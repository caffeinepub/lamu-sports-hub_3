import {
  BarChart2,
  Bell,
  Calendar,
  Home,
  Newspaper,
  User,
  Users,
} from "lucide-react";
import type { TabId } from "../types";

interface NavTab {
  id: TabId;
  label: string;
  icon: React.ReactNode;
}

const TABS: NavTab[] = [
  { id: "home", label: "Home", icon: <Home size={22} /> },
  { id: "matches", label: "Matches", icon: <Calendar size={22} /> },
  { id: "standings", label: "Table", icon: <BarChart2 size={22} /> },
  { id: "teams", label: "Teams", icon: <Users size={22} /> },
  { id: "players", label: "Players", icon: <User size={22} /> },
  { id: "news", label: "News", icon: <Newspaper size={22} /> },
  { id: "notifications", label: "Alerts", icon: <Bell size={22} /> },
];

interface BottomNavProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
  notificationCount?: number;
}

export default function BottomNav({
  activeTab,
  onTabChange,
  notificationCount = 0,
}: BottomNavProps) {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 h-[70px] z-50 flex justify-around items-center px-2 glass-effect border-t"
      style={{ borderColor: "oklch(var(--primary) / 0.2)" }}
      data-ocid="bottom-nav"
    >
      {TABS.map((tab) => {
        const isActive = activeTab === tab.id;
        const showBadge = tab.id === "notifications" && notificationCount > 0;
        return (
          <button
            type="button"
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            aria-label={
              showBadge ? `${tab.label} (${notificationCount} new)` : tab.label
            }
            aria-current={isActive ? "page" : undefined}
            className="relative flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-xl min-w-[44px] transition-smooth"
            style={{
              color: isActive
                ? "oklch(var(--primary))"
                : "oklch(var(--muted-foreground))",
              background: isActive
                ? "oklch(var(--primary) / 0.12)"
                : "transparent",
            }}
            data-ocid={`nav-tab-${tab.id}`}
          >
            <span
              className="relative transition-smooth"
              style={{ transform: isActive ? "translateY(-2px)" : "none" }}
            >
              {tab.icon}
              {showBadge && (
                <span
                  className="absolute -top-1 -right-1.5 min-w-[16px] h-4 rounded-full text-[9px] font-bold flex items-center justify-center px-1 leading-none"
                  style={{
                    background: "oklch(var(--primary))",
                    color: "oklch(var(--primary-foreground))",
                  }}
                  data-ocid="notification-badge"
                >
                  {notificationCount > 99 ? "99+" : notificationCount}
                </span>
              )}
            </span>
            <span className="font-body text-[10px] font-semibold tracking-wide leading-none">
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
