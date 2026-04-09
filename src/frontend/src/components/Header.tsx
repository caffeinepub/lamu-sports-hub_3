import { Bell, Search } from "lucide-react";

interface HeaderProps {
  notificationCount?: number;
}

export default function Header({ notificationCount = 3 }: HeaderProps) {
  return (
    <header
      className="fixed top-0 left-0 right-0 h-[60px] z-50 flex items-center justify-between px-4 glass-effect border-b"
      style={{ borderColor: "oklch(var(--primary) / 0.25)" }}
      data-ocid="app-header"
    >
      {/* Logo */}
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center text-xl font-black glow-orange"
          style={{
            background:
              "linear-gradient(135deg, oklch(var(--primary)), oklch(var(--secondary)))",
            boxShadow: "0 4px 15px oklch(var(--primary) / 0.35)",
          }}
        >
          ⚽
        </div>
        <div className="leading-none">
          <div className="font-display font-black text-xl text-primary tracking-tight">
            Lamu
          </div>
          <div className="font-body text-xs text-muted-foreground font-medium tracking-wide">
            Sports Hub
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          aria-label="Search"
          className="w-10 h-10 rounded-xl flex items-center justify-center transition-smooth"
          style={{
            background: "oklch(var(--primary) / 0.1)",
            color: "oklch(var(--primary))",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background =
              "oklch(var(--primary))";
            (e.currentTarget as HTMLButtonElement).style.color =
              "oklch(var(--primary-foreground))";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background =
              "oklch(var(--primary) / 0.1)";
            (e.currentTarget as HTMLButtonElement).style.color =
              "oklch(var(--primary))";
          }}
          data-ocid="header-search"
        >
          <Search size={18} />
        </button>
        <button
          type="button"
          aria-label={`Notifications (${notificationCount} unread)`}
          className="relative w-10 h-10 rounded-xl flex items-center justify-center transition-smooth"
          style={{
            background: "oklch(var(--primary) / 0.1)",
            color: "oklch(var(--primary))",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background =
              "oklch(var(--primary))";
            (e.currentTarget as HTMLButtonElement).style.color =
              "oklch(var(--primary-foreground))";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background =
              "oklch(var(--primary) / 0.1)";
            (e.currentTarget as HTMLButtonElement).style.color =
              "oklch(var(--primary))";
          }}
          data-ocid="header-notifications"
        >
          <Bell size={18} />
          {notificationCount > 0 && (
            <span
              className="absolute -top-0.5 -right-0.5 w-[18px] h-[18px] rounded-full text-[10px] font-bold flex items-center justify-center border-2"
              style={{
                background: "oklch(var(--destructive))",
                color: "oklch(var(--destructive-foreground))",
                borderColor: "oklch(var(--background))",
              }}
            >
              {notificationCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}
