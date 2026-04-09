import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import { useState } from "react";
import { toast } from "sonner";
import {
  useFollowPlayer,
  usePlayers,
  useUnfollowPlayer,
  useUserProfile,
} from "../hooks/use-backend";
import type { Player } from "../types";

// ─── Constants ───────────────────────────────────────────────────────────────

const POSITIONS = [
  "All",
  "Forward",
  "Midfielder",
  "Defender",
  "Goalkeeper",
] as const;

const POSITION_GRADIENT: Record<string, string> = {
  Forward:
    "linear-gradient(135deg, oklch(var(--primary)), oklch(var(--destructive)))",
  Midfielder:
    "linear-gradient(135deg, oklch(var(--secondary)), oklch(0.45 0.22 280))",
  Defender:
    "linear-gradient(135deg, oklch(0.52 0.18 142), oklch(0.45 0.16 175))",
  Goalkeeper:
    "linear-gradient(135deg, oklch(0.65 0.19 73), oklch(var(--primary)))",
};

const POSITION_BADGE: Record<
  string,
  { bg: string; color: string; border: string }
> = {
  Forward: {
    bg: "oklch(var(--primary) / 0.18)",
    color: "oklch(var(--primary))",
    border: "oklch(var(--primary) / 0.35)",
  },
  Midfielder: {
    bg: "oklch(var(--secondary) / 0.18)",
    color: "oklch(var(--secondary))",
    border: "oklch(var(--secondary) / 0.35)",
  },
  Defender: {
    bg: "oklch(0.52 0.18 142 / 0.18)",
    color: "oklch(0.52 0.18 142)",
    border: "oklch(0.52 0.18 142 / 0.35)",
  },
  Goalkeeper: {
    bg: "oklch(0.65 0.19 73 / 0.18)",
    color: "oklch(0.65 0.19 73)",
    border: "oklch(0.65 0.19 73 / 0.35)",
  },
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function TopScorerChip({ player, rank }: { player: Player; rank: number }) {
  const grad =
    POSITION_GRADIENT[player.position] ??
    "linear-gradient(135deg, oklch(var(--primary)), oklch(var(--primary) / 0.7))";

  return (
    <div
      className="flex-shrink-0 flex flex-col items-center gap-1.5 p-3 rounded-2xl border transition-smooth cursor-default"
      style={{
        background: "oklch(var(--card) / 0.80)",
        borderColor:
          rank === 1
            ? "oklch(var(--primary) / 0.5)"
            : "oklch(var(--primary) / 0.18)",
        minWidth: 88,
        backdropFilter: "blur(12px)",
      }}
      data-ocid={`top-scorer-${rank}`}
    >
      <div className="relative">
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center text-2xl border-2"
          style={{
            background: grad,
            borderColor: "oklch(var(--foreground) / 0.15)",
          }}
        >
          {player.emoji}
        </div>
        {rank === 1 ? (
          <span className="absolute -top-1.5 -right-1.5 text-base leading-none">
            🏆
          </span>
        ) : (
          <span
            className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center font-black text-[10px]"
            style={{
              background: "oklch(var(--primary) / 0.9)",
              color: "oklch(var(--primary-foreground))",
            }}
          >
            {rank}
          </span>
        )}
      </div>
      <p className="font-bold text-xs text-center leading-tight max-w-[76px] truncate text-foreground">
        {player.name.split(" ")[0]}
      </p>
      <div className="flex items-center gap-1 font-black text-sm text-primary">
        <span>⚽</span>
        <span>{player.goals}</span>
      </div>
    </div>
  );
}

function PlayerCard({
  player,
  isFollowing,
  onFollowToggle,
}: {
  player: Player;
  isFollowing: boolean;
  onFollowToggle: (playerId: string) => void;
}) {
  const grad =
    POSITION_GRADIENT[player.position] ??
    "linear-gradient(135deg, oklch(var(--muted)), oklch(var(--muted) / 0.7))";
  const badgeStyle = POSITION_BADGE[player.position] ?? {
    bg: "oklch(var(--muted) / 0.18)",
    color: "oklch(var(--muted-foreground))",
    border: "oklch(var(--muted) / 0.35)",
  };

  return (
    <div
      className="rounded-2xl p-4 border transition-smooth group cursor-default relative"
      style={{
        background: "oklch(var(--card) / 0.80)",
        borderColor: "oklch(var(--primary) / 0.15)",
        backdropFilter: "blur(12px)",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.borderColor =
          "oklch(var(--primary) / 0.55)";
        (e.currentTarget as HTMLDivElement).style.transform =
          "translateY(-3px)";
        (e.currentTarget as HTMLDivElement).style.boxShadow =
          "0 12px 28px oklch(var(--primary) / 0.18)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.borderColor =
          "oklch(var(--primary) / 0.15)";
        (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
        (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
      }}
      data-ocid="player-card"
    >
      {/* Follow button */}
      <button
        type="button"
        aria-label={isFollowing ? "Unfollow player" : "Follow player"}
        className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full flex items-center justify-center transition-smooth border z-10"
        style={{
          background: isFollowing
            ? "oklch(var(--primary) / 0.22)"
            : "oklch(var(--card) / 0.9)",
          borderColor: isFollowing
            ? "oklch(var(--primary) / 0.5)"
            : "oklch(var(--primary) / 0.2)",
          fontSize: 14,
        }}
        onClick={(e) => {
          e.stopPropagation();
          onFollowToggle(player.id);
        }}
        data-ocid="player-follow-btn"
      >
        {isFollowing ? "⭐" : "☆"}
      </button>

      {/* Avatar + jersey */}
      <div className="flex flex-col items-center mb-3 relative">
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center text-3xl mb-2 border-2"
          style={{
            background: grad,
            borderColor: "oklch(var(--foreground) / 0.12)",
            boxShadow: "0 6px 20px oklch(var(--background) / 0.35)",
          }}
        >
          {player.emoji}
        </div>
        <span
          className="absolute top-0 left-0 font-black text-xs px-1.5 py-0.5 rounded-full"
          style={{
            background: "oklch(var(--primary) / 0.18)",
            color: "oklch(var(--primary))",
          }}
        >
          #{player.jerseyNumber}
        </span>
      </div>

      {/* Name + team */}
      <p className="font-display font-bold text-sm text-center leading-tight text-foreground truncate mb-0.5">
        {player.name}
      </p>
      <p className="text-[11px] text-muted-foreground text-center truncate mb-2">
        {player.teamName}
      </p>

      {/* Position badge */}
      <div className="flex justify-center mb-3">
        <Badge
          className="text-[10px] font-bold px-2 py-0.5 rounded-full border"
          style={{
            background: badgeStyle.bg,
            color: badgeStyle.color,
            borderColor: badgeStyle.border,
          }}
        >
          {player.position}
        </Badge>
      </div>

      {/* Stats row */}
      <div
        className="grid grid-cols-3 divide-x rounded-xl overflow-hidden"
        style={{
          background: "oklch(var(--background) / 0.6)",
          borderColor: "oklch(var(--primary) / 0.1)",
        }}
      >
        {[
          { icon: "⚽", label: "Goals", value: player.goals },
          { icon: "🎯", label: "Assists", value: player.assists },
          { icon: "🟨", label: "Cards", value: player.yellowCards },
        ].map(({ icon, label, value }) => (
          <div key={label} className="flex flex-col items-center py-2">
            <span className="font-black text-lg leading-none mb-0.5 text-primary">
              {value}
            </span>
            <span className="text-[9px] text-muted-foreground font-semibold uppercase tracking-wide">
              {icon} {label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Registered Players Section ───────────────────────────────────────────────

type RegFilter = "all" | "registered" | "pending";

function RegisteredPlayers({ players }: { players: Player[] }) {
  const [regFilter, setRegFilter] = useState<RegFilter>("all");
  const [teamFilter, setTeamFilter] = useState<string>("All");

  // Derive unique teams from player list
  const teams = Array.from(new Set(players.map((p) => p.teamName))).sort();

  // Simulate registration status deterministically from player id
  const getStatus = (p: Player): "registered" | "pending" => {
    const numId = Number(p.id.replace(/\D/g, "") || 0);
    return numId % 3 === 0 ? "pending" : "registered";
  };

  const filtered = players.filter((p) => {
    const status = getStatus(p);
    const matchesStatus = regFilter === "all" || status === regFilter;
    const matchesTeam = teamFilter === "All" || p.teamName === teamFilter;
    return matchesStatus && matchesTeam;
  });

  return (
    <div className="mt-8">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-base">📋</span>
        <h2 className="font-display font-bold text-base text-foreground">
          Registered Players
        </h2>
        <span
          className="ml-auto text-xs font-bold px-2 py-0.5 rounded-full"
          style={{
            background: "oklch(var(--primary) / 0.15)",
            color: "oklch(var(--primary))",
          }}
        >
          {players.length} total
        </span>
      </div>

      {/* Filters row */}
      <div className="flex gap-2 mb-3 flex-wrap">
        {(["all", "registered", "pending"] as RegFilter[]).map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setRegFilter(f)}
            className="flex-shrink-0 px-3 py-1 rounded-full text-xs font-bold transition-smooth border capitalize"
            style={{
              background:
                regFilter === f
                  ? "oklch(var(--primary))"
                  : "oklch(var(--card) / 0.7)",
              color:
                regFilter === f
                  ? "oklch(var(--primary-foreground))"
                  : "oklch(var(--muted-foreground))",
              borderColor:
                regFilter === f
                  ? "oklch(var(--primary))"
                  : "oklch(var(--primary) / 0.15)",
            }}
            data-ocid={`reg-filter-${f}`}
          >
            {f === "all" ? "All" : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}

        <select
          value={teamFilter}
          onChange={(e) => setTeamFilter(e.target.value)}
          className="ml-auto px-3 py-1 rounded-full text-xs font-bold border outline-none"
          style={{
            background: "oklch(var(--card) / 0.85)",
            color: "oklch(var(--muted-foreground))",
            borderColor: "oklch(var(--primary) / 0.2)",
          }}
          data-ocid="reg-team-filter"
        >
          <option value="All">All Teams</option>
          {teams.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      {/* Player list */}
      <div className="space-y-2" data-ocid="registered-players-list">
        {filtered.length === 0 ? (
          <div
            className="rounded-2xl p-8 text-center border"
            style={{
              background: "oklch(var(--card) / 0.7)",
              borderColor: "oklch(var(--primary) / 0.12)",
            }}
          >
            <p className="text-sm text-muted-foreground">
              No players match the filter
            </p>
          </div>
        ) : (
          filtered.map((player) => {
            const status = getStatus(player);
            return (
              <div
                key={player.id}
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 border"
                style={{
                  background: "oklch(var(--card) / 0.75)",
                  borderColor: "oklch(var(--primary) / 0.1)",
                }}
                data-ocid="reg-player-row"
              >
                {/* Avatar */}
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-base flex-shrink-0 border"
                  style={{
                    background:
                      POSITION_GRADIENT[player.position] ??
                      "linear-gradient(135deg, oklch(var(--muted)), oklch(var(--muted) / 0.7))",
                    borderColor: "oklch(var(--foreground) / 0.1)",
                  }}
                >
                  {player.emoji}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold truncate text-foreground">
                    {player.name}
                  </p>
                  <p className="text-[11px] text-muted-foreground truncate">
                    {player.teamName} · {player.position}
                  </p>
                </div>

                {/* Status badge */}
                <span
                  className="flex-shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full border"
                  style={
                    status === "registered"
                      ? {
                          background: "oklch(0.52 0.18 142 / 0.15)",
                          color: "oklch(0.52 0.18 142)",
                          borderColor: "oklch(0.52 0.18 142 / 0.3)",
                        }
                      : {
                          background: "oklch(0.65 0.19 73 / 0.15)",
                          color: "oklch(0.65 0.19 73)",
                          borderColor: "oklch(0.65 0.19 73 / 0.3)",
                        }
                  }
                  data-ocid={`reg-status-${status}`}
                >
                  {status === "registered" ? "✓ Registered" : "⏳ Pending"}
                </span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

// ─── Skeleton loader ──────────────────────────────────────────────────────────

function CardSkeleton() {
  return (
    <div
      className="rounded-2xl p-4 border"
      style={{
        background: "oklch(var(--card) / 0.80)",
        borderColor: "oklch(var(--primary) / 0.1)",
      }}
    >
      <div className="flex flex-col items-center gap-2 mb-3">
        <Skeleton className="w-20 h-20 rounded-full" />
        <Skeleton className="h-3 w-24 rounded" />
        <Skeleton className="h-3 w-16 rounded" />
      </div>
      <Skeleton className="h-10 rounded-xl" />
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function Players() {
  const { data: backendPlayers, isLoading } = usePlayers();
  const { data: profile } = useUserProfile();
  const { mutate: followPlayer } = useFollowPlayer();
  const { mutate: unfollowPlayer } = useUnfollowPlayer();
  const { loginStatus, identity } = useInternetIdentity();
  const isLoggedIn = loginStatus === "success" && !!identity;

  const [posFilter, setPosFilter] = useState<string>("All");

  const players = backendPlayers ?? [];
  const followedIds = new Set((profile?.followedPlayerIds ?? []).map(String));

  const filtered =
    posFilter === "All"
      ? players
      : players.filter((p) => p.position === posFilter);

  const topScorers = [...players].sort((a, b) => b.goals - a.goals).slice(0, 5);

  function handleFollowToggle(playerId: string) {
    if (!isLoggedIn) {
      toast.error("Login to follow players");
      return;
    }
    if (followedIds.has(playerId)) {
      unfollowPlayer(playerId);
    } else {
      followPlayer(playerId);
    }
  }

  return (
    <div className="px-4 py-4 max-w-2xl mx-auto">
      {/* Page heading */}
      <h1 className="font-display font-black text-2xl mb-4 text-foreground">
        Players
      </h1>

      {/* ── Top Scorers Scroll Row ───────────────────────────────────────── */}
      <div className="mb-5">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-base">🏆</span>
          <span className="font-display font-bold text-sm text-foreground">
            Top Scorers
          </span>
        </div>
        {isLoading ? (
          <div className="flex gap-3 overflow-x-auto pb-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton
                key={i}
                className="flex-shrink-0 w-[88px] h-[120px] rounded-2xl"
              />
            ))}
          </div>
        ) : (
          <div
            className="flex gap-3 overflow-x-auto pb-2"
            style={{ scrollbarWidth: "none" }}
            data-ocid="top-scorers-row"
          >
            {topScorers.map((player, i) => (
              <TopScorerChip key={player.id} player={player} rank={i + 1} />
            ))}
          </div>
        )}
      </div>

      {/* ── Position Filter Tabs ─────────────────────────────────────────── */}
      <div
        className="flex gap-2 mb-5 overflow-x-auto pb-1"
        style={{ scrollbarWidth: "none" }}
        data-ocid="position-filter"
      >
        {POSITIONS.map((pos) => {
          const isActive = posFilter === pos;
          return (
            <button
              key={pos}
              type="button"
              onClick={() => setPosFilter(pos)}
              className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-bold transition-smooth border"
              style={{
                background: isActive
                  ? "oklch(var(--primary))"
                  : "oklch(var(--card) / 0.7)",
                color: isActive
                  ? "oklch(var(--primary-foreground))"
                  : "oklch(var(--muted-foreground))",
                borderColor: isActive
                  ? "oklch(var(--primary))"
                  : "oklch(var(--primary) / 0.15)",
                boxShadow: isActive
                  ? "0 4px 14px oklch(var(--primary) / 0.35)"
                  : "none",
              }}
              data-ocid={`pos-filter-${pos.toLowerCase()}`}
            >
              {pos}
            </button>
          );
        })}
      </div>

      {/* ── Player Grid ─────────────────────────────────────────────────── */}
      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div
          className="rounded-2xl p-10 text-center border"
          style={{
            background: "oklch(var(--card) / 0.7)",
            borderColor: "oklch(var(--primary) / 0.15)",
          }}
          data-ocid="players-empty"
        >
          <span className="text-5xl block mb-3">👤</span>
          <p className="font-display font-bold mb-1 text-foreground">
            No players found
          </p>
          <p className="text-sm text-muted-foreground">
            Try a different position filter
          </p>
        </div>
      ) : (
        <div
          className="grid grid-cols-2 md:grid-cols-3 gap-3"
          data-ocid="players-grid"
        >
          {filtered.map((player) => (
            <PlayerCard
              key={player.id}
              player={player}
              isFollowing={followedIds.has(player.id)}
              onFollowToggle={handleFollowToggle}
            />
          ))}
        </div>
      )}

      {/* ── Registered Players Section ───────────────────────────────────── */}
      {!isLoading && players.length > 0 && (
        <RegisteredPlayers players={players} />
      )}
    </div>
  );
}
