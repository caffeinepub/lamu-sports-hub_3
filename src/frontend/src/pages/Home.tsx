import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  CheckCircle2,
  ChevronRight,
  Newspaper,
  RefreshCw,
  Users,
  Zap,
} from "lucide-react";
import { useMatches, useNews, useTeams } from "../hooks/use-backend";
import type { Match, NewsArticle, TabId } from "../types";

/* ─── Sub-components ─────────────────────────────────────────────────── */

function QuickStat({
  icon,
  label,
  value,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  accent?: boolean;
}) {
  return (
    <div
      className="flex flex-col items-center gap-1 flex-1 py-3 rounded-xl border transition-smooth"
      style={{
        background: accent
          ? "oklch(var(--destructive) / 0.12)"
          : "oklch(var(--card) / 0.8)",
        borderColor: accent
          ? "oklch(var(--destructive) / 0.4)"
          : "oklch(var(--primary) / 0.15)",
        backdropFilter: "blur(10px)",
      }}
      data-ocid="quick-stat"
    >
      <div className={accent ? "text-destructive" : "text-primary"}>{icon}</div>
      <span
        className={`text-xl font-black ${accent ? "text-destructive" : "text-primary"}`}
      >
        {value}
      </span>
      <span className="text-[10px] text-muted-foreground font-medium text-center leading-tight">
        {label}
      </span>
    </div>
  );
}

function FeaturedLiveCard({
  match,
  onViewStats,
}: {
  match: Match;
  onViewStats: () => void;
}) {
  return (
    <div
      className="rounded-2xl border overflow-hidden transition-smooth"
      style={{
        background: "oklch(var(--card) / 0.85)",
        borderColor: "oklch(var(--destructive) / 0.45)",
        backdropFilter: "blur(14px)",
        boxShadow: "0 0 30px oklch(var(--destructive) / 0.15)",
      }}
      data-ocid="featured-live-card"
    >
      {/* Card header */}
      <div
        className="flex items-center justify-between px-4 py-2.5 border-b"
        style={{
          borderColor: "oklch(var(--destructive) / 0.25)",
          background: "oklch(var(--destructive) / 0.08)",
        }}
      >
        <span
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold pulse-live"
          style={{ background: "oklch(var(--destructive))", color: "white" }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse inline-block" />
          LIVE {match.minute}'
        </span>
        <span className="text-xs text-muted-foreground">{match.league}</span>
        <span className="text-base">⚽</span>
      </div>

      {/* Teams + Score */}
      <div className="flex items-center px-4 py-5">
        <div className="flex flex-col items-center gap-2 flex-1">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center text-3xl border-2"
            style={{
              background:
                "linear-gradient(135deg, oklch(var(--primary) / 0.35), oklch(var(--secondary) / 0.25))",
              borderColor: "oklch(var(--primary) / 0.4)",
            }}
          >
            {match.homeTeamEmoji}
          </div>
          <span className="text-sm font-bold text-center leading-tight max-w-[90px]">
            {match.homeTeamName}
          </span>
        </div>

        <div className="flex flex-col items-center px-2 min-w-[90px]">
          <span className="font-display font-black text-4xl text-primary leading-none">
            {match.homeScore} - {match.awayScore}
          </span>
          <span className="text-xs text-muted-foreground mt-1">
            FKF Lamu League
          </span>
        </div>

        <div className="flex flex-col items-center gap-2 flex-1">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center text-3xl border-2"
            style={{
              background:
                "linear-gradient(135deg, oklch(var(--secondary) / 0.25), oklch(var(--primary) / 0.35))",
              borderColor: "oklch(var(--secondary) / 0.4)",
            }}
          >
            {match.awayTeamEmoji}
          </div>
          <span className="text-sm font-bold text-center leading-tight max-w-[90px]">
            {match.awayTeamName}
          </span>
        </div>
      </div>

      <div className="text-center text-xs text-muted-foreground pb-2">
        📍 {match.venue}
      </div>

      <div className="px-4 pb-4">
        <button
          type="button"
          className="w-full py-3 rounded-xl font-bold text-sm tracking-wide transition-smooth"
          style={{
            background: "oklch(var(--primary))",
            color: "oklch(var(--primary-foreground))",
          }}
          data-ocid="view-live-stats-featured"
          onClick={onViewStats}
        >
          VIEW LIVE STATS
        </button>
      </div>
    </div>
  );
}

function RecentMatchCard({ match }: { match: Match }) {
  return (
    <div
      className="rounded-xl p-3 border transition-smooth"
      style={{
        background: "oklch(var(--card) / 0.8)",
        borderColor: "oklch(var(--primary) / 0.12)",
        backdropFilter: "blur(10px)",
      }}
      data-ocid="recent-match-card"
    >
      <div className="flex items-center justify-between mb-2">
        <span
          className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
          style={{
            background: "oklch(var(--muted))",
            color: "oklch(var(--muted-foreground))",
          }}
        >
          FT
        </span>
        <span className="text-[10px] text-muted-foreground">
          {new Date(match.date).toLocaleDateString("en-KE", {
            day: "numeric",
            month: "short",
          })}
        </span>
      </div>

      <div className="flex items-center justify-between gap-1">
        <div className="flex flex-col items-center gap-1 flex-1">
          <span className="text-xl">{match.homeTeamEmoji}</span>
          <span className="text-[10px] font-semibold text-center leading-tight truncate w-full text-center">
            {match.homeTeamName.split(" ")[0]}
          </span>
        </div>

        <div className="text-center px-1">
          <span className="font-display font-black text-lg text-primary whitespace-nowrap">
            {match.homeScore} - {match.awayScore}
          </span>
        </div>

        <div className="flex flex-col items-center gap-1 flex-1">
          <span className="text-xl">{match.awayTeamEmoji}</span>
          <span className="text-[10px] font-semibold text-center leading-tight truncate w-full text-center">
            {match.awayTeamName.split(" ")[0]}
          </span>
        </div>
      </div>
    </div>
  );
}

/* ─── Latest News Card ───────────────────────────────────────────────── */
function LatestNewsCard({
  article,
  onNavigateToNews,
}: {
  article: NewsArticle;
  onNavigateToNews: () => void;
}) {
  const excerpt =
    article.excerpt.length > 80
      ? `${article.excerpt.slice(0, 80)}…`
      : article.excerpt;

  const CATEGORY_COLOR: Record<string, string> = {
    "Match Report": "oklch(0.58 0.27 24.8)",
    "Transfer News": "oklch(0.44 0.19 257)",
    "League Update": "oklch(0.52 0.18 142)",
    Feature: "oklch(0.50 0.22 305)",
  };
  const catColor = CATEGORY_COLOR[article.category] ?? "oklch(var(--primary))";

  return (
    <button
      type="button"
      onClick={onNavigateToNews}
      className="flex gap-3 p-3 rounded-xl border w-full text-left transition-smooth hover:scale-[1.01] active:scale-[0.99]"
      style={{
        background: "oklch(var(--card) / 0.8)",
        borderColor: "oklch(var(--primary) / 0.12)",
        backdropFilter: "blur(10px)",
      }}
      data-ocid="latest-news-card"
    >
      {/* Emoji thumbnail */}
      <div
        className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
        style={{
          background: `${catColor.replace(")", " / 0.18)")}`,
          border: `1px solid ${catColor.replace(")", " / 0.3)")}`,
        }}
      >
        {article.emoji}
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 mb-1">
          <span
            className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
            style={{
              background: `${catColor.replace(")", " / 0.15)")}`,
              color: catColor,
            }}
          >
            {article.category}
          </span>
          <span className="text-[10px] text-muted-foreground">
            {article.date}
          </span>
        </div>
        <p className="text-xs font-bold leading-snug line-clamp-2 mb-1">
          {article.title}
        </p>
        <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-2">
          {excerpt}
        </p>
      </div>
    </button>
  );
}

/* ─── Page ───────────────────────────────────────────────────────────── */

export default function Home({
  onNavigate,
}: { onNavigate: (tab: TabId) => void }) {
  const {
    data: matches,
    isLoading: matchesLoading,
    dataUpdatedAt,
  } = useMatches();
  const { data: teams, isLoading: teamsLoading } = useTeams();
  const { data: newsData, isLoading: newsLoading } = useNews();

  const liveMatches = matches?.filter((m) => m.status === "live") ?? [];
  const recentMatches = matches?.filter((m) => m.status === "finished") ?? [];
  const upcomingMatches = matches?.filter((m) => m.status === "upcoming") ?? [];
  const featuredLive = liveMatches[0];

  // 3 most recent news articles
  const latestNews = (newsData ?? []).slice(0, 3);

  const lastUpdated = dataUpdatedAt
    ? new Date(dataUpdatedAt).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;

  const isLoading = matchesLoading || teamsLoading;

  return (
    <div className="px-4 py-4 max-w-xl mx-auto">
      {/* Live Banner */}
      {liveMatches.length > 0 && (
        <div
          className="flex items-center gap-3 px-4 py-3 rounded-2xl mb-5 pulse-live"
          style={{
            background:
              "linear-gradient(135deg, oklch(var(--destructive) / 0.9), oklch(0.5 0.22 20 / 0.85))",
            boxShadow: "0 0 25px oklch(var(--destructive) / 0.35)",
          }}
          data-ocid="live-banner"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-white flex-shrink-0 animate-pulse" />
          <span className="font-black text-sm text-white flex-1">
            {liveMatches.length} MATCH{liveMatches.length > 1 ? "ES" : ""} LIVE
            NOW
          </span>
          <Badge
            className="text-[10px] font-bold text-white border-white/40 bg-white/15"
            variant="outline"
          >
            LIVE
          </Badge>
        </div>
      )}

      {/* Quick Stats */}
      <section className="mb-5">
        {isLoading ? (
          <div className="flex gap-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-20 flex-1 rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="flex gap-3" data-ocid="quick-stats">
            <QuickStat
              icon={<Users size={16} />}
              label="Teams"
              value={teams?.length ?? 0}
            />
            <QuickStat
              icon={<Zap size={16} />}
              label="Live Now"
              value={liveMatches.length}
              accent
            />
            <QuickStat
              icon={<CheckCircle2 size={16} />}
              label="Played"
              value={recentMatches.length}
            />
          </div>
        )}
      </section>

      {/* Featured Live Match */}
      {(liveMatches.length > 0 || isLoading) && (
        <section className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-display font-bold text-base flex items-center gap-2">
              <span
                className="w-2 h-2 rounded-full animate-pulse inline-block"
                style={{ background: "oklch(var(--destructive))" }}
              />
              Featured Live
            </h2>
            {lastUpdated && (
              <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                <RefreshCw size={10} />
                Updated {lastUpdated}
              </span>
            )}
          </div>

          {isLoading ? (
            <Skeleton className="h-64 rounded-2xl" />
          ) : featuredLive ? (
            <>
              <FeaturedLiveCard
                match={featuredLive}
                onViewStats={() => onNavigate("matches")}
              />
              {/* Secondary live matches as compact cards */}
              {liveMatches.slice(1).map((m) => (
                <div
                  key={m.id}
                  className="rounded-xl border mt-3 px-4 py-3 flex items-center gap-3 transition-smooth"
                  style={{
                    background: "oklch(var(--card) / 0.8)",
                    borderColor: "oklch(var(--destructive) / 0.3)",
                    backdropFilter: "blur(10px)",
                  }}
                  data-ocid="secondary-live-card"
                >
                  <span
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold flex-shrink-0"
                    style={{
                      background: "oklch(var(--destructive))",
                      color: "white",
                    }}
                  >
                    <span className="w-1 h-1 rounded-full bg-white animate-pulse" />
                    {m.minute}'
                  </span>
                  <span className="text-sm flex-1 truncate min-w-0">
                    <span className="font-semibold">
                      {m.homeTeamEmoji} {m.homeTeamName}
                    </span>
                    <span className="mx-2 font-black text-primary">
                      {m.homeScore} - {m.awayScore}
                    </span>
                    <span className="font-semibold">
                      {m.awayTeamEmoji} {m.awayTeamName}
                    </span>
                  </span>
                </div>
              ))}
            </>
          ) : null}
        </section>
      )}

      {/* Recent Matches */}
      {recentMatches.length > 0 && (
        <section className="mb-6">
          <h2 className="font-display font-bold text-base mb-3 flex items-center gap-2">
            <CheckCircle2 size={15} className="text-primary" />
            Recent Results
          </h2>
          {isLoading ? (
            <div className="grid grid-cols-2 gap-3">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-28 rounded-xl" />
              ))}
            </div>
          ) : (
            <div
              className="grid grid-cols-2 gap-3"
              data-ocid="recent-matches-grid"
            >
              {recentMatches.map((m) => (
                <RecentMatchCard key={m.id} match={m} />
              ))}
            </div>
          )}
        </section>
      )}

      {/* Upcoming Peek */}
      {upcomingMatches.length > 0 && !isLoading && (
        <section className="mb-6">
          <h2 className="font-display font-bold text-base mb-3">🗓️ Next Up</h2>
          <div className="space-y-2" data-ocid="upcoming-matches">
            {upcomingMatches.slice(0, 2).map((m) => (
              <div
                key={m.id}
                className="flex items-center gap-3 px-4 py-3 rounded-xl border transition-smooth"
                style={{
                  background: "oklch(var(--card) / 0.75)",
                  borderColor: "oklch(var(--secondary) / 0.25)",
                  backdropFilter: "blur(10px)",
                }}
                data-ocid="upcoming-match-row"
              >
                <span className="text-lg">{m.homeTeamEmoji}</span>
                <span className="text-xs font-semibold flex-1 truncate min-w-0">
                  {m.homeTeamName}{" "}
                  <span className="text-muted-foreground font-normal">vs</span>{" "}
                  {m.awayTeamName}
                </span>
                <span className="text-lg">{m.awayTeamEmoji}</span>
                <span
                  className="text-[10px] px-2 py-0.5 rounded-full font-semibold flex-shrink-0"
                  style={{
                    background: "oklch(var(--secondary) / 0.2)",
                    color: "oklch(var(--secondary))",
                  }}
                >
                  {new Date(m.date).toLocaleDateString("en-KE", {
                    day: "numeric",
                    month: "short",
                  })}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Latest News */}
      <section className="mb-6">
        {/* Section header */}
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-display font-bold text-base flex items-center gap-2">
            <Newspaper size={15} className="text-primary" />
            Latest News
          </h2>
          <button
            type="button"
            onClick={() => onNavigate("news")}
            className="flex items-center gap-1 text-xs font-semibold transition-smooth hover:opacity-80"
            style={{ color: "oklch(var(--primary))" }}
            data-ocid="view-all-news-btn"
          >
            View all
            <ChevronRight size={13} />
          </button>
        </div>

        {newsLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-20 rounded-xl" />
            ))}
          </div>
        ) : latestNews.length === 0 ? (
          /* Fallback: show first 3 from FALLBACK when no backend data */
          <div className="space-y-3" data-ocid="latest-news-list">
            {[
              {
                id: "fn1",
                title: "Lamu United Seal Title with Dramatic Late Winner",
                excerpt:
                  "Yusuf Al-Amin's stunning 89th-minute strike handed Lamu United a crucial 2-1 victory.",
                category: "Match Report",
                date: "9 Apr 2026",
                emoji: "🏆",
                readTime: 3,
              },
              {
                id: "fn2",
                title: "Mokowe FC Complete Double Signing Ahead of Run-In",
                excerpt:
                  "Mokowe FC have bolstered their midfield with two experienced players.",
                category: "Transfer News",
                date: "7 Apr 2026",
                emoji: "✍️",
                readTime: 3,
              },
              {
                id: "fn3",
                title: "VAR System Trialled for Final League Fixtures",
                excerpt:
                  "The FKF Lamu County branch announces a video review system for the remaining season.",
                category: "League Update",
                date: "5 Apr 2026",
                emoji: "📋",
                readTime: 4,
              },
            ].map((article) => (
              <LatestNewsCard
                key={article.id}
                article={article as NewsArticle}
                onNavigateToNews={() => onNavigate("news")}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-3" data-ocid="latest-news-list">
            {latestNews.map((article) => (
              <LatestNewsCard
                key={article.id}
                article={article}
                onNavigateToNews={() => onNavigate("news")}
              />
            ))}
          </div>
        )}

        {/* CTA button */}
        <button
          type="button"
          onClick={() => onNavigate("news")}
          className="mt-4 w-full py-3 rounded-xl text-sm font-bold transition-smooth hover:opacity-90 active:scale-[0.98]"
          style={{
            background: "oklch(var(--primary) / 0.1)",
            border: "1px solid oklch(var(--primary) / 0.3)",
            color: "oklch(var(--primary))",
          }}
          data-ocid="goto-news-cta"
        >
          📰 Read All News
        </button>
      </section>

      {/* Footer */}
      <footer className="mt-4 text-center text-xs text-muted-foreground pb-2">
        © {new Date().getFullYear()}. Built with love using{" "}
        <a
          href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline"
        >
          caffeine.ai
        </a>
      </footer>
    </div>
  );
}
