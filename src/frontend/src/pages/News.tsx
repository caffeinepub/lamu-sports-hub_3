import { Skeleton } from "@/components/ui/skeleton";
import { Share2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useNews } from "../hooks/use-backend";
import type { NewsArticle } from "../types";

const CATEGORIES = [
  "All",
  "Match Report",
  "Transfer News",
  "League Update",
  "Feature",
] as const;
type Category = (typeof CATEGORIES)[number];

const CATEGORY_STYLES: Record<
  string,
  { bg: string; text: string; gradientFrom: string; gradientTo: string }
> = {
  "Match Report": {
    bg: "oklch(var(--primary))",
    text: "#fff",
    gradientFrom: "oklch(0.58 0.27 24.8 / 0.55)",
    gradientTo: "oklch(0.40 0.20 24.8 / 0.35)",
  },
  "Transfer News": {
    bg: "oklch(0.44 0.19 257)",
    text: "#fff",
    gradientFrom: "oklch(0.44 0.19 257 / 0.55)",
    gradientTo: "oklch(0.32 0.14 257 / 0.35)",
  },
  "League Update": {
    bg: "oklch(0.52 0.18 142)",
    text: "#fff",
    gradientFrom: "oklch(0.52 0.18 142 / 0.55)",
    gradientTo: "oklch(0.38 0.14 142 / 0.35)",
  },
  Feature: {
    bg: "oklch(0.50 0.22 305)",
    text: "#fff",
    gradientFrom: "oklch(0.50 0.22 305 / 0.55)",
    gradientTo: "oklch(0.36 0.16 305 / 0.35)",
  },
};

const DEFAULT_STYLE = {
  bg: "oklch(var(--primary))",
  text: "#fff",
  gradientFrom: "oklch(var(--primary) / 0.4)",
  gradientTo: "oklch(var(--secondary) / 0.3)",
};

function getCategoryStyle(cat: string) {
  return CATEGORY_STYLES[cat] ?? DEFAULT_STYLE;
}

// Sample data — used when backend returns nothing
const FALLBACK_NEWS: NewsArticle[] = [
  {
    id: "1",
    title:
      "Lamu United Seal Title with Dramatic Late Winner Against Faza Strikers",
    excerpt:
      "Yusuf Al-Amin's stunning 89th-minute strike handed Lamu United a crucial 2-1 victory, extending their lead at the top of the FKF Lamu County League to six points with three games to play.",
    content:
      'In a pulsating FKF Lamu County League encounter at Lamu Stadium, Yusuf Al-Amin proved to be the hero once again as his last-gasp goal gave the hosts all three points. Faza Strikers had pegged back Lamu United with an equaliser just after the hour mark, threatening to deny the league leaders. But Al-Amin, with his 14th league goal of the season, rifled a low drive past the Faza goalkeeper to seal a vital win.\n\nThe victory puts Lamu United six points clear at the summit with three matches remaining, putting them firmly in control of their destiny. Coach Hassan Mwana was effusive in praise of his squad: "Every single player gave everything today. We never stopped believing and the fans were incredible."\n\nFaza Strikers, despite the loss, remain second and their title hopes are still mathematically alive heading into a crucial run of fixtures.',
    category: "Match Report",
    date: "9 Apr 2026",
    emoji: "🏆",
    readTime: 3,
  },
  {
    id: "2",
    title: "Mokowe FC Complete Double Signing Ahead of League Run-In",
    excerpt:
      "Mokowe FC have bolstered their midfield with the capture of two experienced players, signalling their intent to push for a top-three finish in the closing weeks of the FKF Lamu County League.",
    content:
      'Mokowe FC have moved decisively in the transfer window, bringing in midfielder Abdulkarim Jilo from Mpeketoni Eagles and winger Reuben Otieno on a short-term deal. Coach Salim Bakari believes the arrivals could prove pivotal.\n\n"We\'ve been tracking both players for a while. Abdulkarim brings creativity and Reuben gives us pace wide. They arrive at exactly the right time," said Bakari.\n\nThe signings come as Mokowe sit third in the league, just a point behind second-placed Faza Strikers. With six games remaining, the race for the top three spots — and potential county cup qualification — is fiercely contested.\n\nMokowe welcome Witu Warriors this Saturday before facing an away trip to Lamu United in what promises to be a season-defining fortnight.',
    category: "Transfer News",
    date: "7 Apr 2026",
    emoji: "✍️",
    readTime: 3,
  },
  {
    id: "3",
    title:
      "FKF Lamu County League Introduces Video Assistant Review for Final Fixtures",
    excerpt:
      "In a landmark decision, the FKF Lamu County branch has announced that a video review system will be trialled for the remaining fixtures of the current season, improving officiating standards.",
    content:
      "The FKF Lamu County branch confirmed on Wednesday that a video assistant review system will be piloted during the remaining six rounds of the season. The initiative, supported by county officials and club representatives, aims to reduce contentious decisions that have marred several matches this campaign.\n\nBranch secretary Fatuma Abdalla explained: \"We have been working on this for several months. It won't be the full VAR system used in major leagues, but a simple review process where officials can consult video footage for clear errors in goal decisions and red cards.\"\n\nAll eight clubs welcomed the announcement, with Lamu United chairman Ibrahim Shatry calling it 'a major step forward for football in the county'. The system will debut during matchday 13, scheduled for 19 April.",
    category: "League Update",
    date: "5 Apr 2026",
    emoji: "📋",
    readTime: 4,
  },
  {
    id: "4",
    title:
      "Rising Star: Inside the Journey of Witu Warriors' Teenage Sensation Juma Famau",
    excerpt:
      "At just 18, Juma Famau has already scored eight goals and provided three assists for Witu Warriors. We sit down with the midfielder to discuss his footballing journey and ambitions beyond Lamu County.",
    content:
      'Juma Famau first kicked a ball on the dusty pitches of Witu, dreaming of one day representing his home county. At 18, that dream is well underway. The midfielder has been one of the standout performers in this season\'s FKF Lamu County League, combining technical ability with a maturity that belies his age.\n\n"Football is everything to me. I watched older players in Witu and decided I wanted to be like them — working hard, learning, improving every day," Famau told us at Witu Field after training.\n\nCoach Abdalla Rashid has been his biggest advocate: "Juma is the most complete young player I\'ve coached. He sees the game faster than anyone. His future is bright — not just for Witu Warriors, but for Lamu and beyond."\n\nFamau has attracted attention from clubs in Mombasa and Nairobi, but for now his focus remains simple: help Witu Warriors secure a top-four finish and keep improving every session.',
    category: "Feature",
    date: "3 Apr 2026",
    emoji: "⭐",
    readTime: 5,
  },
  {
    id: "5",
    title: "Pate Island FC Edge Five-Goal Thriller to Climb Off Bottom",
    excerpt:
      "A breathless encounter at Pate Ground ended 3-2 in favour of the home side as Pate Island FC climbed off the foot of the table courtesy of a second-half comeback against Kiunga United.",
    content:
      'Pate Island FC claimed a vital three points at Pate Ground in a dramatic 3-2 victory over Kiunga United, ending a four-match winless run. Kiunga led 2-0 at half-time through goals from Said Hamisi and a penalty, but a transformed second-half performance saw the hosts score three times in twenty minutes.\n\nCaptain Athman Rashid led the fightback, scoring twice before Mohamed Lali netted the winner with thirteen minutes remaining. The result lifts Pate Island to sixth in the standings, level on points with fifth-placed Hindi Hotspurs.\n\nCoach Ibrahim Athman was relieved: "We had a serious conversation at half-time. The players responded brilliantly. The atmosphere here at Pate Ground was electric and it drove us on."\n\nFor Kiunga United, defeat deepens their relegation concerns. They sit eight points adrift of safety with six games remaining.',
    category: "Match Report",
    date: "1 Apr 2026",
    emoji: "⚽",
    readTime: 3,
  },
  {
    id: "6",
    title:
      "FKF Lamu County Awards Night: Nominations Unveiled for End-of-Season Honours",
    excerpt:
      "The FKF Lamu County branch has released the nominations for its end-of-season awards, with Lamu United dominating the shortlists as the league leaders prepare for a title decider.",
    content:
      "The FKF Lamu County branch has unveiled the nominations for the end-of-season awards, headlined by Yusuf Al-Amin's four-nomination haul. The Lamu United striker is shortlisted for Player of the Season, Top Scorer, Goal of the Season, and the coveted FKF Lamu County Star Award.\n\nThe full shortlists feature players from all eight clubs, reflecting the competitive nature of this season's campaign. In the Young Player of the Season category, Witu Warriors' Juma Famau faces stiff competition from Hindi Hotspurs' Khalid Mwenje and Faza Strikers' 19-year-old defender Amina Omar.\n\nCoach of the Season sees Hassan Mwana of Lamu United, Omar Shafii of Faza Strikers, and Salim Bakari of Mokowe FC recognised for their respective campaigns.\n\nThe awards ceremony will take place on 30 April in Lamu Town, with over 200 guests expected to attend. Tickets are available through the FKF Lamu County branch.",
    category: "League Update",
    date: "30 Mar 2026",
    emoji: "🏅",
    readTime: 4,
  },
];

function getArticleContent(article: NewsArticle & { content?: string }) {
  return article.content ?? article.excerpt;
}

interface ExpandedArticle extends NewsArticle {
  content?: string;
}

/* ─── Share helper ───────────────────────────────────────────────────── */
async function shareArticle(article: NewsArticle) {
  const excerpt =
    article.excerpt.length > 120
      ? `${article.excerpt.slice(0, 120)}…`
      : article.excerpt;
  const text = `📰 ${article.title}\n${excerpt}\n\nLamu Sports Hub`;

  if (navigator.share) {
    try {
      await navigator.share({ title: article.title, text });
      toast.success("Shared!");
      return;
    } catch {
      // cancelled or unsupported
    }
  }
  try {
    await navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  } catch {
    toast.error("Could not share");
  }
}

/* ─── Components ─────────────────────────────────────────────────────── */
function CategoryBadge({ category }: { category: string }) {
  const style = getCategoryStyle(category);
  return (
    <span
      className="inline-block px-2.5 py-0.5 rounded-full text-xs font-bold"
      style={{ background: style.bg, color: style.text }}
    >
      {category}
    </span>
  );
}

function ArticleView({
  article,
  onBack,
}: {
  article: ExpandedArticle;
  onBack: () => void;
}) {
  const style = getCategoryStyle(article.category);
  const content = getArticleContent(article);

  return (
    <div
      className="rounded-2xl overflow-hidden border transition-smooth"
      style={{
        background: "oklch(var(--card) / 0.9)",
        borderColor: `${style.bg.replace(")", " / 0.4)")}`,
        backdropFilter: "blur(12px)",
      }}
      data-ocid="article-expanded"
    >
      {/* Hero banner */}
      <div
        className="h-[180px] flex items-center justify-center relative"
        style={{
          background: `linear-gradient(135deg, ${style.gradientFrom}, ${style.gradientTo})`,
        }}
      >
        <span className="text-[4rem] leading-none select-none">
          {article.emoji}
        </span>
        <div className="absolute top-3 left-3">
          <CategoryBadge category={article.category} />
        </div>
        {/* Back button */}
        <button
          type="button"
          onClick={onBack}
          className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-smooth"
          style={{
            background: "oklch(0.10 0 0 / 0.7)",
            color: "#fff",
            backdropFilter: "blur(8px)",
          }}
          data-ocid="article-collapse"
          aria-label="Collapse article"
        >
          ✕ Close
        </button>
      </div>

      {/* Article body */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">
              {article.date}
            </span>
            <span className="text-muted-foreground">·</span>
            <span className="text-xs text-muted-foreground">
              {article.readTime} min read
            </span>
          </div>
          {/* Share button in article view */}
          <button
            type="button"
            onClick={() => shareArticle(article)}
            aria-label="Share article"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all hover:opacity-90 active:scale-95"
            style={{
              background: "oklch(var(--primary) / 0.12)",
              border: "1px solid oklch(var(--primary) / 0.35)",
              color: "oklch(var(--primary))",
            }}
            data-ocid="share-article-btn"
          >
            <Share2 size={12} />
            Share
          </button>
        </div>
        <h2 className="font-display font-black text-lg leading-snug mb-4">
          {article.title}
        </h2>
        <div className="text-sm text-muted-foreground leading-relaxed space-y-3">
          {content.split("\n\n").map((para) => (
            <p key={para.slice(0, 40)}>{para}</p>
          ))}
        </div>

        <button
          type="button"
          onClick={onBack}
          className="mt-5 flex items-center gap-2 text-sm font-semibold transition-smooth"
          style={{ color: style.bg }}
          data-ocid="article-collapse-bottom"
        >
          ← Back to News
        </button>
      </div>
    </div>
  );
}

function NewsCard({
  article,
  onExpand,
}: {
  article: ExpandedArticle;
  onExpand: () => void;
}) {
  const style = getCategoryStyle(article.category);

  function handleShare(e: React.MouseEvent) {
    e.stopPropagation();
    shareArticle(article);
  }

  return (
    <div
      className="rounded-2xl border overflow-hidden transition-smooth"
      style={{
        background: "oklch(var(--card) / 0.85)",
        borderColor: "oklch(var(--primary) / 0.15)",
        backdropFilter: "blur(12px)",
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.borderColor = `${style.bg.replace(")", " / 0.45)")}`;
        el.style.transform = "translateY(-3px)";
        el.style.boxShadow = `0 12px 32px oklch(0 0 0 / 0.4), 0 0 0 1px ${style.bg.replace(")", " / 0.25)")}`;
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.borderColor = "oklch(var(--primary) / 0.15)";
        el.style.transform = "none";
        el.style.boxShadow = "none";
      }}
      data-ocid="news-card"
    >
      {/* Clickable card body */}
      <button
        type="button"
        className="w-full text-left"
        onClick={onExpand}
        aria-label={`Read article: ${article.title}`}
      >
        {/* 180px image banner */}
        <div
          className="h-[180px] flex items-center justify-center relative"
          style={{
            background: `linear-gradient(135deg, ${style.gradientFrom}, ${style.gradientTo})`,
          }}
        >
          <span className="text-[4rem] leading-none select-none">
            {article.emoji}
          </span>
          {/* Category badge top-left */}
          <div className="absolute top-3 left-3">
            <CategoryBadge category={article.category} />
          </div>
        </div>

        {/* Content */}
        <div className="p-4 pb-3">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs text-muted-foreground">
              {article.date}
            </span>
            <span className="text-muted-foreground">·</span>
            <span className="text-xs text-muted-foreground">
              {article.readTime} min read
            </span>
          </div>
          <h3
            className="font-display font-bold leading-snug mb-2 line-clamp-2"
            style={{ fontSize: "1.1rem" }}
          >
            {article.title}
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
            {article.excerpt}
          </p>
        </div>
      </button>

      {/* Footer row — read more + share */}
      <div className="px-4 pb-4 flex items-center justify-between">
        <button
          type="button"
          onClick={onExpand}
          className="text-sm font-semibold transition-smooth"
          style={{ color: style.bg }}
        >
          Read more →
        </button>
        <button
          type="button"
          onClick={handleShare}
          aria-label="Share article"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all hover:opacity-90 active:scale-95"
          style={{
            background: "oklch(var(--primary) / 0.1)",
            border: "1px solid oklch(var(--primary) / 0.3)",
            color: "oklch(var(--primary))",
          }}
          data-ocid="share-news-btn"
        >
          <Share2 size={12} />
          Share
        </button>
      </div>
    </div>
  );
}

export default function News() {
  const { data: backendNews, isLoading } = useNews();
  const [category, setCategory] = useState<Category | "All">("All");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const news: ExpandedArticle[] =
    backendNews && backendNews.length > 0 ? backendNews : FALLBACK_NEWS;

  const filtered = news.filter(
    (n) => category === "All" || n.category === category,
  );

  return (
    <div className="px-4 py-4 max-w-xl mx-auto">
      <h1 className="font-display font-black text-2xl mb-4">News</h1>

      {/* Category filter tabs */}
      <div
        className="flex gap-2 mb-5 overflow-x-auto pb-1 scrollbar-hide"
        data-ocid="news-filters"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {CATEGORIES.map((cat) => {
          const isActive = category === cat;
          const catStyle = cat === "All" ? null : getCategoryStyle(cat);
          return (
            <button
              type="button"
              key={cat}
              onClick={() => {
                setCategory(cat);
                setExpandedId(null);
              }}
              className="flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-smooth"
              style={
                isActive
                  ? {
                      background: catStyle
                        ? catStyle.bg
                        : "oklch(var(--primary))",
                      color: "#fff",
                      boxShadow: catStyle
                        ? `0 4px 12px ${catStyle.bg.replace(")", " / 0.35)")}`
                        : "0 4px 12px oklch(var(--primary) / 0.35)",
                    }
                  : {
                      background: "oklch(var(--muted) / 0.7)",
                      color: "oklch(var(--muted-foreground))",
                    }
              }
              data-ocid={`cat-filter-${cat.toLowerCase().replace(/\s+/g, "-")}`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-[300px] rounded-2xl" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div
          className="rounded-2xl p-8 text-center border"
          style={{
            background: "oklch(var(--card) / 0.7)",
            borderColor: "oklch(var(--border))",
          }}
          data-ocid="news-empty"
        >
          <span className="text-4xl block mb-3">📰</span>
          <p className="font-semibold mb-1">No articles found</p>
          <p className="text-sm text-muted-foreground">
            Try a different category
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((article) =>
            expandedId === article.id ? (
              <ArticleView
                key={article.id}
                article={article}
                onBack={() => setExpandedId(null)}
              />
            ) : (
              <NewsCard
                key={article.id}
                article={article}
                onExpand={() => setExpandedId(article.id)}
              />
            ),
          )}
        </div>
      )}
    </div>
  );
}
