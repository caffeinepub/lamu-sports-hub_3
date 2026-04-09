import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import { ChevronDown, ChevronUp, Share2, UserPlus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  useHasJoinedMatch,
  useJoinMatch,
  useMatches,
} from "../hooks/use-backend";
import type { Match, MatchStatus } from "../types";

/* ─── Types ──────────────────────────────────────────────────────────── */
type Filter = "all" | MatchStatus;

const FILTERS: { id: Filter; label: string; emoji: string }[] = [
  { id: "all", label: "All", emoji: "📋" },
  { id: "live", label: "Live", emoji: "🔴" },
  { id: "upcoming", label: "Upcoming", emoji: "📅" },
  { id: "finished", label: "Results", emoji: "✅" },
];

/* ─── Share helper ───────────────────────────────────────────────────── */
function buildMatchShareText(match: Match): string {
  const date = new Date(match.date).toLocaleDateString("en-KE", {
    weekday: "short",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const time = new Date(match.date).toLocaleTimeString("en-KE", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
  const scoreLine =
    match.status !== "upcoming"
      ? `\n⚽ ${match.homeScore} - ${match.awayScore}${match.status === "live" ? ` (LIVE ${match.minute}')` : " (FT)"}`
      : "";
  return `🏆 ${match.homeTeamName} vs ${match.awayTeamName}${scoreLine}\n📅 ${date} • ${time}\n📍 ${match.venue || "Lamu County"}\n\nLive on Lamu Sports Hub`;
}

async function shareContent(text: string, title?: string) {
  if (navigator.share) {
    try {
      await navigator.share({ title: title ?? "Lamu Sports Hub", text });
      toast.success("Shared!");
      return;
    } catch {
      // User cancelled or not supported, fall through to clipboard
    }
  }
  try {
    await navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  } catch {
    toast.error("Could not share");
  }
}

/* ─── Share Button ────────────────────────────────────────────────────── */
function ShareButton({ onClick }: { onClick: (e: React.MouseEvent) => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Share"
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all hover:opacity-90 active:scale-95"
      style={{
        background: "oklch(var(--primary) / 0.12)",
        border: "1px solid oklch(var(--primary) / 0.35)",
        color: "oklch(var(--primary))",
        backdropFilter: "blur(8px)",
      }}
      data-ocid="share-match-btn"
    >
      <Share2 size={13} />
      Share
    </button>
  );
}

/* ─── Join Match Button ───────────────────────────────────────────────── */
function JoinMatchButton({
  matchId,
  onLoginRequired,
}: {
  matchId: string;
  onLoginRequired: () => void;
}) {
  const { loginStatus, identity } = useInternetIdentity();
  const isLoggedIn = loginStatus === "success" && !!identity;
  const { data: hasJoined, isLoading: checkingJoin } =
    useHasJoinedMatch(matchId);
  const { mutate: joinMatch, isPending } = useJoinMatch();

  function handleJoin() {
    if (!isLoggedIn) {
      onLoginRequired();
      return;
    }
    joinMatch(matchId);
  }

  if (checkingJoin) {
    return (
      <div
        className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border"
        style={{
          background: "oklch(var(--muted) / 0.4)",
          borderColor: "oklch(var(--border))",
          color: "oklch(var(--muted-foreground))",
          minWidth: 100,
        }}
      >
        <span className="w-3 h-3 rounded-full border border-current border-t-transparent animate-spin" />
        Checking…
      </div>
    );
  }

  if (hasJoined) {
    return (
      <div
        className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border"
        style={{
          background: "oklch(var(--primary) / 0.1)",
          borderColor: "oklch(var(--primary) / 0.3)",
          color: "oklch(var(--primary))",
          minWidth: 100,
        }}
        data-ocid={`joined-badge-${matchId}`}
      >
        ✓ Joined
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={handleJoin}
      disabled={isPending}
      data-ocid={`join-match-${matchId}`}
      className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all hover:opacity-90 active:scale-95 disabled:opacity-60"
      style={{
        background: isPending
          ? "oklch(var(--muted) / 0.4)"
          : "oklch(0.58 0.27 24.8)",
        borderColor: isPending
          ? "oklch(var(--border))"
          : "oklch(0.58 0.27 24.8)",
        color: isPending ? "oklch(var(--muted-foreground))" : "#020617",
        minWidth: 100,
      }}
    >
      {isPending ? (
        <>
          <span className="w-3 h-3 rounded-full border border-current border-t-transparent animate-spin" />
          Joining…
        </>
      ) : (
        <>
          <UserPlus size={13} />✋ Join Match
        </>
      )}
    </button>
  );
}

/* ─── Inline Detail Panel ─────────────────────────────────────────────── */
function ScoreUpdateForm({
  match,
  onClose,
}: { match: Match; onClose: () => void }) {
  const [home, setHome] = useState(String(match.homeScore));
  const [away, setAway] = useState(String(match.awayScore));
  const [minute, setMinute] = useState(String(match.minute ?? ""));
  const [saved, setSaved] = useState(false);

  function handleSave() {
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 1200);
  }

  return (
    <div
      className="mt-3 rounded-xl border p-4"
      style={{
        background: "oklch(var(--muted) / 0.4)",
        borderColor: "oklch(var(--primary) / 0.2)",
      }}
      data-ocid="score-update-form"
    >
      <p className="text-xs font-bold text-primary mb-3 uppercase tracking-wide">
        Score Update (Demo)
      </p>

      <div className="grid grid-cols-3 gap-3 mb-3">
        <div className="space-y-1">
          <Label className="text-[10px] uppercase tracking-wide text-muted-foreground">
            {match.homeTeamEmoji} Home
          </Label>
          <Input
            type="number"
            min={0}
            value={home}
            onChange={(e) => setHome(e.target.value)}
            className="h-9 text-center font-black text-primary text-base"
            data-ocid="home-score-input"
          />
        </div>
        <div className="space-y-1">
          <Label className="text-[10px] uppercase tracking-wide text-muted-foreground">
            Minute
          </Label>
          <Input
            type="number"
            min={0}
            max={120}
            value={minute}
            onChange={(e) => setMinute(e.target.value)}
            placeholder="—"
            className="h-9 text-center font-semibold text-sm"
            data-ocid="minute-input"
          />
        </div>
        <div className="space-y-1">
          <Label className="text-[10px] uppercase tracking-wide text-muted-foreground">
            {match.awayTeamEmoji} Away
          </Label>
          <Input
            type="number"
            min={0}
            value={away}
            onChange={(e) => setAway(e.target.value)}
            className="h-9 text-center font-black text-primary text-base"
            data-ocid="away-score-input"
          />
        </div>
      </div>

      <div className="flex gap-2">
        <Button
          size="sm"
          variant="outline"
          className="flex-1 text-xs h-8"
          onClick={onClose}
          data-ocid="cancel-score-update"
        >
          Cancel
        </Button>
        <Button
          size="sm"
          className="flex-1 text-xs h-8 font-bold"
          onClick={handleSave}
          disabled={saved}
          data-ocid="save-score-update"
          style={{
            background: saved
              ? "oklch(var(--accent))"
              : "oklch(var(--primary))",
            color: "oklch(var(--primary-foreground))",
          }}
        >
          {saved ? "✓ Saved!" : "Update Score"}
        </Button>
      </div>
    </div>
  );
}

function MatchDetailPanel({
  match,
  onLoginRequired,
}: {
  match: Match;
  onLoginRequired: () => void;
}) {
  const isUpcoming = match.status === "upcoming";

  return (
    <div
      className="mt-3 rounded-xl border divide-y"
      style={{
        background: "oklch(var(--muted) / 0.3)",
        borderColor: "oklch(var(--border))",
      }}
      data-ocid="match-detail-panel"
    >
      {/* Match Info */}
      <div className="px-4 py-3 grid grid-cols-2 gap-y-2 gap-x-4 text-xs">
        <div>
          <span className="text-muted-foreground">Competition</span>
          <p className="font-semibold">{match.league}</p>
        </div>
        <div>
          <span className="text-muted-foreground">Venue</span>
          <p className="font-semibold">{match.venue || "Lamu County"}</p>
        </div>
        <div>
          <span className="text-muted-foreground">Date</span>
          <p className="font-semibold">
            {new Date(match.date).toLocaleDateString("en-KE", {
              weekday: "short",
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
        <div>
          <span className="text-muted-foreground">Status</span>
          <p className="font-semibold capitalize">
            {match.status}
            {match.minute ? ` — ${match.minute}'` : ""}
          </p>
        </div>
      </div>

      {/* Join section for upcoming matches */}
      {isUpcoming && (
        <div className="px-4 py-3 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-foreground">
              Attend this match?
            </p>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              {match.joiners.length > 0
                ? `${match.joiners.length} fan${match.joiners.length !== 1 ? "s" : ""} going`
                : "Be the first to join!"}
            </p>
          </div>
          <JoinMatchButton
            matchId={match.id}
            onLoginRequired={onLoginRequired}
          />
        </div>
      )}

      {/* Score Update Form (non-upcoming) */}
      {!isUpcoming && (
        <div className="px-4 pt-3 pb-4">
          <ScoreUpdateForm match={match} onClose={() => {}} />
        </div>
      )}
    </div>
  );
}

/* ─── Match Card ─────────────────────────────────────────────────────── */
function MatchCard({
  match,
  onLoginRequired,
}: {
  match: Match;
  onLoginRequired: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const isLive = match.status === "live";
  const isFinished = match.status === "finished";
  const isUpcoming = match.status === "upcoming";

  function handleShare(e: React.MouseEvent) {
    e.stopPropagation();
    const text = buildMatchShareText(match);
    shareContent(text, `${match.homeTeamName} vs ${match.awayTeamName}`);
  }

  return (
    <div
      className="rounded-2xl border mb-3 overflow-hidden transition-smooth"
      style={{
        background: "oklch(var(--card) / 0.85)",
        borderColor: isLive
          ? "oklch(var(--destructive) / 0.5)"
          : expanded
            ? "oklch(var(--primary) / 0.4)"
            : "oklch(var(--primary) / 0.15)",
        backdropFilter: "blur(12px)",
        boxShadow: isLive
          ? "0 0 20px oklch(var(--destructive) / 0.1)"
          : undefined,
      }}
      data-ocid="match-card"
    >
      {/* Clickable main area */}
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="w-full text-left px-4 pt-4 pb-3"
        aria-expanded={expanded}
        data-ocid="match-card-toggle"
      >
        {/* Header row */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            {isLive ? (
              <span
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold pulse-live"
                style={{
                  background: "oklch(var(--destructive))",
                  color: "white",
                }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse inline-block" />
                LIVE {match.minute}'
              </span>
            ) : isFinished ? (
              <span
                className="px-2.5 py-1 rounded-full text-[11px] font-semibold"
                style={{
                  background: "oklch(var(--muted))",
                  color: "oklch(var(--muted-foreground))",
                }}
              >
                FT
              </span>
            ) : (
              <span
                className="px-2.5 py-1 rounded-full text-[11px] font-semibold"
                style={{
                  background: "oklch(var(--secondary) / 0.2)",
                  color: "oklch(var(--secondary))",
                }}
              >
                {new Date(match.date).toLocaleDateString("en-KE", {
                  weekday: "short",
                  day: "numeric",
                  month: "short",
                })}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground truncate max-w-[100px]">
              {match.league}
            </span>
            <span className="text-muted-foreground">
              {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </span>
          </div>
        </div>

        {/* Teams + Score */}
        <div className="flex items-center">
          <div className="flex flex-col items-center gap-1.5 flex-1">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center text-2xl border"
              style={{
                background:
                  "linear-gradient(135deg, oklch(var(--primary) / 0.3), oklch(var(--secondary) / 0.2))",
                borderColor: "oklch(var(--primary) / 0.3)",
              }}
            >
              {match.homeTeamEmoji}
            </div>
            <span className="text-xs font-bold text-center leading-tight max-w-[80px]">
              {match.homeTeamName}
            </span>
          </div>

          <div className="flex flex-col items-center px-2 min-w-[80px]">
            {isUpcoming ? (
              <div className="flex flex-col items-center">
                <span className="font-display font-black text-2xl text-muted-foreground">
                  vs
                </span>
                <span className="text-[10px] text-muted-foreground mt-0.5">
                  {new Date(match.date).toLocaleTimeString("en-KE", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </span>
              </div>
            ) : (
              <span className="font-display font-black text-3xl text-primary">
                {match.homeScore} - {match.awayScore}
              </span>
            )}
          </div>

          <div className="flex flex-col items-center gap-1.5 flex-1">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center text-2xl border"
              style={{
                background:
                  "linear-gradient(135deg, oklch(var(--secondary) / 0.2), oklch(var(--primary) / 0.3))",
                borderColor: "oklch(var(--secondary) / 0.3)",
              }}
            >
              {match.awayTeamEmoji}
            </div>
            <span className="text-xs font-bold text-center leading-tight max-w-[80px]">
              {match.awayTeamName}
            </span>
          </div>
        </div>

        <p className="text-center text-[11px] text-muted-foreground mt-2">
          📍 {match.venue || "Lamu County"}
        </p>
      </button>

      {/* Bottom action bar — join + share, always visible */}
      <div
        className="px-4 pb-3 flex items-center justify-between border-t"
        style={{ borderColor: "oklch(var(--border) / 0.5)" }}
      >
        {isUpcoming ? (
          <>
            <span className="text-[11px] text-muted-foreground">
              {match.joiners.length > 0
                ? `${match.joiners.length} going`
                : "Be the first to join"}
            </span>
            <div className="flex items-center gap-2">
              <ShareButton onClick={handleShare} />
              <JoinMatchButton
                matchId={match.id}
                onLoginRequired={onLoginRequired}
              />
            </div>
          </>
        ) : (
          <>
            <span className="text-[11px] text-muted-foreground">
              {isLive ? `${match.minute}' — In progress` : "Full time"}
            </span>
            <ShareButton onClick={handleShare} />
          </>
        )}
      </div>

      {/* Expandable Detail Panel */}
      {expanded && (
        <div
          className="px-4 pb-4 border-t"
          style={{ borderColor: "oklch(var(--border))" }}
          data-ocid="match-expanded-detail"
        >
          <MatchDetailPanel match={match} onLoginRequired={onLoginRequired} />
        </div>
      )}
    </div>
  );
}

/* ─── Page ───────────────────────────────────────────────────────────── */
export default function Matches() {
  const [filter, setFilter] = useState<Filter>("all");
  const { data: matches, isLoading } = useMatches();
  const { login } = useInternetIdentity();

  const liveCount = matches?.filter((m) => m.status === "live").length ?? 0;
  const filtered =
    matches?.filter((m) => filter === "all" || m.status === filter) ?? [];

  function handleLoginRequired() {
    login();
  }

  return (
    <div className="px-4 py-4 max-w-xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h1 className="font-display font-black text-2xl">Matches</h1>
        {liveCount > 0 && (
          <span
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold pulse-live"
            style={{ background: "oklch(var(--destructive))", color: "white" }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            {liveCount} Live
          </span>
        )}
      </div>

      {/* Filter Tabs */}
      <div
        className="flex gap-2 mb-5 overflow-x-auto pb-1 scrollbar-hide"
        data-ocid="match-filters"
      >
        {FILTERS.map((f) => {
          const count =
            f.id === "all"
              ? (matches?.length ?? 0)
              : (matches?.filter((m) => m.status === f.id).length ?? 0);
          const isActive = filter === f.id;
          return (
            <button
              type="button"
              key={f.id}
              onClick={() => setFilter(f.id)}
              className="flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-smooth"
              style={{
                background: isActive
                  ? "oklch(var(--primary))"
                  : "oklch(var(--card) / 0.8)",
                color: isActive
                  ? "oklch(var(--primary-foreground))"
                  : "oklch(var(--foreground))",
                borderWidth: "1px",
                borderStyle: "solid",
                borderColor: isActive ? "transparent" : "oklch(var(--border))",
                backdropFilter: "blur(8px)",
              }}
              data-ocid={`filter-${f.id}`}
            >
              <span>{f.emoji}</span>
              <span>{f.label}</span>
              {count > 0 && (
                <span
                  className="text-[10px] font-bold px-1.5 py-0.5 rounded-full ml-0.5"
                  style={{
                    background: isActive
                      ? "rgba(255,255,255,0.2)"
                      : "oklch(var(--muted))",
                    color: isActive
                      ? "white"
                      : "oklch(var(--muted-foreground))",
                  }}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-44 rounded-2xl" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div
          className="rounded-2xl p-8 text-center border"
          style={{
            background: "oklch(var(--card) / 0.7)",
            borderColor: "oklch(var(--border))",
          }}
          data-ocid="matches-empty"
        >
          <span className="text-4xl block mb-2">📅</span>
          <p className="font-semibold mb-1">No matches found</p>
          <p className="text-sm text-muted-foreground">
            Try a different filter
          </p>
        </div>
      ) : (
        <div data-ocid="matches-list">
          {filtered.map((match) => (
            <MatchCard
              key={match.id}
              match={match}
              onLoginRequired={handleLoginRequired}
            />
          ))}
        </div>
      )}
    </div>
  );
}
