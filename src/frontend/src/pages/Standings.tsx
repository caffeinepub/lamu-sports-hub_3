import { Skeleton } from "@/components/ui/skeleton";
import { Fragment } from "react";
import { useMatches, useStandings, useTeams } from "../hooks/use-backend";
import type { Standing } from "../types";

const SAMPLE_STANDINGS: Standing[] = [
  {
    position: 1,
    teamId: "1",
    teamName: "Lamu United FC",
    teamShortName: "LMU",
    teamEmoji: "⚽",
    played: 12,
    won: 8,
    drawn: 3,
    lost: 1,
    goalsFor: 24,
    goalsAgainst: 9,
    goalDiff: 15,
    points: 27,
    form: ["W", "W", "D", "W", "W"],
  },
  {
    position: 2,
    teamId: "2",
    teamName: "Faza Strikers",
    teamShortName: "FAZ",
    teamEmoji: "🔵",
    played: 12,
    won: 7,
    drawn: 2,
    lost: 3,
    goalsFor: 21,
    goalsAgainst: 12,
    goalDiff: 9,
    points: 23,
    form: ["W", "L", "W", "D", "W"],
  },
  {
    position: 3,
    teamId: "3",
    teamName: "Mokowe FC",
    teamShortName: "MOK",
    teamEmoji: "🟢",
    played: 12,
    won: 6,
    drawn: 4,
    lost: 2,
    goalsFor: 19,
    goalsAgainst: 11,
    goalDiff: 8,
    points: 22,
    form: ["D", "W", "W", "D", "L"],
  },
  {
    position: 4,
    teamId: "4",
    teamName: "Witu Warriors",
    teamShortName: "WTW",
    teamEmoji: "🟡",
    played: 12,
    won: 5,
    drawn: 3,
    lost: 4,
    goalsFor: 16,
    goalsAgainst: 14,
    goalDiff: 2,
    points: 18,
    form: ["L", "D", "W", "L", "W"],
  },
  {
    position: 5,
    teamId: "5",
    teamName: "Hindi Hotspurs",
    teamShortName: "HHS",
    teamEmoji: "🔴",
    played: 12,
    won: 4,
    drawn: 5,
    lost: 3,
    goalsFor: 14,
    goalsAgainst: 13,
    goalDiff: 1,
    points: 17,
    form: ["D", "W", "D", "D", "L"],
  },
  {
    position: 6,
    teamId: "6",
    teamName: "Pate Island FC",
    teamShortName: "PAT",
    teamEmoji: "🏝️",
    played: 12,
    won: 3,
    drawn: 4,
    lost: 5,
    goalsFor: 13,
    goalsAgainst: 18,
    goalDiff: -5,
    points: 13,
    form: ["L", "D", "L", "W", "D"],
  },
  {
    position: 7,
    teamId: "7",
    teamName: "Mpeketoni Eagles",
    teamShortName: "MPE",
    teamEmoji: "🦅",
    played: 12,
    won: 2,
    drawn: 3,
    lost: 7,
    goalsFor: 10,
    goalsAgainst: 22,
    goalDiff: -12,
    points: 9,
    form: ["L", "L", "D", "W", "L"],
  },
  {
    position: 8,
    teamId: "8",
    teamName: "Kiunga United",
    teamShortName: "KIU",
    teamEmoji: "🌊",
    played: 12,
    won: 1,
    drawn: 2,
    lost: 9,
    goalsFor: 7,
    goalsAgainst: 28,
    goalDiff: -21,
    points: 5,
    form: ["L", "L", "D", "L", "L"],
  },
];

function PosBadge({ pos }: { pos: number }) {
  const style =
    pos === 1
      ? {
          background: "linear-gradient(135deg, #FFD700, #FFA500)",
          color: "#000",
        }
      : pos === 2
        ? {
            background: "linear-gradient(135deg, #C0C0C0, #A0A0A0)",
            color: "#000",
          }
        : pos === 3
          ? {
              background: "linear-gradient(135deg, #CD7F32, #B87333)",
              color: "#fff",
            }
          : { background: "rgba(255,107,0,0.15)", color: "#FF6B00" };
  return (
    <div
      className="w-7 h-7 rounded-full flex items-center justify-center font-black text-xs flex-shrink-0"
      style={style}
    >
      {pos}
    </div>
  );
}

function StatCell({
  value,
  className = "",
}: { value: string | number; className?: string }) {
  return (
    <td
      className={`py-0 px-1 text-center text-xs tabular-nums ${className}`}
      style={{ color: "rgba(148,163,184,0.9)" }}
    >
      {value}
    </td>
  );
}

function DesktopRow({ s, index }: { s: Standing; index: number }) {
  const rowBg = index % 2 === 0 ? "rgba(30,41,59,0.75)" : "rgba(30,41,59,0.55)";
  const gd = s.goalDiff > 0 ? `+${s.goalDiff}` : `${s.goalDiff}`;
  const gdColor =
    s.goalDiff > 0
      ? "#10B981"
      : s.goalDiff < 0
        ? "#EF4444"
        : "rgba(148,163,184,0.9)";

  return (
    <tr
      data-ocid="standing-row"
      style={{ "--row-bg": rowBg } as React.CSSProperties}
    >
      <td
        className="py-2.5 pl-3 pr-1 rounded-l-xl"
        style={{ background: rowBg }}
      >
        <PosBadge pos={s.position} />
      </td>
      <td className="py-2.5 px-2 min-w-0" style={{ background: rowBg }}>
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-base flex-shrink-0">{s.teamEmoji}</span>
          <div className="min-w-0">
            <div
              className="font-bold text-xs truncate"
              style={{ color: "#f8fafc" }}
            >
              {s.teamName}
            </div>
            <div
              className="text-[10px]"
              style={{ color: "rgba(100,116,139,0.9)" }}
            >
              {s.teamShortName}
            </div>
          </div>
        </div>
      </td>
      <StatCell value={s.played} className="hidden sm:table-cell" />
      <StatCell value={s.won} />
      <StatCell value={s.drawn} />
      <StatCell value={s.lost} />
      <StatCell value={s.goalsFor} className="hidden sm:table-cell" />
      <StatCell value={s.goalsAgainst} className="hidden sm:table-cell" />
      <td
        className="py-0 px-1 text-center text-xs tabular-nums hidden sm:table-cell"
        style={{ background: rowBg, color: gdColor }}
      >
        {gd}
      </td>
      <td
        className="py-2.5 pl-1 pr-3 text-right rounded-r-xl"
        style={{ background: rowBg }}
      >
        <span className="font-black text-base" style={{ color: "#FF6B00" }}>
          {s.points}
        </span>
      </td>
    </tr>
  );
}

function MobileDetailRow({ s, index }: { s: Standing; index: number }) {
  const rowBg = index % 2 === 0 ? "rgba(30,41,59,0.75)" : "rgba(30,41,59,0.55)";
  const gd = s.goalDiff > 0 ? `+${s.goalDiff}` : `${s.goalDiff}`;
  const gdColor =
    s.goalDiff > 0
      ? "#10B981"
      : s.goalDiff < 0
        ? "#EF4444"
        : "rgba(148,163,184,0.9)";

  return (
    <tr className="sm:hidden" data-ocid="standing-detail-row">
      <td
        colSpan={5}
        className="pb-2 px-3 rounded-b-xl"
        style={{ background: rowBg }}
      >
        <div
          className="flex items-center gap-3 text-[10px]"
          style={{ color: "rgba(148,163,184,0.85)" }}
        >
          <span>
            GF <strong style={{ color: "#f8fafc" }}>{s.goalsFor}</strong>
          </span>
          <span>
            GA <strong style={{ color: "#f8fafc" }}>{s.goalsAgainst}</strong>
          </span>
          <span>
            GD <strong style={{ color: gdColor }}>{gd}</strong>
          </span>
          <span>
            P <strong style={{ color: "#f8fafc" }}>{s.played}</strong>
          </span>
        </div>
      </td>
    </tr>
  );
}

function LoadingSkeleton() {
  return (
    <div className="p-3 space-y-1.5">
      {["s1", "s2", "s3", "s4", "s5", "s6", "s7", "s8"].map((k, i) => (
        <Skeleton
          key={k}
          className="h-11 w-full rounded-xl"
          style={{ opacity: 1 - i * 0.07 }}
        />
      ))}
    </div>
  );
}

export default function Standings() {
  const { data: rawStandings, isLoading: loadingStandings } = useStandings();
  const { data: teams } = useTeams();
  const { data: matches } = useMatches();

  const standings: Standing[] =
    rawStandings && rawStandings.length > 0
      ? rawStandings.map((s) => {
          const team = teams?.find((t) => t.id === s.teamId);
          return {
            ...s,
            teamName: team?.name ?? s.teamName,
            teamShortName: team?.shortName ?? s.teamShortName,
            teamEmoji: team?.emoji ?? s.teamEmoji,
          };
        })
      : SAMPLE_STANDINGS;

  const totalMatches =
    matches?.filter((m) => m.status === "finished").length ?? 0;
  const teamCount = standings.length;

  return (
    <div className="px-3 py-4 max-w-2xl mx-auto space-y-4">
      {/* Season header card */}
      <div
        className="rounded-2xl p-4 border relative overflow-hidden"
        style={{
          background: "rgba(30,41,59,0.85)",
          backdropFilter: "blur(16px)",
          borderColor: "rgba(255,107,0,0.25)",
        }}
        data-ocid="season-header"
      >
        {/* Decorative orb */}
        <div
          className="absolute -top-8 -right-8 w-32 h-32 rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, rgba(255,107,0,0.18) 0%, transparent 70%)",
          }}
        />
        <div className="flex items-start gap-3 relative z-10">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
            style={{
              background: "linear-gradient(135deg, #FF6B00, #0047AB)",
              boxShadow: "0 4px 15px rgba(255,107,0,0.3)",
            }}
          >
            🏆
          </div>
          <div className="flex-1 min-w-0">
            <p
              className="text-[10px] font-semibold uppercase tracking-widest mb-0.5"
              style={{ color: "#FF6B00" }}
            >
              FKF Lamu County League
            </p>
            <h1
              className="font-black text-xl leading-tight"
              style={{ color: "#f8fafc" }}
            >
              2025/26 Season
            </h1>
            <div className="flex items-center gap-4 mt-2">
              <div className="text-center">
                <div
                  className="font-black text-lg leading-none"
                  style={{ color: "#FF6B00" }}
                >
                  {teamCount}
                </div>
                <div
                  className="text-[9px] uppercase tracking-wide mt-0.5"
                  style={{ color: "rgba(148,163,184,0.8)" }}
                >
                  Teams
                </div>
              </div>
              <div
                className="w-px h-6"
                style={{ background: "rgba(255,107,0,0.2)" }}
              />
              <div className="text-center">
                <div
                  className="font-black text-lg leading-none"
                  style={{ color: "#FF6B00" }}
                >
                  {totalMatches}
                </div>
                <div
                  className="text-[9px] uppercase tracking-wide mt-0.5"
                  style={{ color: "rgba(148,163,184,0.8)" }}
                >
                  Matches Played
                </div>
              </div>
              <div
                className="w-px h-6"
                style={{ background: "rgba(255,107,0,0.2)" }}
              />
              <div className="text-center">
                <div
                  className="font-black text-lg leading-none"
                  style={{ color: "#10B981" }}
                >
                  Live
                </div>
                <div
                  className="text-[9px] uppercase tracking-wide mt-0.5"
                  style={{ color: "rgba(148,163,184,0.8)" }}
                >
                  Updated
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* League table */}
      <div
        className="rounded-2xl border overflow-hidden"
        style={{
          background: "rgba(15,23,42,0.92)",
          backdropFilter: "blur(16px)",
          borderColor: "rgba(255,107,0,0.2)",
        }}
        data-ocid="standings-table"
      >
        {/* Header row */}
        <div
          className="px-3 py-2.5 border-b"
          style={{
            borderColor: "rgba(255,107,0,0.12)",
            background: "rgba(255,107,0,0.06)",
          }}
        >
          <table className="w-full table-fixed">
            <thead>
              <tr>
                <th
                  className="w-8 text-left text-[10px] font-bold uppercase tracking-wide"
                  style={{ color: "#FF6B00" }}
                >
                  #
                </th>
                <th
                  className="text-left text-[10px] font-bold uppercase tracking-wide pl-2"
                  style={{ color: "#FF6B00" }}
                >
                  Club
                </th>
                {/* Desktop-only columns */}
                <th
                  className="w-7 text-center text-[10px] font-bold uppercase hidden sm:table-cell"
                  style={{ color: "rgba(148,163,184,0.7)" }}
                >
                  P
                </th>
                <th
                  className="w-7 text-center text-[10px] font-bold uppercase"
                  style={{ color: "rgba(148,163,184,0.7)" }}
                >
                  W
                </th>
                <th
                  className="w-7 text-center text-[10px] font-bold uppercase"
                  style={{ color: "rgba(148,163,184,0.7)" }}
                >
                  D
                </th>
                <th
                  className="w-7 text-center text-[10px] font-bold uppercase"
                  style={{ color: "rgba(148,163,184,0.7)" }}
                >
                  L
                </th>
                <th
                  className="w-8 text-center text-[10px] font-bold uppercase hidden sm:table-cell"
                  style={{ color: "rgba(148,163,184,0.7)" }}
                >
                  GF
                </th>
                <th
                  className="w-8 text-center text-[10px] font-bold uppercase hidden sm:table-cell"
                  style={{ color: "rgba(148,163,184,0.7)" }}
                >
                  GA
                </th>
                <th
                  className="w-8 text-center text-[10px] font-bold uppercase hidden sm:table-cell"
                  style={{ color: "rgba(148,163,184,0.7)" }}
                >
                  GD
                </th>
                <th
                  className="w-9 text-right text-[10px] font-bold uppercase pr-3"
                  style={{ color: "#FF6B00" }}
                >
                  Pts
                </th>
              </tr>
            </thead>
          </table>
        </div>

        {/* Table body */}
        <div className="px-3 py-1">
          {loadingStandings ? (
            <LoadingSkeleton />
          ) : (
            <table
              className="w-full table-fixed border-separate"
              style={{ borderSpacing: "0 3px" }}
            >
              <tbody>
                {standings.map((s, i) => (
                  <Fragment key={s.teamId}>
                    <DesktopRow s={s} index={i} />
                    <MobileDetailRow s={s} index={i} />
                  </Fragment>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Legend */}
        <div
          className="px-4 py-3 border-t flex flex-wrap gap-x-4 gap-y-1.5"
          style={{
            borderColor: "rgba(255,107,0,0.1)",
            background: "rgba(255,107,0,0.04)",
          }}
        >
          {[
            { color: "#FFD700", label: "League Title" },
            { color: "#C0C0C0", label: "Runner-Up" },
            { color: "#CD7F32", label: "3rd Place" },
            { color: "rgba(239,68,68,0.7)", label: "Relegation Zone" },
          ].map(({ color, label }) => (
            <div key={label} className="flex items-center gap-1.5">
              <div
                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                style={{ background: color }}
              />
              <span
                className="text-[10px]"
                style={{ color: "rgba(148,163,184,0.7)" }}
              >
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent form guide */}
      <div
        className="rounded-2xl border p-4"
        style={{
          background: "rgba(30,41,59,0.8)",
          backdropFilter: "blur(12px)",
          borderColor: "rgba(255,107,0,0.18)",
        }}
        data-ocid="form-guide"
      >
        <h3
          className="font-black text-sm mb-3 uppercase tracking-wide"
          style={{ color: "#FF6B00" }}
        >
          Recent Form
        </h3>
        <div className="space-y-2.5">
          {standings.slice(0, 5).map((s) => (
            <div key={s.teamId} className="flex items-center gap-3">
              <span className="text-base flex-shrink-0">{s.teamEmoji}</span>
              <span
                className="text-xs font-semibold w-28 truncate"
                style={{ color: "#f8fafc" }}
              >
                {s.teamShortName}
              </span>
              <div className="flex gap-1">
                {s.form.map((r, fi) => {
                  const bg =
                    r === "W"
                      ? "#10B981"
                      : r === "D"
                        ? "rgba(100,116,139,0.5)"
                        : "#EF4444";
                  return (
                    <span
                      key={`form-${s.teamId}-${fi}-${r}`}
                      className="w-5 h-5 rounded-sm flex items-center justify-center text-[9px] font-black"
                      style={{ background: bg, color: "#fff" }}
                    >
                      {r}
                    </span>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
