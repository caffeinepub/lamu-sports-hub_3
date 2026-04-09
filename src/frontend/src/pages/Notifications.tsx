import { Skeleton } from "@/components/ui/skeleton";
import { Bell, X } from "lucide-react";
import { useState } from "react";
import {
  useActivities,
  useDismissActivity,
  useGetUserDismissed,
} from "../hooks/use-backend";
import type { ActivityItem } from "../types";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const TYPE_META: Record<
  ActivityItem["actionType"],
  { emoji: string; verb: string }
> = {
  join: { emoji: "✋", verb: "joined" },
  follow_team: { emoji: "⭐", verb: "followed" },
  follow_player: { emoji: "👤", verb: "followed player" },
  goal: { emoji: "⚽", verb: "goal scored for" },
  status_change: { emoji: "🔄", verb: "match status changed" },
};

// Avatar background colors cycling for visual variety
const AVATAR_COLORS = [
  "oklch(0.58 0.27 24.8)", // orange (primary)
  "oklch(0.52 0.18 142)", // green
  "oklch(0.44 0.19 257)", // blue
  "oklch(0.65 0.22 22)", // red
  "oklch(0.48 0.14 73)", // amber
];

function avatarColor(name: string): string {
  const idx = name.charCodeAt(0) % AVATAR_COLORS.length;
  return AVATAR_COLORS[idx];
}

function formatTimestamp(ts: bigint): string {
  const ms = Number(ts) / 1_000_000; // nanoseconds → ms
  const diff = Date.now() - ms;
  if (diff < 60_000) return "just now";
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)} min ago`;
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)} hours ago`;
  if (diff < 7 * 86_400_000) return `${Math.floor(diff / 86_400_000)} days ago`;
  return new Date(ms).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function buildActivityText(item: ActivityItem): string {
  const meta = TYPE_META[item.actionType];
  if (item.actionType === "status_change") {
    return `${item.entityName} — status changed`;
  }
  return `${meta.verb} ${item.entityName}`;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <div className="flex items-start gap-3 p-3.5 rounded-2xl border border-border/30 bg-card/60">
      <Skeleton className="w-10 h-10 rounded-full shrink-0" />
      <div className="flex-1 space-y-2 py-0.5">
        <Skeleton className="h-3.5 w-2/3 rounded" />
        <Skeleton className="h-3 w-1/2 rounded" />
        <Skeleton className="h-2.5 w-1/4 rounded" />
      </div>
    </div>
  );
}

function ActivityCard({
  item,
  onDismiss,
  isPending,
}: {
  item: ActivityItem;
  onDismiss: () => void;
  isPending: boolean;
}) {
  const meta = TYPE_META[item.actionType];
  const color = avatarColor(item.actorName);
  const initial = item.actorName.charAt(0).toUpperCase();

  return (
    <div
      className={`flex items-start gap-3 p-3.5 rounded-2xl border border-border/30 transition-smooth ${
        isPending
          ? "opacity-40 pointer-events-none"
          : "bg-card/70 hover:bg-card"
      }`}
      style={{
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
      }}
      data-ocid={`activity-item-${item.id}`}
    >
      {/* Avatar */}
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 mt-0.5 font-display font-bold text-sm"
        style={{
          background: color,
          color: "oklch(0.08 0 0)",
          boxShadow: `0 0 12px ${color}40`,
        }}
      >
        {initial}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {/* Actor + verb */}
        <p className="text-sm text-foreground leading-snug">
          <span className="font-semibold">{item.actorName}</span>{" "}
          <span className="text-muted-foreground">
            {meta.emoji} {buildActivityText(item)}
          </span>
        </p>
        {/* Timestamp */}
        <p className="text-[11px] text-muted-foreground/60 mt-1.5">
          {formatTimestamp(item.timestamp)}
        </p>
      </div>

      {/* Dismiss */}
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Dismiss notification"
        className="shrink-0 mt-0.5 p-1.5 rounded-lg text-muted-foreground/40 hover:text-muted-foreground hover:bg-muted/40 transition-colors"
        data-ocid={`dismiss-activity-${item.id}`}
      >
        <X size={14} />
      </button>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function Notifications() {
  const { data: activities = [], isLoading: activitiesLoading } =
    useActivities();
  const { data: dismissed = [], isLoading: dismissedLoading } =
    useGetUserDismissed();
  const dismissMutation = useDismissActivity();

  // Optimistic dismissed set
  const [optimisticDismissed, setOptimisticDismissed] = useState<Set<string>>(
    new Set(),
  );

  const isLoading = activitiesLoading || dismissedLoading;

  const serverDismissedSet = new Set(dismissed.map((id) => id.toString()));
  const visible = activities.filter(
    (a) =>
      !serverDismissedSet.has(a.id.toString()) &&
      !optimisticDismissed.has(a.id.toString()),
  );

  function handleDismiss(item: ActivityItem) {
    setOptimisticDismissed((prev) => new Set([...prev, item.id.toString()]));
    dismissMutation.mutate(item.id, {
      onError: () => {
        // Revert optimistic on failure
        setOptimisticDismissed((prev) => {
          const next = new Set(prev);
          next.delete(item.id.toString());
          return next;
        });
      },
    });
  }

  return (
    <div className="px-4 pt-2 pb-24 max-w-lg mx-auto">
      {/* Glass header section */}
      <div
        className="sticky top-0 z-10 -mx-4 px-4 pt-4 pb-3 mb-4 border-b border-border/30"
        style={{
          background: "oklch(0.08 0 0 / 0.85)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
        }}
      >
        <div className="flex items-start justify-between">
          <div>
            <h1 className="font-display text-lg font-bold text-foreground leading-tight">
              Live Activity
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              See what fans are doing right now
            </p>
          </div>

          {/* Auto-refresh indicator */}
          <div className="flex items-center gap-1.5 mt-1">
            <span
              className="w-2 h-2 rounded-full pulse-live"
              style={{ background: "oklch(0.58 0.27 24.8)" }}
            />
            <span className="text-[10px] text-muted-foreground/70 tracking-wide">
              updating live
            </span>
          </div>
        </div>

        {/* Count badge */}
        {!isLoading && visible.length > 0 && (
          <div className="mt-2.5 flex items-center gap-2">
            <span
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold"
              style={{
                background: "oklch(0.58 0.27 24.8 / 0.15)",
                color: "oklch(0.58 0.27 24.8)",
                border: "1px solid oklch(0.58 0.27 24.8 / 0.3)",
              }}
            >
              <Bell size={9} />
              {visible.length} {visible.length === 1 ? "update" : "updates"}
            </span>
          </div>
        )}
      </div>

      {/* Loading skeletons */}
      {isLoading && (
        <div className="space-y-3" data-ocid="notifications-loading">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      )}

      {/* Empty state */}
      {!isLoading && visible.length === 0 && (
        <div
          className="flex flex-col items-center justify-center py-20 text-center"
          data-ocid="notifications-empty"
        >
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mb-5"
            style={{
              background: "oklch(0.58 0.27 24.8 / 0.1)",
              border: "1px solid oklch(0.58 0.27 24.8 / 0.25)",
            }}
          >
            <Bell size={28} style={{ color: "oklch(0.58 0.27 24.8)" }} />
          </div>
          <p className="font-display font-semibold text-foreground text-base mb-2">
            No activity yet
          </p>
          <p className="text-sm text-muted-foreground max-w-[240px] leading-relaxed">
            Join a match or follow a team to get started!
          </p>
        </div>
      )}

      {/* Activity feed */}
      {!isLoading && visible.length > 0 && (
        <div className="space-y-2.5" data-ocid="activity-list">
          {visible.map((item) => (
            <ActivityCard
              key={item.id.toString()}
              item={item}
              onDismiss={() => handleDismiss(item)}
              isPending={optimisticDismissed.has(item.id.toString())}
            />
          ))}
        </div>
      )}
    </div>
  );
}
