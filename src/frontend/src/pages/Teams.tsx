import { Skeleton } from "@/components/ui/skeleton";
import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import {
  useFollowTeam,
  useMatches,
  usePlayers,
  useSetFavouriteTeam,
  useTeams,
  useUnfollowTeam,
  useUserProfile,
} from "../hooks/use-backend";
import type { Match, Player, Team } from "../types";

// ─── MatchPill ────────────────────────────────────────────────────────────────

function MatchPill({ match, teamId }: { match: Match; teamId: string }) {
  const isHome = match.homeTeamId === teamId;
  const teamScore = isHome ? match.homeScore : match.awayScore;
  const oppScore = isHome ? match.awayScore : match.homeScore;
  const oppName = isHome ? match.awayTeamName : match.homeTeamName;
  const oppEmoji = isHome ? match.awayTeamEmoji : match.homeTeamEmoji;

  let resultColor = "text-muted-foreground";
  let resultLabel = "U";
  if (match.status === "finished") {
    if (teamScore > oppScore) {
      resultColor = "text-[oklch(0.52_0.18_142)]";
      resultLabel = "W";
    } else if (teamScore < oppScore) {
      resultColor = "text-destructive";
      resultLabel = "L";
    } else {
      resultColor = "text-[oklch(0.65_0.19_73)]";
      resultLabel = "D";
    }
  } else if (match.status === "live") {
    resultColor = "text-destructive";
    resultLabel = "LIVE";
  } else {
    resultLabel = "vs";
  }

  return (
    <div
      className="flex items-center justify-between rounded-xl px-3 py-2.5"
      style={{ background: "oklch(var(--muted) / 0.35)" }}
    >
      <div className="flex items-center gap-2 min-w-0">
        <span className="text-xl">{oppEmoji}</span>
        <span className="text-xs font-semibold truncate max-w-[90px]">
          {oppName}
        </span>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        {match.status !== "upcoming" && (
          <span className="text-sm font-black text-primary">
            {teamScore} – {oppScore}
          </span>
        )}
        <span
          className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${resultColor}`}
          style={{ background: "oklch(var(--card) / 0.6)" }}
        >
          {resultLabel}
        </span>
      </div>
    </div>
  );
}

// ─── TeamDetailPanel ─────────────────────────────────────────────────────────

function TeamDetailPanel({
  team,
  players,
  matches,
}: {
  team: Team;
  players: Player[];
  matches: Match[];
}) {
  const points = team.wins * 3 + team.draws;

  const topScorers = [...players]
    .filter((p) => p.teamId === team.id)
    .sort((a, b) => b.goals - a.goals)
    .slice(0, 3);

  const teamMatches = matches
    .filter((m) => m.homeTeamId === team.id || m.awayTeamId === team.id)
    .slice(0, 3);

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.28, ease: "easeInOut" }}
      className="overflow-hidden"
    >
      <div
        className="mt-0 rounded-b-2xl border-t-0 border px-4 pt-4 pb-4 space-y-4"
        style={{
          background: "oklch(var(--card) / 0.92)",
          borderColor: "oklch(var(--primary) / 0.25)",
          backdropFilter: "blur(16px)",
        }}
        data-ocid="team-detail-panel"
      >
        {/* Record row */}
        <div className="grid grid-cols-4 gap-2">
          {[
            { label: "Points", value: points, highlight: true },
            { label: "Wins", value: team.wins },
            { label: "Draws", value: team.draws },
            { label: "Losses", value: team.losses },
          ].map(({ label, value, highlight }) => (
            <div
              key={label}
              className="flex flex-col items-center rounded-xl py-2"
              style={{ background: "oklch(var(--muted) / 0.4)" }}
            >
              <span
                className={`text-lg font-black ${highlight ? "text-primary" : "text-foreground"}`}
              >
                {value}
              </span>
              <span className="text-[9px] font-bold text-muted-foreground uppercase">
                {label}
              </span>
            </div>
          ))}
        </div>

        {/* Top Scorers */}
        {topScorers.length > 0 && (
          <div>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">
              ⚽ Top Scorers
            </p>
            <div className="space-y-1.5">
              {topScorers.map((p, i) => (
                <div
                  key={p.id}
                  className="flex items-center gap-3 rounded-xl px-3 py-2"
                  style={{ background: "oklch(var(--muted) / 0.35)" }}
                >
                  <span className="text-base font-black text-primary w-5 text-center">
                    {i + 1}
                  </span>
                  <span className="text-base">{p.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold truncate">{p.name}</p>
                    <p className="text-[10px] text-muted-foreground">
                      {p.position} · #{p.jerseyNumber}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className="text-base font-black text-primary">
                      {p.goals}
                    </span>
                    <span className="text-[10px] text-muted-foreground block">
                      goals
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Matches */}
        {teamMatches.length > 0 && (
          <div>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">
              🗓️ Recent Matches
            </p>
            <div className="space-y-1.5">
              {teamMatches.map((m) => (
                <MatchPill key={m.id} match={m} teamId={team.id} />
              ))}
            </div>
          </div>
        )}

        {/* Stadium & Coach */}
        <div
          className="flex items-center justify-between rounded-xl px-3 py-2"
          style={{ background: "oklch(var(--muted) / 0.35)" }}
        >
          <span className="text-xs text-muted-foreground">
            🏟️{" "}
            <span className="font-semibold text-foreground">
              {team.stadium}
            </span>
          </span>
          <span className="text-xs text-muted-foreground">
            👤{" "}
            <span className="font-semibold text-foreground">{team.coach}</span>
          </span>
        </div>
      </div>
    </motion.div>
  );
}

// ─── TeamListItem ─────────────────────────────────────────────────────────────

function TeamListItem({
  team,
  isExpanded,
  onToggle,
  players,
  matches,
  isFavourite,
  isFollowing,
  onFavouriteToggle,
  onFollowToggle,
}: {
  team: Team;
  isExpanded: boolean;
  onToggle: () => void;
  players: Player[];
  matches: Match[];
  isFavourite: boolean;
  isFollowing: boolean;
  onFavouriteToggle: (teamId: string) => void;
  onFollowToggle: (teamId: string) => void;
}) {
  const points = team.wins * 3 + team.draws;

  return (
    <div className="mb-3" data-ocid="team-list-item">
      {/* List row */}
      <motion.div
        className="flex items-center gap-3 px-3 py-3 cursor-pointer border transition-colors duration-200"
        style={{
          background: "oklch(var(--card) / 0.85)",
          borderColor: isExpanded
            ? "oklch(var(--primary) / 0.5)"
            : "oklch(var(--primary) / 0.15)",
          backdropFilter: "blur(12px)",
          borderRadius: isExpanded ? "1rem 1rem 0 0" : "1rem",
        }}
        onClick={onToggle}
        whileTap={{ scale: 0.985 }}
      >
        {/* Emoji logo */}
        <div
          className="w-[46px] h-[46px] rounded-full flex items-center justify-center text-2xl flex-shrink-0"
          style={{
            background:
              "linear-gradient(135deg, oklch(var(--primary) / 0.35), oklch(var(--secondary) / 0.3))",
            boxShadow: "0 4px 12px oklch(var(--primary) / 0.2)",
          }}
        >
          {team.emoji}
        </div>

        {/* Team info */}
        <div className="flex-1 min-w-0">
          <p className="font-bold text-sm text-foreground truncate">
            {team.name}
          </p>
          <p className="text-[11px] text-muted-foreground font-mono">
            {team.shortName}
          </p>
          <p className="text-[10px] text-muted-foreground mt-0.5">
            <span
              className="font-semibold"
              style={{ color: "oklch(0.52 0.18 142)" }}
            >
              {team.wins}W
            </span>
            {" · "}
            <span
              className="font-semibold"
              style={{ color: "oklch(0.65 0.19 73)" }}
            >
              {team.draws}D
            </span>
            {" · "}
            <span className="font-semibold text-destructive">
              {team.losses}L
            </span>
          </p>
        </div>

        {/* Points */}
        <div className="text-right flex-shrink-0 mr-1">
          <div className="text-xl font-black text-primary">{points}</div>
          <div className="text-[9px] text-muted-foreground font-bold uppercase">
            Pts
          </div>
        </div>

        {/* Action buttons — stop propagation so they don't toggle expand */}
        {/* biome-ignore lint/a11y/useKeyWithClickEvents: buttons inside handle keyboard */}
        <div
          className="flex items-center gap-1.5 flex-shrink-0"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Favourite (heart) */}
          <button
            type="button"
            aria-label={
              isFavourite ? "Remove from favourites" : "Set as favourite team"
            }
            className="w-8 h-8 rounded-full flex items-center justify-center transition-smooth border text-base"
            style={{
              background: isFavourite
                ? "oklch(var(--destructive) / 0.18)"
                : "oklch(var(--card) / 0.8)",
              borderColor: isFavourite
                ? "oklch(var(--destructive) / 0.45)"
                : "oklch(var(--primary) / 0.2)",
            }}
            onClick={() => onFavouriteToggle(team.id)}
            data-ocid="team-favourite-btn"
          >
            {isFavourite ? "❤️" : "🤍"}
          </button>

          {/* Follow (star) */}
          <button
            type="button"
            aria-label={isFollowing ? "Unfollow team" : "Follow team"}
            className="w-8 h-8 rounded-full flex items-center justify-center transition-smooth border text-base"
            style={{
              background: isFollowing
                ? "oklch(var(--primary) / 0.18)"
                : "oklch(var(--card) / 0.8)",
              borderColor: isFollowing
                ? "oklch(var(--primary) / 0.45)"
                : "oklch(var(--primary) / 0.2)",
            }}
            onClick={() => onFollowToggle(team.id)}
            data-ocid="team-follow-btn"
          >
            {isFollowing ? "⭐" : "☆"}
          </button>

          {/* Expand chevron */}
          <motion.span
            className="text-muted-foreground text-sm w-5 text-center"
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            ▼
          </motion.span>
        </div>
      </motion.div>

      {/* Expandable detail */}
      <AnimatePresence>
        {isExpanded && (
          <TeamDetailPanel team={team} players={players} matches={matches} />
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Teams Page ───────────────────────────────────────────────────────────────

export default function Teams() {
  const { data: teams = [], isLoading: teamsLoading } = useTeams();
  const { data: players = [] } = usePlayers();
  const { data: matches = [] } = useMatches();
  const { data: profile } = useUserProfile();
  const { mutate: setFavouriteTeam } = useSetFavouriteTeam();
  const { mutate: followTeam } = useFollowTeam();
  const { mutate: unfollowTeam } = useUnfollowTeam();
  const { loginStatus, identity } = useInternetIdentity();
  const isLoggedIn = loginStatus === "success" && !!identity;

  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const favouriteTeamId =
    profile?.favouriteTeamId != null ? String(profile.favouriteTeamId) : null;
  const followedIds = new Set((profile?.followedTeamIds ?? []).map(String));

  const filtered = teams.filter(
    (t) =>
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.shortName.toLowerCase().includes(search.toLowerCase()) ||
      t.location.toLowerCase().includes(search.toLowerCase()),
  );

  const handleToggle = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  function handleFavouriteToggle(teamId: string) {
    if (!isLoggedIn) {
      toast.error("Login to set a favourite team");
      return;
    }
    setFavouriteTeam(teamId);
  }

  function handleFollowToggle(teamId: string) {
    if (!isLoggedIn) {
      toast.error("Login to follow teams");
      return;
    }
    if (followedIds.has(teamId)) {
      unfollowTeam(teamId);
    } else {
      followTeam(teamId);
    }
  }

  return (
    <div className="px-4 py-4 max-w-xl mx-auto">
      <h1 className="font-display font-black text-2xl mb-1 text-foreground">
        Teams
      </h1>
      <p className="text-xs text-muted-foreground mb-4">
        FKF Lamu County League · {teams.length} clubs
      </p>

      {/* Search */}
      <div className="relative mb-5">
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
          🔍
        </span>
        <input
          type="text"
          placeholder="Search teams by name or location…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 rounded-xl border text-sm font-body outline-none transition-colors duration-200"
          style={{
            background: "oklch(var(--card) / 0.85)",
            borderColor: search
              ? "oklch(var(--primary) / 0.5)"
              : "oklch(var(--border))",
            color: "oklch(var(--foreground))",
            backdropFilter: "blur(8px)",
          }}
          data-ocid="teams-search"
        />
        {search && (
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground text-lg"
            onClick={() => setSearch("")}
            aria-label="Clear search"
          >
            ×
          </button>
        )}
      </div>

      {/* Legend hint */}
      {isLoggedIn && (
        <div
          className="flex items-center gap-3 mb-4 px-3 py-2 rounded-xl border text-[11px] text-muted-foreground"
          style={{
            background: "oklch(var(--primary) / 0.05)",
            borderColor: "oklch(var(--primary) / 0.15)",
          }}
        >
          <span>❤️ Favourite (one team)</span>
          <span className="text-border">·</span>
          <span>⭐ Follow (multiple)</span>
        </div>
      )}

      {/* List */}
      {teamsLoading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-[72px] rounded-2xl" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div
          className="rounded-2xl p-10 text-center border"
          style={{
            background: "oklch(var(--card) / 0.7)",
            borderColor: "oklch(var(--border))",
          }}
          data-ocid="teams-empty"
        >
          <span className="text-5xl block mb-3">👥</span>
          <p className="font-bold text-base mb-1">No teams found</p>
          <p className="text-sm text-muted-foreground">
            Try a different name or clear your search
          </p>
        </div>
      ) : (
        <div>
          {filtered.map((team) => (
            <TeamListItem
              key={team.id}
              team={team}
              isExpanded={expandedId === team.id}
              onToggle={() => handleToggle(team.id)}
              players={players}
              matches={matches}
              isFavourite={favouriteTeamId === team.id}
              isFollowing={followedIds.has(team.id)}
              onFavouriteToggle={handleFavouriteToggle}
              onFollowToggle={handleFollowToggle}
            />
          ))}
        </div>
      )}
    </div>
  );
}
