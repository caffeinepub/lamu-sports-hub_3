export type MatchStatus = "live" | "upcoming" | "finished";

export interface Team {
  id: string;
  name: string;
  shortName: string;
  emoji: string;
  location: string;
  foundedYear: number;
  coach: string;
  stadium: string;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
}

export interface Player {
  id: string;
  name: string;
  teamId: string;
  teamName: string;
  position: string;
  jerseyNumber: number;
  goals: number;
  assists: number;
  matches: number;
  yellowCards: number;
  emoji: string;
}

export interface Match {
  id: string;
  homeTeamId: string;
  homeTeamName: string;
  homeTeamEmoji: string;
  awayTeamId: string;
  awayTeamName: string;
  awayTeamEmoji: string;
  homeScore: number;
  awayScore: number;
  status: MatchStatus;
  minute?: number;
  venue: string;
  date: string;
  league: string;
  joiners: string[];
}

export interface Standing {
  position: number;
  teamId: string;
  teamName: string;
  teamShortName: string;
  teamEmoji: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDiff: number;
  points: number;
  form: ("W" | "D" | "L")[];
}

export interface NewsArticle {
  id: string;
  title: string;
  excerpt: string;
  content?: string;
  category: string;
  date: string;
  emoji: string;
  readTime: number;
}

export interface UserProfile {
  displayName: string;
  areaOfResidence: string;
  teamAffiliation: string;
  favouriteTeamId: number | null;
  followedTeamIds: number[];
  followedPlayerIds: number[];
}

export interface ActivityItem {
  id: bigint;
  actorName: string;
  actionType:
    | "join"
    | "follow_team"
    | "follow_player"
    | "goal"
    | "status_change";
  entityId: bigint;
  entityName: string;
  timestamp: bigint;
}

export interface Official {
  id: bigint;
  name: string;
  role: string;
  phone: string;
  email: string;
  area: string;
}

export interface Referee {
  id: bigint;
  name: string;
  licenseNumber: string;
  status: "active" | "inactive";
  phone: string;
  assignedMatchIds: bigint[];
}

export type TabId =
  | "home"
  | "matches"
  | "standings"
  | "teams"
  | "players"
  | "news"
  | "admin"
  | "notifications"
  | "settings"
  | "about"
  | "officials";
