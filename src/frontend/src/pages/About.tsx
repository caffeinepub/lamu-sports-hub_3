import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  ChevronDown,
  Facebook,
  Info,
  Instagram,
  Lock,
  Mail,
  MessageCircle,
  Radio,
  Share2,
  Shield,
  Twitter,
  Users,
} from "lucide-react";
import { useState } from "react";

// ─── Data ───────────────────────────────────────────────────────────────────

const SOCIAL_LINKS = [
  {
    icon: <MessageCircle size={18} />,
    label: "WhatsApp",
    value: "+254 705 434 375",
    href: "https://wa.me/254705434375",
    color: "oklch(0.65 0.18 142)",
  },
  {
    icon: <Instagram size={18} />,
    label: "Instagram",
    value: "@lamusportshub",
    href: "https://instagram.com/lamusportshub",
    color: "oklch(0.65 0.18 330)",
  },
  {
    icon: <Facebook size={18} />,
    label: "Facebook",
    value: "/lamusportshub",
    href: "https://facebook.com/lamusportshub",
    color: "oklch(0.55 0.18 250)",
  },
  {
    icon: <Twitter size={18} />,
    label: "X (Twitter)",
    value: "@LamuSportsHub",
    href: "https://twitter.com/LamuSportsHub",
    color: "oklch(0.7 0 0)",
  },
];

const HISTORY = [
  {
    year: "January 2025",
    icon: "💡",
    title: "The Vision",
    desc: "Said Joseph envisions a digital platform to connect the fragmented youth football scene in Lamu, where talent goes unrecognised and records are kept on paper.",
  },
  {
    year: "April 2025",
    icon: "🏝️",
    title: "Lamu Sports Hub Founded",
    desc: "LSH officially founded with a mission to digitise, celebrate, and develop Lamu youth sports. The first committee is formed with four founding officials.",
  },
  {
    year: "July 2025",
    icon: "⚽",
    title: "First Team Registrations",
    desc: "Eight teams from across the island — Shela, Hindi, Mkunguni, Langoni, Mkomani, Lamu Town, Matondoni, and Kipungani — register for the inaugural season.",
  },
  {
    year: "September 2025",
    icon: "🟡",
    title: "Referees & Officials Appointed",
    desc: "Licensed referees are vetted and appointed. A transparent officiating structure is established, bringing credibility to every match.",
  },
  {
    year: "October 2025",
    icon: "🚀",
    title: "Season 2025/26 Kicks Off",
    desc: "The inaugural Lamu Premier League season begins. Matchdays are held across Twaif, Mala, Sports Ground, and the Carpet Field.",
  },
  {
    year: "January 2026",
    icon: "📱",
    title: "Digital Platform Launches",
    desc: "The LSH app goes live with real-time standings, player profiles, match results, leaderboards, and fan engagement features.",
  },
  {
    year: "March 2026",
    icon: "🌍",
    title: "Community Grows",
    desc: "Over 200 registered players, 8 teams, and hundreds of fans. The platform becomes the heartbeat of Lamu football.",
  },
  {
    year: "Future",
    icon: "🌟",
    title: "What's Next",
    desc: "Phase 2 brings Under-18 tournaments, talent scouting, sponsor integrations, and multi-sport expansion. Lamu youth sport is only getting started.",
    isFuture: true,
  },
];

const PITCHES = [
  {
    name: "Twaif Ground",
    area: "Twaif, Lamu Island",
    surface: "Natural grass",
    capacity: 500,
  },
  {
    name: "Mala Ground",
    area: "Mala, Lamu Island",
    surface: "Natural grass",
    capacity: 300,
  },
  {
    name: "Sports Ground",
    area: "Lamu Town, Lamu Island",
    surface: "Natural grass",
    capacity: 800,
  },
  {
    name: "Carpet Field",
    area: "Lamu Town, Lamu Island",
    surface: "Artificial turf",
    capacity: 200,
  },
];

const SECURITY_ITEMS = [
  {
    icon: "🔗",
    title: "On-chain storage",
    desc: "All data (teams, players, matches, news) is stored on the Internet Computer blockchain — it cannot be deleted by anyone except authorised admins.",
  },
  {
    icon: "🔐",
    title: "Internet Identity login",
    desc: "Only users with a verified Internet Identity can write data. Anonymous users can only read public info.",
  },
  {
    icon: "👮",
    title: "Admin-only control",
    desc: "Only accounts with the Admin role can create news, modify matches, manage users and teams. Fans and players cannot touch core data.",
  },
];

const SECURITY_TIPS: { n: number; text: string }[] = [
  { n: 1, text: "Never share your Internet Identity with anyone." },
  { n: 2, text: "Only assign the Admin role to trusted people." },
  {
    n: 3,
    text: "If you notice unauthorised changes, go to Admin Panel → Users and remove that person's admin access.",
  },
  {
    n: 4,
    text: "Use the Suggestions box to report any security concerns to officials.",
  },
];

const TERMS = [
  {
    title: "1. Eligibility",
    text: "Participants must be registered residents of Lamu County. Players must comply with age-group requirements as determined by LSH officials.",
  },
  {
    title: "2. Fair Play",
    text: "All players, coaches, and officials are expected to uphold the spirit of fair play and sportsmanship. Any form of abuse, cheating, or unsportsmanlike conduct will result in disciplinary action.",
  },
  {
    title: "3. Registration",
    text: "Player registration must be approved by LSH officials. Providing false information during registration is grounds for immediate disqualification.",
  },
  {
    title: "4. Liability",
    text: "LSH is not liable for any injuries, loss, or damage sustained during matches or training. All participants play at their own risk.",
  },
  {
    title: "5. Disputes",
    text: "All disputes must be reported in writing to LSH officials within 48 hours. Decisions by the LSH Committee are final.",
  },
  {
    title: "6. Conduct",
    text: "Teams are responsible for the conduct of their players and supporters. Teams may be penalised for fan misconduct at official events.",
  },
  {
    title: "7. Data Use",
    text: "By registering, you consent to LSH collecting and using your information for league management purposes as outlined in our Privacy Policy.",
  },
];

const PRIVACY = [
  {
    title: "Data We Collect",
    text: "We collect your name, phone number, area of residence, team affiliation, and match performance statistics.",
  },
  {
    title: "How We Use It",
    text: "Your data is used solely for league management — publishing standings, leaderboards, match fixtures, and player profiles. We do not collect payment information.",
  },
  {
    title: "Third-Party Sharing",
    text: "We do not sell or share your personal data with third parties. Aggregate statistics may be shared with county sports authorities for reporting purposes.",
  },
  {
    title: "Data Retention",
    text: "Your data is retained for the duration of your registration. You may request deletion by contacting lamusportshub@gmail.com.",
  },
  {
    title: "Your Rights",
    text: "You have the right to access, correct, or request deletion of your personal data at any time.",
  },
];

// ─── Sub-components ────────────────────────────────────────────────────────

function SectionHeading({
  icon,
  label,
}: { icon: React.ReactNode; label: string }) {
  return (
    <h2 className="font-display text-base font-bold text-foreground mb-3 flex items-center gap-2">
      {icon}
      {label}
    </h2>
  );
}

function GlassCard({
  children,
  className = "",
}: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`rounded-2xl border p-4 ${className}`}
      style={{
        background: "oklch(var(--card) / 0.5)",
        borderColor: "oklch(var(--border) / 0.4)",
      }}
    >
      {children}
    </div>
  );
}

function AccordionItem({ title, text }: { title: string; text: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="border-b last:border-0"
      style={{ borderColor: "oklch(var(--border) / 0.3)" }}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between py-3 text-left gap-2"
        aria-expanded={open}
      >
        <span className="text-sm font-semibold text-foreground">{title}</span>
        <ChevronDown
          size={14}
          className="shrink-0 text-muted-foreground transition-transform duration-200"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
        />
      </button>
      {open && (
        <p className="text-xs text-muted-foreground pb-3 leading-relaxed">
          {text}
        </p>
      )}
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────

export default function About() {
  const handleShare = () => {
    const shareData = {
      title: "Lamu Sports Hub",
      text: "🏝️ The official digital platform for football in Lamu County, Kenya. Live scores, standings, teams & more!",
      url: window.location.origin,
    };
    if (navigator.share) {
      navigator.share(shareData);
    } else {
      navigator.clipboard.writeText(`${shareData.text}\n${shareData.url}`);
    }
  };

  return (
    <div className="px-4 pt-4 pb-24 max-w-lg mx-auto space-y-6">
      {/* ── Hero ── */}
      <div
        className="rounded-2xl p-6 text-center relative overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, oklch(var(--primary) / 0.18) 0%, oklch(var(--secondary) / 0.08) 100%)",
          border: "1px solid oklch(var(--primary) / 0.25)",
        }}
        data-ocid="about-hero"
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at 70% 20%, oklch(var(--primary) / 0.12) 0%, transparent 60%)",
          }}
        />
        <div className="relative">
          <div className="text-5xl mb-3">🏝️</div>
          <h1 className="font-display text-2xl font-bold text-foreground">
            Lamu Sports Hub
          </h1>
          <p
            className="text-sm font-semibold mt-1"
            style={{ color: "oklch(var(--primary))" }}
          >
            Island Pride. Island Football.
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            App v1.0.0 — Phase 1 MVP · Season 2025/26
          </p>
          <div className="flex items-center justify-center gap-2 mt-3">
            <Badge variant="secondary" className="text-xs">
              v1.0.0
            </Badge>
            <Badge variant="secondary" className="text-xs">
              2025/26
            </Badge>
            <Badge variant="secondary" className="text-xs">
              FKF Lamu
            </Badge>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={handleShare}
            className="mt-4 gap-2 text-xs"
            data-ocid="share-app-btn"
          >
            <Share2 size={13} />
            Share LSH
          </Button>
        </div>
      </div>

      {/* ── About LSH ── */}
      <GlassCard>
        <div className="flex items-center gap-2 mb-2">
          <Info size={15} style={{ color: "oklch(var(--primary))" }} />
          <h2 className="font-display font-bold text-sm text-foreground">
            About LSH
          </h2>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Lamu Sports Hub (LSH) is the official digital platform for managing
          and celebrating football in Lamu County, Kenya. We connect players,
          teams, coaches, referees, and fans in one place — bringing island
          pride to the digital age. The platform tracks the FKF Lamu County
          League and Lamu Premier League with live scores, standings, team
          directories, player profiles, and fan engagement.
        </p>
      </GlassCard>

      {/* ── Developer ── */}
      <GlassCard>
        <div className="flex items-center gap-4">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold font-display shrink-0"
            style={{
              background: "oklch(var(--primary) / 0.15)",
              color: "oklch(var(--primary))",
            }}
          >
            SJ
          </div>
          <div>
            <p className="font-semibold text-sm text-foreground">Said Joseph</p>
            <p className="text-xs text-muted-foreground">
              Founder &amp; Lead Developer
            </p>
            <p className="text-xs text-muted-foreground/70 italic mt-0.5">
              "I learned all about life in football ⚽"
            </p>
          </div>
        </div>
      </GlassCard>

      {/* ── History Timeline ── */}
      <div>
        <SectionHeading
          icon={<Info size={16} style={{ color: "oklch(var(--primary))" }} />}
          label="Our History"
        />
        <div className="space-y-0">
          {HISTORY.map((h, i) => (
            <div key={h.year} className="flex gap-3">
              <div className="shrink-0 flex flex-col items-center">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-base mt-0.5"
                  style={{
                    background: h.isFuture
                      ? "oklch(0.44 0.19 257 / 0.15)"
                      : "oklch(var(--primary) / 0.12)",
                  }}
                >
                  {h.icon}
                </div>
                {i < HISTORY.length - 1 && (
                  <div
                    className="w-0.5 flex-1 mt-1 min-h-4"
                    style={{
                      background: h.isFuture
                        ? "oklch(0.44 0.19 257 / 0.3)"
                        : "oklch(var(--border) / 0.4)",
                    }}
                  />
                )}
              </div>
              <div className="pb-4 pt-0.5">
                <p
                  className="text-[10px] font-semibold uppercase tracking-wider"
                  style={{
                    color: h.isFuture
                      ? "oklch(0.44 0.19 257)"
                      : "oklch(var(--primary))",
                  }}
                >
                  {h.year}
                </p>
                <p className="font-semibold text-sm text-foreground mt-0.5">
                  {h.title}
                </p>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  {h.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Separator style={{ background: "oklch(var(--border) / 0.35)" }} />

      {/* ── Under-18 League ── */}
      <div
        className="rounded-2xl p-4 border"
        style={{
          background: "oklch(0.52 0.18 142 / 0.07)",
          borderColor: "oklch(0.52 0.18 142 / 0.3)",
        }}
      >
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xl">🌟</span>
          <h2 className="font-display font-bold text-sm text-foreground">
            Under-18 League
          </h2>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">
          The LSH Under-18 League runs parallel to the senior league. Youth
          teams from all areas of Lamu Island are welcome to register. We
          believe in nurturing young talent and giving every child a platform to
          shine.
        </p>
        <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
          Contact officials to register a youth team.{" "}
          <a
            href="https://wa.me/254705434375"
            className="font-semibold"
            style={{ color: "oklch(0.52 0.18 142)" }}
          >
            WhatsApp: +254 705 434 375
          </a>
        </p>
      </div>

      {/* ── Pitches & Grounds ── */}
      <div>
        <SectionHeading icon={<span>⚽</span>} label="Pitches & Grounds" />
        <div className="space-y-2">
          {PITCHES.map((p, i) => (
            <div
              key={p.name}
              className="flex items-center gap-3 p-3 rounded-xl border"
              style={{
                background: "oklch(var(--card) / 0.4)",
                borderColor: "oklch(var(--border) / 0.3)",
              }}
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm font-display shrink-0"
                style={{
                  background: "oklch(var(--primary) / 0.12)",
                  color: "oklch(var(--primary))",
                }}
              >
                {i + 1}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-foreground">
                  {p.name}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {p.area}
                </p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-[10px] text-muted-foreground">{p.surface}</p>
                <p
                  className="text-[10px] font-semibold"
                  style={{ color: "oklch(var(--primary))" }}
                >
                  Cap: {p.capacity.toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Separator style={{ background: "oklch(var(--border) / 0.35)" }} />

      {/* ── LSH Channels ── */}
      <div>
        <SectionHeading
          icon={<Users size={16} style={{ color: "oklch(var(--primary))" }} />}
          label="LSH Channels"
        />
        <div className="space-y-2">
          {SOCIAL_LINKS.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-3 rounded-xl border transition-colors"
              style={{
                background: "oklch(var(--card) / 0.4)",
                borderColor: "oklch(var(--border) / 0.3)",
                color: "oklch(var(--foreground))",
              }}
              data-ocid={`social-link-${s.label.toLowerCase().replace(/\s/g, "-")}`}
            >
              <span style={{ color: s.color }}>{s.icon}</span>
              <span className="text-sm font-medium">{s.label}</span>
              <span className="ml-auto text-xs text-muted-foreground">
                {s.value}
              </span>
            </a>
          ))}
          <div
            className="flex items-center gap-3 p-3 rounded-xl border"
            style={{
              background: "oklch(var(--primary) / 0.06)",
              borderColor: "oklch(var(--primary) / 0.2)",
            }}
          >
            <Radio size={18} style={{ color: "oklch(var(--primary))" }} />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground">
                Radio Lamu FM
              </p>
              <p className="text-xs text-muted-foreground">
                91.1 MHz · 24/7 Community Radio
              </p>
            </div>
            <Badge
              variant="outline"
              className="text-[10px] h-4 px-1.5 shrink-0"
              style={{
                borderColor: "oklch(var(--primary) / 0.4)",
                color: "oklch(var(--primary))",
              }}
            >
              LIVE
            </Badge>
          </div>
        </div>
      </div>

      {/* ── Contact ── */}
      <div>
        <SectionHeading
          icon={<Mail size={16} style={{ color: "oklch(var(--primary))" }} />}
          label="Contact Us"
        />
        <div className="space-y-2">
          <a
            href="mailto:lamusportshub@gmail.com"
            className="flex items-center gap-3 p-3 rounded-xl border transition-colors"
            style={{
              background: "oklch(var(--card) / 0.4)",
              borderColor: "oklch(var(--border) / 0.3)",
              color: "oklch(var(--foreground))",
            }}
            data-ocid="contact-email"
          >
            <Mail size={16} style={{ color: "oklch(var(--primary))" }} />
            <span className="text-sm">lamusportshub@gmail.com</span>
          </a>
          <a
            href="https://wa.me/254705434375"
            className="flex items-center gap-3 p-3 rounded-xl border transition-colors"
            style={{
              background: "oklch(var(--card) / 0.4)",
              borderColor: "oklch(var(--border) / 0.3)",
              color: "oklch(var(--foreground))",
            }}
            data-ocid="contact-whatsapp"
          >
            <MessageCircle
              size={16}
              style={{ color: "oklch(0.65 0.18 142)" }}
            />
            <span className="text-sm">+254 705 434 375</span>
          </a>
        </div>
      </div>

      <Separator style={{ background: "oklch(var(--border) / 0.35)" }} />

      {/* ── Security ── */}
      <div>
        <SectionHeading
          icon={<Shield size={16} style={{ color: "oklch(var(--primary))" }} />}
          label="App Safety & Security"
        />
        <div className="space-y-2 mb-3">
          {SECURITY_ITEMS.map((item) => (
            <GlassCard key={item.title} className="p-3">
              <div className="flex items-start gap-3">
                <span className="text-lg shrink-0">{item.icon}</span>
                <div>
                  <p className="text-xs font-semibold text-foreground">
                    {item.title}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
        <div
          className="rounded-xl p-3 border"
          style={{
            background: "oklch(var(--primary) / 0.05)",
            borderColor: "oklch(var(--primary) / 0.2)",
          }}
        >
          <div className="flex items-center gap-2 mb-2">
            <Lock size={13} style={{ color: "oklch(var(--primary))" }} />
            <p className="text-xs font-semibold text-foreground">
              How to protect your app manually:
            </p>
          </div>
          <ol className="space-y-1">
            {SECURITY_TIPS.map((tip) => (
              <li
                key={tip.n}
                className="flex items-start gap-2 text-xs text-muted-foreground"
              >
                <span
                  className="shrink-0 w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold"
                  style={{
                    background: "oklch(var(--primary) / 0.12)",
                    color: "oklch(var(--primary))",
                  }}
                >
                  {tip.n}
                </span>
                {tip.text}
              </li>
            ))}
          </ol>
        </div>
      </div>

      <Separator style={{ background: "oklch(var(--border) / 0.35)" }} />

      {/* ── Terms & Conditions ── */}
      <div>
        <SectionHeading icon={<span>📋</span>} label="Terms & Conditions" />
        <GlassCard className="p-0 overflow-hidden">
          <div className="px-4">
            {TERMS.map((t) => (
              <AccordionItem key={t.title} title={t.title} text={t.text} />
            ))}
          </div>
        </GlassCard>
      </div>

      {/* ── Privacy Policy ── */}
      <div>
        <SectionHeading icon={<span>🔒</span>} label="Privacy Policy" />
        <GlassCard className="p-0 overflow-hidden">
          <div className="px-4">
            {PRIVACY.map((p) => (
              <AccordionItem key={p.title} title={p.title} text={p.text} />
            ))}
          </div>
        </GlassCard>
      </div>

      {/* ── Footer ── */}
      <div className="text-center pt-2">
        <p className="text-xs text-muted-foreground">
          🏝️ Island Pride. Island Football.
        </p>
        <p className="text-[10px] text-muted-foreground/50 mt-1">
          © {new Date().getFullYear()} Lamu Sports Hub · v1.0.0 · Season 2025/26
        </p>
      </div>
    </div>
  );
}
