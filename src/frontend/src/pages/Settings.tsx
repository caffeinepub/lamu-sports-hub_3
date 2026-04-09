import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import {
  Bell,
  BellRing,
  Globe,
  Heart,
  Info,
  LogIn,
  LogOut,
  Monitor,
  Moon,
  Share2,
  Shield,
  Smartphone,
  Sun,
  Trash2,
  User,
  UserCheck,
  Users,
  Volume2,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  usePlayers,
  useTeams,
  useUnfollowPlayer,
  useUnfollowTeam,
  useUpdateUserProfile,
  useUserProfile,
} from "../hooks/use-backend";

// ── localStorage keys ─────────────────────────────────────────────────────────
const THEME_KEY = "lsh-theme";
const ALERTS_KEY = "lsh-alerts";
const SOUNDS_KEY = "lsh-sounds";

type Theme = "dark" | "light" | "system";

interface AlertSettings {
  matchAlerts: boolean;
  goalAlerts: boolean;
  lineupAlerts: boolean;
  newsUpdates: boolean;
  mvpVoteReminders: boolean;
}

interface SoundSettings {
  soundEnabled: boolean;
  matchStartSound: boolean;
  goalSound: boolean;
  newsSound: boolean;
}

function loadJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  if (theme === "dark") {
    root.classList.add("dark");
  } else if (theme === "light") {
    root.classList.remove("dark");
  } else {
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;
    root.classList.toggle("dark", prefersDark);
  }
}

// ── Shared section card ───────────────────────────────────────────────────────
function Section({
  icon,
  title,
  accent = false,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  accent?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className="rounded-2xl border overflow-hidden"
      style={{
        background: "oklch(var(--card) / 0.55)",
        backdropFilter: "blur(12px)",
        borderColor: accent
          ? "oklch(var(--primary) / 0.35)"
          : "oklch(var(--border) / 0.5)",
      }}
    >
      <div
        className="flex items-center gap-2 px-4 py-3"
        style={{
          background: accent
            ? "oklch(var(--primary) / 0.12)"
            : "oklch(var(--muted) / 0.3)",
          borderBottom: `1px solid ${accent ? "oklch(var(--primary) / 0.2)" : "oklch(var(--border) / 0.35)"}`,
        }}
      >
        <span
          style={{ color: "oklch(var(--primary))" }}
          className="flex-shrink-0"
        >
          {icon}
        </span>
        <h2 className="font-display font-semibold text-sm tracking-wide text-foreground">
          {title}
        </h2>
      </div>
      <div className="px-4 py-4 space-y-3">{children}</div>
    </div>
  );
}

// ── Toggle row ────────────────────────────────────────────────────────────────
function ToggleRow({
  label,
  description,
  checked,
  onCheckedChange,
  ocid,
}: {
  label: string;
  description?: string;
  checked: boolean;
  onCheckedChange: (v: boolean) => void;
  ocid?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3 py-1">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground truncate">{label}</p>
        {description && (
          <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
            {description}
          </p>
        )}
      </div>
      <Switch
        checked={checked}
        onCheckedChange={onCheckedChange}
        data-ocid={ocid}
        className="flex-shrink-0"
      />
    </div>
  );
}

// ── Theme button ──────────────────────────────────────────────────────────────
function ThemeBtn({
  value,
  current,
  icon,
  label,
  onClick,
}: {
  value: Theme;
  current: Theme;
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  const active = value === current;
  return (
    <button
      type="button"
      onClick={onClick}
      data-ocid={`settings-theme-${value}`}
      className="flex-1 flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl border transition-all duration-200 text-xs font-medium"
      style={{
        background: active
          ? "oklch(var(--primary) / 0.15)"
          : "oklch(var(--muted) / 0.3)",
        borderColor: active
          ? "oklch(var(--primary) / 0.5)"
          : "oklch(var(--border) / 0.4)",
        color: active
          ? "oklch(var(--primary))"
          : "oklch(var(--muted-foreground))",
      }}
    >
      {icon}
      {label}
    </button>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function Settings() {
  const { loginStatus, login, clear, identity } = useInternetIdentity();
  const isLoggedIn = loginStatus === "success";
  const principal = identity?.getPrincipal().toString();

  // Profile
  const { data: profile, isLoading: profileLoading } = useUserProfile();
  const updateProfile = useUpdateUserProfile();
  const unfollowTeam = useUnfollowTeam();
  const unfollowPlayer = useUnfollowPlayer();

  const { data: teams = [] } = useTeams();
  const { data: players = [] } = usePlayers();

  const [displayName, setDisplayName] = useState("");
  const [area, setArea] = useState("");
  const [teamAffiliation, setTeamAffiliation] = useState("");

  useEffect(() => {
    if (profile) {
      setDisplayName(profile.displayName);
      setArea(profile.areaOfResidence);
      setTeamAffiliation(profile.teamAffiliation);
    }
  }, [profile]);

  // Theme
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem(THEME_KEY) as Theme) ?? "dark",
  );

  const handleThemeChange = (t: Theme) => {
    setTheme(t);
    localStorage.setItem(THEME_KEY, t);
    applyTheme(t);
  };

  // Alerts
  const [alerts, setAlerts] = useState<AlertSettings>(() =>
    loadJSON<AlertSettings>(ALERTS_KEY, {
      matchAlerts: true,
      goalAlerts: true,
      lineupAlerts: false,
      newsUpdates: true,
      mvpVoteReminders: false,
    }),
  );

  const setAlert = (key: keyof AlertSettings, val: boolean) => {
    const next = { ...alerts, [key]: val };
    setAlerts(next);
    localStorage.setItem(ALERTS_KEY, JSON.stringify(next));
  };

  // Sounds
  const [sounds, setSounds] = useState<SoundSettings>(() =>
    loadJSON<SoundSettings>(SOUNDS_KEY, {
      soundEnabled: false,
      matchStartSound: false,
      goalSound: false,
      newsSound: false,
    }),
  );

  const setSound = (key: keyof SoundSettings, val: boolean) => {
    const next = { ...sounds, [key]: val };
    setSounds(next);
    localStorage.setItem(SOUNDS_KEY, JSON.stringify(next));
  };

  const handleShareApp = () => {
    const url = window.location.origin;
    const shareData = {
      title: "Lamu Sports Hub",
      text: "Follow Lamu Premier League live — scores, standings, players & more 🏆",
      url,
    };
    if (navigator.share) {
      navigator.share(shareData).catch(() => {});
    } else {
      navigator.clipboard
        .writeText(`${shareData.text}\n${url}`)
        .then(() => {})
        .catch(() => {});
    }
  };

  const handleSaveProfile = () => {
    updateProfile.mutate({
      displayName,
      areaOfResidence: area,
      teamAffiliation,
    });
  };

  // Resolve following names
  const favouriteTeam = teams.find(
    (t) => Number(t.id) === profile?.favouriteTeamId,
  );
  const followedTeams = teams.filter((t) =>
    profile?.followedTeamIds.includes(Number(t.id)),
  );
  const followedPlayers = players.filter((p) =>
    profile?.followedPlayerIds.includes(Number(p.id)),
  );

  return (
    <div className="px-3 pt-4 pb-24 max-w-lg mx-auto space-y-4">
      {/* Header */}
      <div className="mb-1">
        <h1
          className="font-display text-xl font-bold tracking-tight"
          style={{ color: "oklch(var(--foreground))" }}
        >
          Settings
        </h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          Personalise your LSH experience
        </p>
      </div>

      {/* ── Personal Details ─────────────────────────────────────── */}
      <Section icon={<User size={15} />} title="Personal Details" accent>
        {isLoggedIn ? (
          profileLoading ? (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-9 rounded-lg animate-pulse"
                  style={{ background: "oklch(var(--muted) / 0.5)" }}
                />
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              <div>
                <Label className="text-xs text-muted-foreground">
                  Display name
                </Label>
                <Input
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Your name…"
                  className="mt-1 h-9 text-sm"
                  data-ocid="settings-display-name"
                />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">
                  Area / Location
                </Label>
                <Input
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  placeholder="e.g. Lamu Town, Shela…"
                  className="mt-1 h-9 text-sm"
                  data-ocid="settings-area"
                />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">
                  Team affiliation
                </Label>
                <Input
                  value={teamAffiliation}
                  onChange={(e) => setTeamAffiliation(e.target.value)}
                  placeholder="e.g. Lamu Queens FC…"
                  className="mt-1 h-9 text-sm"
                  data-ocid="settings-team-affiliation"
                />
              </div>
              <Button
                size="sm"
                onClick={handleSaveProfile}
                disabled={updateProfile.isPending}
                className="w-full font-semibold"
                data-ocid="settings-save-profile"
              >
                {updateProfile.isPending ? "Saving…" : "Save changes"}
              </Button>
            </div>
          )
        ) : (
          <div className="space-y-3 py-1">
            <p className="text-xs text-muted-foreground leading-relaxed">
              Sign in with Internet Identity to save your profile and sync
              preferences across all your devices.
            </p>
            <Button
              size="sm"
              onClick={() => login()}
              className="w-full gap-2 font-semibold"
              data-ocid="settings-login"
            >
              <LogIn size={14} />
              Sign in with Internet Identity
            </Button>
          </div>
        )}
      </Section>

      {/* ── Favourite & Following ─────────────────────────────────── */}
      <Section icon={<Heart size={15} />} title="Favourite & Following">
        {!isLoggedIn ? (
          <p className="text-xs text-muted-foreground py-1">
            Sign in to see your favourites and followed teams/players.
          </p>
        ) : (
          <div className="space-y-3">
            {/* Favourite team */}
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                Favourite Team
              </p>
              {favouriteTeam ? (
                <div
                  className="flex items-center gap-2 rounded-xl p-2.5"
                  style={{ background: "oklch(var(--primary) / 0.08)" }}
                  data-ocid="settings-favourite-team"
                >
                  <span className="text-xl">{favouriteTeam.emoji}</span>
                  <span className="flex-1 text-sm font-medium text-foreground truncate">
                    {favouriteTeam.name}
                  </span>
                  <Badge
                    variant="secondary"
                    className="text-[10px] px-1.5 py-0.5"
                    style={{
                      background: "oklch(var(--primary) / 0.15)",
                      color: "oklch(var(--primary))",
                    }}
                  >
                    ❤️ Fav
                  </Badge>
                </div>
              ) : (
                <p className="text-xs text-muted-foreground italic">
                  No favourite team set — tap a team on the Teams page to add
                  one.
                </p>
              )}
            </div>

            <Separator style={{ opacity: 0.3 }} />

            {/* Followed teams */}
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                Following Teams ({followedTeams.length})
              </p>
              {followedTeams.length === 0 ? (
                <p className="text-xs text-muted-foreground italic">
                  Not following any teams yet.
                </p>
              ) : (
                <div className="space-y-1.5">
                  {followedTeams.map((t) => (
                    <div
                      key={t.id}
                      className="flex items-center gap-2 rounded-xl p-2"
                      style={{ background: "oklch(var(--muted) / 0.3)" }}
                      data-ocid="settings-followed-team"
                    >
                      <span className="text-lg">{t.emoji}</span>
                      <span className="flex-1 text-sm text-foreground truncate min-w-0">
                        {t.name}
                      </span>
                      <button
                        type="button"
                        onClick={() => unfollowTeam.mutate(t.id)}
                        aria-label={`Unfollow ${t.name}`}
                        className="p-1 rounded-lg transition-colors hover:bg-destructive/20"
                        style={{ color: "oklch(var(--muted-foreground))" }}
                        data-ocid="settings-unfollow-team"
                      >
                        <X size={13} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Separator style={{ opacity: 0.3 }} />

            {/* Followed players */}
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                Following Players ({followedPlayers.length})
              </p>
              {followedPlayers.length === 0 ? (
                <p className="text-xs text-muted-foreground italic">
                  Not following any players yet.
                </p>
              ) : (
                <div className="space-y-1.5">
                  {followedPlayers.map((p) => (
                    <div
                      key={p.id}
                      className="flex items-center gap-2 rounded-xl p-2"
                      style={{ background: "oklch(var(--muted) / 0.3)" }}
                      data-ocid="settings-followed-player"
                    >
                      <span className="text-lg">{p.emoji}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-foreground truncate">
                          {p.name}
                        </p>
                        <p className="text-[11px] text-muted-foreground truncate">
                          {p.teamName} · {p.position}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => unfollowPlayer.mutate(p.id)}
                        aria-label={`Unfollow ${p.name}`}
                        className="p-1 rounded-lg transition-colors hover:bg-destructive/20"
                        style={{ color: "oklch(var(--muted-foreground))" }}
                        data-ocid="settings-unfollow-player"
                      >
                        <X size={13} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </Section>

      {/* ── Theme ─────────────────────────────────────────────────── */}
      <Section icon={<Monitor size={15} />} title="Theme">
        <div className="flex gap-2" data-ocid="settings-theme-selector">
          <ThemeBtn
            value="dark"
            current={theme}
            icon={<Moon size={16} />}
            label="Dark"
            onClick={() => handleThemeChange("dark")}
          />
          <ThemeBtn
            value="light"
            current={theme}
            icon={<Sun size={16} />}
            label="Light"
            onClick={() => handleThemeChange("light")}
          />
          <ThemeBtn
            value="system"
            current={theme}
            icon={<Smartphone size={16} />}
            label="System"
            onClick={() => handleThemeChange("system")}
          />
        </div>
        <p className="text-[11px] text-muted-foreground text-center">
          App uses dark mode by default — island night theme
        </p>
      </Section>

      {/* ── Smart Alerts ──────────────────────────────────────────── */}
      <Section icon={<Bell size={15} />} title="Smart Alerts">
        <ToggleRow
          label="Match Alerts"
          description="Upcoming match reminders and live score notifications"
          checked={alerts.matchAlerts}
          onCheckedChange={(v) => setAlert("matchAlerts", v)}
          ocid="settings-match-alerts"
        />
        <Separator style={{ opacity: 0.25 }} />
        <ToggleRow
          label="Goal Alerts"
          description="Instant alerts when a goal is scored"
          checked={alerts.goalAlerts}
          onCheckedChange={(v) => setAlert("goalAlerts", v)}
          ocid="settings-goal-alerts"
        />
        <Separator style={{ opacity: 0.25 }} />
        <ToggleRow
          label="Lineup Alerts"
          description="Get notified when team lineups are confirmed"
          checked={alerts.lineupAlerts}
          onCheckedChange={(v) => setAlert("lineupAlerts", v)}
          ocid="settings-lineup-alerts"
        />
        <Separator style={{ opacity: 0.25 }} />
        <ToggleRow
          label="News Updates"
          description="Latest news and announcements from LSH officials"
          checked={alerts.newsUpdates}
          onCheckedChange={(v) => setAlert("newsUpdates", v)}
          ocid="settings-news-updates"
        />
        <Separator style={{ opacity: 0.25 }} />
        <ToggleRow
          label="MVP Vote Reminders"
          description="Reminders to vote for the weekly Match MVP"
          checked={alerts.mvpVoteReminders}
          onCheckedChange={(v) => setAlert("mvpVoteReminders", v)}
          ocid="settings-mvp-reminders"
        />
      </Section>

      {/* ── Notification Sounds ───────────────────────────────────── */}
      <Section icon={<Volume2 size={15} />} title="Notification Sounds">
        <ToggleRow
          label="Sound Alerts"
          description="Enable all notification sounds"
          checked={sounds.soundEnabled}
          onCheckedChange={(v) => setSound("soundEnabled", v)}
          ocid="settings-sound-enabled"
        />
        <Separator style={{ opacity: 0.25 }} />
        <ToggleRow
          label="Match Start Alert"
          description="Play sound when a match kicks off"
          checked={sounds.matchStartSound}
          onCheckedChange={(v) => setSound("matchStartSound", v)}
          ocid="settings-match-start-sound"
        />
        <Separator style={{ opacity: 0.25 }} />
        <ToggleRow
          label="Goal Alerts"
          description="Sound when a goal is scored"
          checked={sounds.goalSound}
          onCheckedChange={(v) => setSound("goalSound", v)}
          ocid="settings-goal-sound"
        />
        <Separator style={{ opacity: 0.25 }} />
        <ToggleRow
          label="News Alerts"
          description="Sound for new official announcements"
          checked={sounds.newsSound}
          onCheckedChange={(v) => setSound("newsSound", v)}
          ocid="settings-news-sound"
        />
      </Section>

      {/* ── Account & Security ────────────────────────────────────── */}
      <Section icon={<Shield size={15} />} title="Account & Security">
        {isLoggedIn ? (
          <div className="space-y-3">
            <div
              className="rounded-xl p-3"
              style={{ background: "oklch(var(--muted) / 0.35)" }}
            >
              <p className="text-xs font-semibold text-muted-foreground mb-1">
                Internet Identity Principal
              </p>
              <p
                className="text-[11px] font-mono break-all leading-relaxed"
                style={{ color: "oklch(var(--foreground) / 0.7)" }}
                data-ocid="settings-principal"
              >
                {principal ?? "Loading…"}
              </p>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => clear()}
                className="flex-1 gap-2 font-medium"
                data-ocid="settings-logout"
              >
                <LogOut size={13} />
                Sign out
              </Button>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 gap-2 font-medium border-destructive/40 text-destructive hover:bg-destructive/10"
                    data-ocid="settings-delete-account-trigger"
                  >
                    <Trash2 size={13} />
                    Clear account data
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent
                  style={{
                    background: "oklch(var(--card))",
                    borderColor: "oklch(var(--border) / 0.6)",
                  }}
                >
                  <AlertDialogHeader>
                    <AlertDialogTitle className="font-display">
                      Sign out & clear account data?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This will sign you out and clear your local preferences
                      and cached data on this device. Your profile, match
                      history, and on-chain records are preserved and will be
                      available when you sign in again. Full account deletion is
                      not yet available.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel data-ocid="settings-delete-cancel">
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      data-ocid="settings-delete-confirm"
                      onClick={() => clear()}
                    >
                      Sign out & clear data
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground leading-relaxed">
              Sign in to manage your account and security settings.
            </p>
            <Button
              size="sm"
              onClick={() => login()}
              className="w-full gap-2 font-semibold"
              data-ocid="settings-login-security"
            >
              <LogIn size={14} />
              Sign in with Internet Identity
            </Button>
          </div>
        )}
      </Section>

      {/* ── Share App ─────────────────────────────────────────────── */}
      <Section icon={<Share2 size={15} />} title="Share Lamu Sports Hub">
        <div className="flex flex-col items-center gap-3 py-1">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl"
            style={{ background: "oklch(var(--primary) / 0.15)" }}
          >
            ⚽
          </div>
          <div className="text-center">
            <p className="text-sm font-semibold text-foreground">
              Invite your friends
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Share the app link with fellow fans and supporters
            </p>
          </div>
          <Button
            size="sm"
            onClick={handleShareApp}
            className="w-full gap-2 font-semibold"
            data-ocid="settings-share-app"
          >
            <Share2 size={14} />
            Share Lamu Sports Hub
          </Button>
        </div>
      </Section>

      {/* ── App Info ──────────────────────────────────────────────── */}
      <Section icon={<Info size={15} />} title="App Info">
        <div className="space-y-2">
          {[
            { label: "App", value: "Lamu Sports Hub" },
            { label: "Version", value: "1.0.0 (Phase 1 MVP)" },
            { label: "Season", value: "2025/26" },
            { label: "Tournament", value: "Lamu Premier League" },
            { label: "Developer", value: "Said Joseph" },
          ].map(({ label, value }) => (
            <div key={label} className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">{label}</span>
              <span className="text-xs font-medium text-foreground text-right max-w-[60%] truncate">
                {value}
              </span>
            </div>
          ))}
        </div>

        <Separator style={{ opacity: 0.3 }} />

        <div className="flex justify-center gap-4 pt-1">
          {[
            { icon: <Users size={14} />, label: "Community" },
            { icon: <UserCheck size={14} />, label: "Officials" },
            { icon: <BellRing size={14} />, label: "Alerts" },
          ].map(({ icon, label }) => (
            <div
              key={label}
              className="flex flex-col items-center gap-1 text-[10px] text-muted-foreground"
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{
                  background: "oklch(var(--primary) / 0.1)",
                  color: "oklch(var(--primary))",
                }}
              >
                {icon}
              </div>
              {label}
            </div>
          ))}
        </div>

        <p
          className="text-center text-[11px] font-medium pt-1"
          style={{ color: "oklch(var(--primary))" }}
        >
          🏝️ Island Pride. Island Football.
        </p>
      </Section>

      {/* ── Branding footer ───────────────────────────────────────── */}
      <p className="text-center text-[10px] text-muted-foreground py-2">
        © {new Date().getFullYear()}.{" "}
        <a
          href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
          target="_blank"
          rel="noreferrer"
          className="underline underline-offset-2 hover:text-foreground transition-colors"
        >
          Built with love using caffeine.ai
        </a>
      </p>
    </div>
  );
}
