import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import {
  Calendar,
  Check,
  Lock,
  LogIn,
  LogOut,
  Newspaper,
  Pencil,
  Plus,
  Save,
  Shield,
  Trash2,
  Trophy,
  User,
  Users,
  X,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  BackendMatchStatus,
  useAddNews,
  useAddPlayer,
  useAddTeam,
  useDeleteNews,
  useDeletePlayer,
  useDeleteTeam,
  useMatches,
  useNews,
  usePlayers,
  useScheduleMatch,
  useTeams,
  useUpdateMatchScore,
  useUpdateMatchStatus,
} from "../hooks/use-backend";
import type { Match, MatchStatus, NewsArticle, Player, Team } from "../types";

// ─── Types for form state ─────────────────────────────────────────────────────

type AdminTab = "matches" | "teams" | "players" | "news";

interface ScoreForm {
  homeScore: string;
  awayScore: string;
  status: MatchStatus;
}
interface AddMatchForm {
  homeTeamId: string;
  awayTeamId: string;
  matchDate: string;
  matchTime: string;
}
interface TeamForm {
  name: string;
  shortName: string;
  emoji: string;
  location: string;
}
interface PlayerForm {
  name: string;
  teamId: string;
  position: string;
  goals: string;
  assists: string;
  jerseyNumber: string;
}
interface NewsForm {
  title: string;
  excerpt: string;
  category: string;
  date: string;
  emoji: string;
}

const POSITIONS = ["Goalkeeper", "Defender", "Midfielder", "Forward"];
const NEWS_CATEGORIES = [
  "Match Report",
  "Transfer",
  "Preview",
  "Award",
  "Infrastructure",
  "General",
];

// Map frontend MatchStatus → BackendMatchStatus
function toBackendStatus(status: MatchStatus): BackendMatchStatus {
  if (status === "live") return BackendMatchStatus.live;
  if (status === "finished") return BackendMatchStatus.finished;
  return BackendMatchStatus.scheduled;
}

// ─── Styled helpers ───────────────────────────────────────────────────────────

const glassCard = {
  background: "rgba(30, 41, 59, 0.82)",
  border: "1px solid rgba(255,107,0,0.18)",
  backdropFilter: "blur(14px)",
} as React.CSSProperties;

const orangeBg = {
  background:
    "linear-gradient(135deg, oklch(0.58 0.27 24.8), oklch(0.44 0.19 257))",
} as React.CSSProperties;

function InputField({
  label,
  id,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  id: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label
        htmlFor={id}
        className="text-xs font-semibold text-muted-foreground uppercase tracking-wide"
      >
        {label}
      </Label>
      <Input
        id={id}
        {...props}
        className="bg-muted/30 border-border/60 focus:border-primary h-10 text-sm rounded-xl"
      />
    </div>
  );
}

function SelectField({
  label,
  id,
  options,
  value,
  onChange,
}: {
  label: string;
  id: string;
  options: { value: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label
        htmlFor={id}
        className="text-xs font-semibold text-muted-foreground uppercase tracking-wide"
      >
        {label}
      </Label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-muted/30 border border-border/60 rounded-xl h-10 px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
        style={{ background: "rgba(30,41,59,0.8)" }}
      >
        {options.map((o) => (
          <option
            key={o.value}
            value={o.value}
            style={{ background: "#0f172a" }}
          >
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

// ─── Login Wall ───────────────────────────────────────────────────────────────

function LoginWall({
  onLogin,
  isLoggingIn,
}: { onLogin: () => void; isLoggingIn: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[72vh] px-6 text-center">
      <div className="mb-8 flex flex-col items-center gap-4">
        <div
          className="w-24 h-24 rounded-3xl flex items-center justify-center shadow-2xl"
          style={orangeBg}
        >
          <span className="text-4xl">⚽</span>
        </div>
        <div>
          <h1 className="font-display font-black text-3xl text-foreground mb-1">
            Lamu Sports Hub
          </h1>
          <p className="text-primary font-semibold text-sm tracking-wide uppercase">
            League Administrator
          </p>
        </div>
      </div>

      <div
        className="w-full max-w-xs rounded-2xl p-6 flex flex-col items-center gap-4"
        style={glassCard}
      >
        <Shield size={32} className="text-primary" />
        <p className="text-muted-foreground text-sm leading-relaxed text-center">
          Protected area. Sign in with your Internet Identity to manage matches,
          teams, players, and news.
        </p>

        <Button
          onClick={onLogin}
          disabled={isLoggingIn}
          data-ocid="admin-login-btn"
          className="w-full h-12 rounded-xl font-bold text-base flex items-center gap-2 justify-center"
          style={{ background: "oklch(0.58 0.27 24.8)", color: "#020617" }}
        >
          {isLoggingIn ? (
            <>
              <span className="w-4 h-4 border-2 border-current/40 border-t-current rounded-full animate-spin" />
              Connecting...
            </>
          ) : (
            <>
              <LogIn size={18} />
              Login with Internet Identity
            </>
          )}
        </Button>

        <p className="text-xs text-muted-foreground flex items-center gap-1.5">
          <Lock size={11} />
          Secured by Internet Computer · Decentralised Auth
        </p>
      </div>
    </div>
  );
}

// ─── Matches Admin Tab ────────────────────────────────────────────────────────

function MatchesTab() {
  const { data: matches = [], isLoading } = useMatches();
  const { data: teams = [] } = useTeams();
  const updateScore = useUpdateMatchScore();
  const updateStatus = useUpdateMatchStatus();
  const scheduleMatch = useScheduleMatch();

  const [editing, setEditing] = useState<string | null>(null);
  const [forms, setForms] = useState<Record<string, ScoreForm>>({});
  const [showAdd, setShowAdd] = useState(false);
  const [addForm, setAddForm] = useState<AddMatchForm>({
    homeTeamId: "",
    awayTeamId: "",
    matchDate: "",
    matchTime: "15:00",
  });

  const teamOptions = teams.map((t) => ({
    value: t.id,
    label: `${t.emoji} ${t.name}`,
  }));

  function openEdit(m: Match) {
    setEditing(m.id);
    setForms((prev) => ({
      ...prev,
      [m.id]: {
        homeScore: String(m.homeScore),
        awayScore: String(m.awayScore),
        status: m.status,
      },
    }));
  }

  function updateForm(id: string, patch: Partial<ScoreForm>) {
    setForms((prev) => ({ ...prev, [id]: { ...prev[id], ...patch } }));
  }

  async function saveMatch(matchId: string) {
    const f = forms[matchId];
    if (!f) return;
    try {
      await updateScore.mutateAsync({
        id: matchId,
        homeScore: Number(f.homeScore),
        awayScore: Number(f.awayScore),
      });
      await updateStatus.mutateAsync({
        id: matchId,
        status: toBackendStatus(f.status),
      });
      setEditing(null);
    } catch {
      // toast already shown in mutation onError
    }
  }

  async function handleAddMatch() {
    if (!addForm.homeTeamId || !addForm.awayTeamId || !addForm.matchDate) {
      toast.error("Please fill all required fields");
      return;
    }
    if (addForm.homeTeamId === addForm.awayTeamId) {
      toast.error("Home and away teams must be different");
      return;
    }
    try {
      await scheduleMatch.mutateAsync({
        homeTeamId: addForm.homeTeamId,
        awayTeamId: addForm.awayTeamId,
        matchDate: addForm.matchDate,
        matchTime: addForm.matchTime,
      });
      setAddForm({
        homeTeamId: "",
        awayTeamId: "",
        matchDate: "",
        matchTime: "15:00",
      });
      setShowAdd(false);
    } catch {
      // toast already shown in mutation onError
    }
  }

  if (isLoading)
    return (
      <div className="text-center text-muted-foreground py-12 text-sm">
        Loading matches…
      </div>
    );

  return (
    <div className="flex flex-col gap-3">
      <button
        type="button"
        onClick={() => setShowAdd(!showAdd)}
        data-ocid="add-match-btn"
        className="w-full h-11 rounded-xl font-bold flex items-center gap-2 justify-center text-sm border border-primary/40 text-primary hover:bg-primary/10 transition-colors"
      >
        {showAdd ? <X size={16} /> : <Plus size={16} />}
        {showAdd ? "Cancel" : "Schedule Match"}
      </button>

      {showAdd && (
        <div className="rounded-2xl p-4 flex flex-col gap-3" style={glassCard}>
          <h3 className="font-bold text-sm text-primary">New Match</h3>
          <SelectField
            label="Home Team *"
            id="m-home"
            options={[
              { value: "", label: "Select home team…" },
              ...teamOptions,
            ]}
            value={addForm.homeTeamId}
            onChange={(v) => setAddForm((p) => ({ ...p, homeTeamId: v }))}
          />
          <SelectField
            label="Away Team *"
            id="m-away"
            options={[
              { value: "", label: "Select away team…" },
              ...teamOptions,
            ]}
            value={addForm.awayTeamId}
            onChange={(v) => setAddForm((p) => ({ ...p, awayTeamId: v }))}
          />
          <div className="grid grid-cols-2 gap-3">
            <InputField
              label="Date *"
              id="m-date"
              type="date"
              value={addForm.matchDate}
              onChange={(e) =>
                setAddForm((p) => ({ ...p, matchDate: e.target.value }))
              }
            />
            <InputField
              label="Time"
              id="m-time"
              type="time"
              value={addForm.matchTime}
              onChange={(e) =>
                setAddForm((p) => ({ ...p, matchTime: e.target.value }))
              }
            />
          </div>
          <Button
            onClick={handleAddMatch}
            disabled={scheduleMatch.isPending}
            data-ocid="save-match-btn"
            className="h-10 rounded-xl font-bold flex items-center gap-2 justify-center text-sm"
            style={{ background: "oklch(0.58 0.27 24.8)", color: "#020617" }}
          >
            <Check size={14} />
            {scheduleMatch.isPending ? "Scheduling…" : "Schedule Match"}
          </Button>
        </div>
      )}

      {matches.map((m) => {
        const isEdit = editing === m.id;
        const f = forms[m.id];
        const isSaving = updateScore.isPending || updateStatus.isPending;
        return (
          <div key={m.id} className="rounded-2xl p-4" style={glassCard}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-base">{m.homeTeamEmoji}</span>
                <span className="font-bold text-sm">{m.homeTeamName}</span>
                <span className="font-black text-primary text-lg px-2">
                  {m.homeScore} – {m.awayScore}
                </span>
                <span className="font-bold text-sm">{m.awayTeamName}</span>
                <span className="text-base">{m.awayTeamEmoji}</span>
              </div>
              <button
                type="button"
                onClick={() => (isEdit ? setEditing(null) : openEdit(m))}
                className="p-1.5 rounded-lg text-muted-foreground hover:text-primary transition-colors"
                aria-label={isEdit ? "Cancel edit" : "Edit match"}
              >
                {isEdit ? <X size={16} /> : <Pencil size={16} />}
              </button>
            </div>

            <div className="flex items-center gap-2 mb-3">
              <span
                className={`text-xs font-bold px-2 py-0.5 rounded-full ${m.status === "live" ? "bg-red-500/20 text-red-400" : m.status === "finished" ? "bg-muted text-muted-foreground" : "bg-primary/10 text-primary"}`}
              >
                {m.status === "live"
                  ? `🔴 LIVE ${m.minute ? `${m.minute}'` : ""}`
                  : m.status === "finished"
                    ? "FT"
                    : m.date}
              </span>
              <span className="text-xs text-muted-foreground">{m.venue}</span>
            </div>

            {isEdit && f && (
              <div className="border-t border-border/40 pt-3 flex flex-col gap-3">
                <div className="grid grid-cols-2 gap-3">
                  <InputField
                    label="Home Score"
                    id={`hs-${m.id}`}
                    type="number"
                    min="0"
                    value={f.homeScore}
                    onChange={(e) =>
                      updateForm(m.id, { homeScore: e.target.value })
                    }
                  />
                  <InputField
                    label="Away Score"
                    id={`as-${m.id}`}
                    type="number"
                    min="0"
                    value={f.awayScore}
                    onChange={(e) =>
                      updateForm(m.id, { awayScore: e.target.value })
                    }
                  />
                </div>
                <SelectField
                  label="Status"
                  id={`st-${m.id}`}
                  options={[
                    { value: "upcoming", label: "Upcoming" },
                    { value: "live", label: "Live" },
                    { value: "finished", label: "Finished" },
                  ]}
                  value={f.status}
                  onChange={(v) =>
                    updateForm(m.id, { status: v as MatchStatus })
                  }
                />
                <Button
                  onClick={() => saveMatch(m.id)}
                  disabled={isSaving}
                  data-ocid={`save-match-${m.id}`}
                  className="h-9 rounded-xl font-bold flex items-center gap-2 justify-center text-sm"
                  style={{
                    background: "oklch(0.58 0.27 24.8)",
                    color: "#020617",
                  }}
                >
                  <Save size={14} />
                  {isSaving ? "Saving…" : "Save Changes"}
                </Button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Teams Admin Tab ──────────────────────────────────────────────────────────

function TeamsTab() {
  const { data: teams = [], isLoading } = useTeams();
  const addTeamMutation = useAddTeam();
  const deleteTeamMutation = useDeleteTeam();

  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState<TeamForm>({
    name: "",
    shortName: "",
    emoji: "⚽",
    location: "",
  });

  async function addTeam() {
    if (!form.name.trim() || !form.shortName.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }
    try {
      await addTeamMutation.mutateAsync({
        name: form.name,
        abbreviation: form.shortName,
        emoji: form.emoji,
      });
      setForm({ name: "", shortName: "", emoji: "⚽", location: "" });
      setShowAdd(false);
    } catch {
      // toast already shown in mutation onError
    }
  }

  async function deleteTeam(id: string, name: string) {
    if (!confirm(`Remove ${name}? This cannot be undone.`)) return;
    try {
      await deleteTeamMutation.mutateAsync(id);
    } catch {
      // toast already shown in mutation onError
    }
  }

  if (isLoading)
    return (
      <div className="text-center text-muted-foreground py-12 text-sm">
        Loading teams…
      </div>
    );

  return (
    <div className="flex flex-col gap-3">
      <button
        type="button"
        onClick={() => setShowAdd(!showAdd)}
        data-ocid="add-team-btn"
        className="w-full h-11 rounded-xl font-bold flex items-center gap-2 justify-center text-sm border border-primary/40 text-primary hover:bg-primary/10 transition-colors"
      >
        {showAdd ? <X size={16} /> : <Plus size={16} />}
        {showAdd ? "Cancel" : "Add Team"}
      </button>

      {showAdd && (
        <div className="rounded-2xl p-4 flex flex-col gap-3" style={glassCard}>
          <h3 className="font-bold text-sm text-primary">New Team</h3>
          <InputField
            label="Team Name *"
            id="t-name"
            value={form.name}
            onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
            placeholder="e.g. Lamu United FC"
          />
          <div className="grid grid-cols-2 gap-3">
            <InputField
              label="Abbreviation *"
              id="t-abbr"
              maxLength={4}
              value={form.shortName}
              onChange={(e) =>
                setForm((p) => ({
                  ...p,
                  shortName: e.target.value.toUpperCase(),
                }))
              }
              placeholder="LMU"
            />
            <InputField
              label="Emoji"
              id="t-emoji"
              value={form.emoji}
              onChange={(e) =>
                setForm((p) => ({ ...p, emoji: e.target.value }))
              }
              placeholder="⚽"
            />
          </div>
          <Button
            onClick={addTeam}
            disabled={addTeamMutation.isPending}
            data-ocid="save-team-btn"
            className="h-10 rounded-xl font-bold flex items-center gap-2 justify-center text-sm"
            style={{ background: "oklch(0.58 0.27 24.8)", color: "#020617" }}
          >
            <Check size={14} />
            {addTeamMutation.isPending ? "Saving…" : "Add Team"}
          </Button>
        </div>
      )}

      {teams.map((t) => (
        <div
          key={t.id}
          className="rounded-2xl p-4 flex items-center gap-3"
          style={glassCard}
        >
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
            style={orangeBg}
          >
            {t.emoji}
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-bold text-sm truncate">{t.name}</div>
            <div className="text-xs text-muted-foreground">
              {t.shortName} · {t.location || "Lamu County"}
            </div>
          </div>
          <div className="text-right flex-shrink-0">
            <div className="font-black text-primary text-lg">
              {t.wins * 3 + t.draws}
            </div>
            <div className="text-xs text-muted-foreground">pts</div>
          </div>
          <button
            type="button"
            onClick={() => deleteTeam(t.id, t.name)}
            aria-label={`Remove ${t.name}`}
            disabled={deleteTeamMutation.isPending}
            className="p-2 rounded-lg text-destructive/70 hover:text-destructive hover:bg-destructive/10 transition-colors"
            data-ocid={`delete-team-${t.id}`}
          >
            <Trash2 size={15} />
          </button>
        </div>
      ))}
    </div>
  );
}

// ─── Players Admin Tab ────────────────────────────────────────────────────────

function PlayersTab() {
  const { data: players = [], isLoading: playersLoading } = usePlayers();
  const { data: teams = [] } = useTeams();
  const addPlayerMutation = useAddPlayer();
  const deletePlayerMutation = useDeletePlayer();

  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState<PlayerForm>({
    name: "",
    teamId: "",
    position: "Forward",
    goals: "0",
    assists: "0",
    jerseyNumber: "0",
  });

  const teamOptions = teams.map((t) => ({
    value: t.id,
    label: `${t.emoji} ${t.name}`,
  }));

  async function addPlayer() {
    if (!form.name.trim() || !form.teamId) {
      toast.error("Name and team are required");
      return;
    }
    try {
      await addPlayerMutation.mutateAsync({
        name: form.name,
        teamId: form.teamId,
        position: form.position,
        goals: Number(form.goals),
        assists: Number(form.assists),
      });
      setForm({
        name: "",
        teamId: "",
        position: "Forward",
        goals: "0",
        assists: "0",
        jerseyNumber: "0",
      });
      setShowAdd(false);
    } catch {
      // toast already shown in mutation onError
    }
  }

  async function deletePlayer(id: string, name: string) {
    if (!confirm(`Remove ${name}? This cannot be undone.`)) return;
    try {
      await deletePlayerMutation.mutateAsync(id);
    } catch {
      // toast already shown in mutation onError
    }
  }

  if (playersLoading)
    return (
      <div className="text-center text-muted-foreground py-12 text-sm">
        Loading players…
      </div>
    );

  return (
    <div className="flex flex-col gap-3">
      <button
        type="button"
        onClick={() => setShowAdd(!showAdd)}
        data-ocid="add-player-btn"
        className="w-full h-11 rounded-xl font-bold flex items-center gap-2 justify-center text-sm border border-primary/40 text-primary hover:bg-primary/10 transition-colors"
      >
        {showAdd ? <X size={16} /> : <Plus size={16} />}
        {showAdd ? "Cancel" : "Add Player"}
      </button>

      {showAdd && (
        <div className="rounded-2xl p-4 flex flex-col gap-3" style={glassCard}>
          <h3 className="font-bold text-sm text-primary">New Player</h3>
          <InputField
            label="Player Name *"
            id="p-name"
            value={form.name}
            onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
            placeholder="e.g. Yusuf Al-Amin"
          />
          <SelectField
            label="Team *"
            id="p-team"
            options={[{ value: "", label: "Select team…" }, ...teamOptions]}
            value={form.teamId}
            onChange={(v) => setForm((p) => ({ ...p, teamId: v }))}
          />
          <div className="grid grid-cols-2 gap-3">
            <SelectField
              label="Position"
              id="p-pos"
              options={POSITIONS.map((pos) => ({ value: pos, label: pos }))}
              value={form.position}
              onChange={(v) => setForm((p) => ({ ...p, position: v }))}
            />
            <InputField
              label="Jersey #"
              id="p-num"
              type="number"
              min="1"
              max="99"
              value={form.jerseyNumber}
              onChange={(e) =>
                setForm((p) => ({ ...p, jerseyNumber: e.target.value }))
              }
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <InputField
              label="Goals"
              id="p-goals"
              type="number"
              min="0"
              value={form.goals}
              onChange={(e) =>
                setForm((p) => ({ ...p, goals: e.target.value }))
              }
            />
            <InputField
              label="Assists"
              id="p-assists"
              type="number"
              min="0"
              value={form.assists}
              onChange={(e) =>
                setForm((p) => ({ ...p, assists: e.target.value }))
              }
            />
          </div>
          <Button
            onClick={addPlayer}
            disabled={addPlayerMutation.isPending}
            data-ocid="save-player-btn"
            className="h-10 rounded-xl font-bold flex items-center gap-2 justify-center text-sm"
            style={{ background: "oklch(0.58 0.27 24.8)", color: "#020617" }}
          >
            <Check size={14} />
            {addPlayerMutation.isPending ? "Saving…" : "Add Player"}
          </Button>
        </div>
      )}

      {players.map((p) => (
        <div
          key={p.id}
          className="rounded-2xl p-4 flex items-center gap-3"
          style={glassCard}
        >
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
            style={orangeBg}
          >
            {p.emoji}
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-bold text-sm truncate">{p.name}</div>
            <div className="text-xs text-muted-foreground truncate">
              {p.teamName} · {p.position} · #{p.jerseyNumber}
            </div>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0 text-center">
            <div>
              <div className="font-black text-primary text-base leading-none">
                {p.goals}
              </div>
              <div className="text-[10px] text-muted-foreground">G</div>
            </div>
            <div>
              <div className="font-black text-sm leading-none">{p.assists}</div>
              <div className="text-[10px] text-muted-foreground">A</div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => deletePlayer(p.id, p.name)}
            aria-label={`Remove ${p.name}`}
            disabled={deletePlayerMutation.isPending}
            className="p-2 rounded-lg text-destructive/70 hover:text-destructive hover:bg-destructive/10 transition-colors"
            data-ocid={`delete-player-${p.id}`}
          >
            <Trash2 size={15} />
          </button>
        </div>
      ))}
    </div>
  );
}

// ─── News Admin Tab ───────────────────────────────────────────────────────────

function NewsTab() {
  const { data: articles = [], isLoading } = useNews();
  const addNewsMutation = useAddNews();
  const deleteNewsMutation = useDeleteNews();

  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState<NewsForm>({
    title: "",
    excerpt: "",
    category: "Match Report",
    date: new Date().toISOString().split("T")[0],
    emoji: "📰",
  });

  async function addArticle() {
    if (!form.title.trim() || !form.excerpt.trim()) {
      toast.error("Title and excerpt are required");
      return;
    }
    try {
      await addNewsMutation.mutateAsync({
        title: form.title,
        excerpt: form.excerpt,
        category: form.category,
        date: form.date,
        emoji: form.emoji,
      });
      setForm({
        title: "",
        excerpt: "",
        category: "Match Report",
        date: new Date().toISOString().split("T")[0],
        emoji: "📰",
      });
      setShowAdd(false);
    } catch {
      // toast already shown in mutation onError
    }
  }

  async function deleteArticle(id: string, title: string) {
    if (!confirm(`Remove "${title.slice(0, 40)}"? This cannot be undone.`))
      return;
    try {
      await deleteNewsMutation.mutateAsync(id);
    } catch {
      // toast already shown in mutation onError
    }
  }

  if (isLoading)
    return (
      <div className="text-center text-muted-foreground py-12 text-sm">
        Loading news…
      </div>
    );

  return (
    <div className="flex flex-col gap-3">
      <button
        type="button"
        onClick={() => setShowAdd(!showAdd)}
        data-ocid="add-article-btn"
        className="w-full h-11 rounded-xl font-bold flex items-center gap-2 justify-center text-sm border border-primary/40 text-primary hover:bg-primary/10 transition-colors"
      >
        {showAdd ? <X size={16} /> : <Plus size={16} />}
        {showAdd ? "Cancel" : "Add Article"}
      </button>

      {showAdd && (
        <div className="rounded-2xl p-4 flex flex-col gap-3" style={glassCard}>
          <h3 className="font-bold text-sm text-primary">New Article</h3>
          <InputField
            label="Title *"
            id="n-title"
            value={form.title}
            onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
            placeholder="Article headline…"
          />
          <div className="flex flex-col gap-1.5">
            <Label
              htmlFor="n-excerpt"
              className="text-xs font-semibold text-muted-foreground uppercase tracking-wide"
            >
              Excerpt *
            </Label>
            <Textarea
              id="n-excerpt"
              value={form.excerpt}
              rows={3}
              onChange={(e) =>
                setForm((p) => ({ ...p, excerpt: e.target.value }))
              }
              placeholder="Short summary of the article…"
              className="bg-muted/30 border-border/60 focus:border-primary rounded-xl text-sm resize-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <SelectField
              label="Category"
              id="n-cat"
              options={NEWS_CATEGORIES.map((c) => ({ value: c, label: c }))}
              value={form.category}
              onChange={(v) => setForm((p) => ({ ...p, category: v }))}
            />
            <InputField
              label="Emoji"
              id="n-emoji"
              value={form.emoji}
              onChange={(e) =>
                setForm((p) => ({ ...p, emoji: e.target.value }))
              }
              placeholder="📰"
            />
          </div>
          <InputField
            label="Date"
            id="n-date"
            type="date"
            value={form.date}
            onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))}
          />
          <Button
            onClick={addArticle}
            disabled={addNewsMutation.isPending}
            data-ocid="save-article-btn"
            className="h-10 rounded-xl font-bold flex items-center gap-2 justify-center text-sm"
            style={{ background: "oklch(0.58 0.27 24.8)", color: "#020617" }}
          >
            <Check size={14} />
            {addNewsMutation.isPending ? "Publishing…" : "Publish Article"}
          </Button>
        </div>
      )}

      {articles.map((a) => (
        <div
          key={a.id}
          className="rounded-2xl p-4 flex items-start gap-3"
          style={glassCard}
        >
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
            style={orangeBg}
          >
            {a.emoji}
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-bold text-sm leading-snug line-clamp-2">
              {a.title}
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[10px] text-primary font-semibold bg-primary/10 px-2 py-0.5 rounded-full">
                {a.category}
              </span>
              <span className="text-[10px] text-muted-foreground">
                {a.date}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => deleteArticle(a.id, a.title)}
            aria-label={`Remove ${a.title}`}
            disabled={deleteNewsMutation.isPending}
            className="p-2 rounded-lg text-destructive/70 hover:text-destructive hover:bg-destructive/10 transition-colors flex-shrink-0"
            data-ocid={`delete-article-${a.id}`}
          >
            <Trash2 size={15} />
          </button>
        </div>
      ))}
    </div>
  );
}

// ─── Admin Dashboard ──────────────────────────────────────────────────────────

const TABS: { id: AdminTab; label: string; icon: React.ReactNode }[] = [
  { id: "matches", label: "Matches", icon: <Calendar size={16} /> },
  { id: "teams", label: "Teams", icon: <Users size={16} /> },
  { id: "players", label: "Players", icon: <User size={16} /> },
  { id: "news", label: "News", icon: <Newspaper size={16} /> },
];

function AdminDashboard({
  onLogout,
  principal,
}: { onLogout: () => void; principal: string }) {
  const [activeTab, setActiveTab] = useState<AdminTab>("matches");

  return (
    <div className="flex flex-col px-4 py-4 max-w-xl mx-auto gap-4">
      {/* Header bar */}
      <div
        className="rounded-2xl p-4 flex items-center justify-between"
        style={glassCard}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={orangeBg}
          >
            <Shield size={18} style={{ color: "#020617" }} />
          </div>
          <div>
            <div className="text-xs font-bold text-primary uppercase tracking-wide">
              Admin Panel
            </div>
            <div className="text-xs text-muted-foreground font-mono truncate max-w-[150px]">
              {principal.slice(0, 16)}…
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="text-[10px] px-2 py-0.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block mr-1 animate-pulse" />
            Active
          </Badge>
          <button
            type="button"
            onClick={onLogout}
            data-ocid="admin-logout-btn"
            aria-label="Sign out"
            className="p-2 rounded-xl text-destructive/70 hover:text-destructive hover:bg-destructive/10 transition-colors"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>

      {/* Tab bar */}
      <div
        className="grid grid-cols-4 gap-1 p-1 rounded-2xl"
        style={{
          background: "rgba(30,41,59,0.7)",
          border: "1px solid rgba(255,107,0,0.12)",
        }}
      >
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            data-ocid={`admin-tab-${tab.id}`}
            className={`flex flex-col items-center gap-1 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === tab.id
                ? "text-[#020617]"
                : "text-muted-foreground hover:text-foreground"
            }`}
            style={
              activeTab === tab.id
                ? { background: "oklch(0.58 0.27 24.8)" }
                : {}
            }
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div>
        {activeTab === "matches" && <MatchesTab />}
        {activeTab === "teams" && <TeamsTab />}
        {activeTab === "players" && <PlayersTab />}
        {activeTab === "news" && <NewsTab />}
      </div>
    </div>
  );
}

// ─── Root export ──────────────────────────────────────────────────────────────

export default function Admin() {
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const isLoggedIn = loginStatus === "success" && !!identity;
  const isLoggingIn = loginStatus === "logging-in";
  const principal = identity?.getPrincipal().toText() ?? "";

  if (!isLoggedIn) {
    return <LoginWall onLogin={login} isLoggingIn={isLoggingIn} />;
  }

  return <AdminDashboard onLogout={clear} principal={principal} />;
}
