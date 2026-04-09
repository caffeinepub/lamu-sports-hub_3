import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Player {
    id: PlayerId;
    assists: bigint;
    name: string;
    yellowCards: bigint;
    goals: bigint;
    teamId: TeamId;
    position: string;
}
export type Timestamp = bigint;
export type NewsId = bigint;
export interface Standing {
    goalDiff: bigint;
    played: bigint;
    wins: bigint;
    goalsFor: bigint;
    losses: bigint;
    goalsAgainst: bigint;
    teamId: TeamId;
    position: bigint;
    draws: bigint;
    points: bigint;
}
export type RefereeId = bigint;
export interface UserProfilePublic {
    favouriteTeamId?: TeamId;
    displayName: string;
    teamAffiliation: string;
    areaOfResidence: string;
    followedPlayerIds: Array<PlayerId>;
    followedTeamIds: Array<TeamId>;
}
export type TeamId = bigint;
export type PlayerId = bigint;
export type MatchId = bigint;
export interface Match {
    id: MatchId;
    matchTime: string;
    status: MatchStatus;
    awayTeamId: TeamId;
    homeTeamId: TeamId;
    joiners: Array<Principal>;
    homeScore: bigint;
    awayScore: bigint;
    matchDate: string;
}
export interface Official {
    id: OfficialId;
    area: string;
    name: string;
    role: string;
    email: string;
    phone: string;
}
export type ActivityId = bigint;
export interface ActivityItem {
    id: ActivityId;
    actorName: string;
    actionType: ActionType;
    entityId: bigint;
    timestamp: Timestamp;
    entityName: string;
    actorPrincipal?: Principal;
}
export interface NewsArticle {
    id: NewsId;
    title: string;
    content: string;
    date: string;
    emoji: string;
    excerpt: string;
    category: string;
}
export interface Referee {
    id: RefereeId;
    status: RefereeStatus;
    assignedMatchIds: Array<MatchId>;
    name: string;
    licenseNumber: string;
    phone: string;
}
export type OfficialId = bigint;
export interface Team {
    id: TeamId;
    name: string;
    wins: bigint;
    goalsFor: bigint;
    losses: bigint;
    emoji: string;
    abbreviation: string;
    goalsAgainst: bigint;
    draws: bigint;
}
export enum ActionType {
    goal = "goal",
    join = "join",
    status_change = "status_change",
    follow_team = "follow_team",
    follow_player = "follow_player"
}
export enum MatchStatus {
    scheduled = "scheduled",
    live = "live",
    finished = "finished"
}
export enum RefereeStatus {
    active = "active",
    inactive = "inactive"
}
export interface backendInterface {
    addMatch(homeTeamId: bigint, awayTeamId: bigint, matchDate: string, matchTime: string): Promise<bigint>;
    addNews(title: string, excerpt: string, content: string, category: string, date: string, emoji: string): Promise<bigint>;
    addOfficial(name: string, role: string, phone: string, email: string, area: string): Promise<bigint>;
    addPlayer(name: string, teamId: bigint, position: string, goals: bigint, assists: bigint, yellowCards: bigint): Promise<bigint>;
    addReferee(name: string, licenseNumber: string, phone: string): Promise<bigint>;
    addTeam(name: string, abbreviation: string, emoji: string): Promise<bigint>;
    assignRefereeToMatch(refereeId: bigint, matchId: bigint): Promise<boolean>;
    deleteNews(id: bigint): Promise<boolean>;
    deleteOfficial(id: bigint): Promise<boolean>;
    deletePlayer(id: bigint): Promise<boolean>;
    deleteReferee(id: bigint): Promise<boolean>;
    deleteTeam(id: bigint): Promise<boolean>;
    dismissActivity(activityId: bigint): Promise<void>;
    followPlayer(playerId: bigint): Promise<void>;
    followTeam(teamId: bigint): Promise<void>;
    getActivities(): Promise<Array<ActivityItem>>;
    getAllMatches(): Promise<Array<Match>>;
    getAllNews(): Promise<Array<NewsArticle>>;
    getAllOfficials(): Promise<Array<Official>>;
    getAllPlayers(): Promise<Array<Player>>;
    getAllReferees(): Promise<Array<Referee>>;
    getAllTeams(): Promise<Array<Team>>;
    getArticle(id: bigint): Promise<NewsArticle | null>;
    getMatch(id: bigint): Promise<Match | null>;
    getMatchesByTeam(teamId: bigint): Promise<Array<Match>>;
    getOfficial(id: bigint): Promise<Official | null>;
    getPlayer(id: bigint): Promise<Player | null>;
    getPlayersByTeam(teamId: bigint): Promise<Array<Player>>;
    getReferee(id: bigint): Promise<Referee | null>;
    getStandings(): Promise<Array<Standing>>;
    getTeam(id: bigint): Promise<Team | null>;
    getUserDismissed(): Promise<Array<bigint>>;
    getUserProfile(): Promise<UserProfilePublic>;
    hasJoinedMatch(matchId: bigint): Promise<boolean>;
    joinMatch(matchId: bigint): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    scheduleMatch(homeTeamId: bigint, awayTeamId: bigint, matchDate: string, matchTime: string): Promise<bigint>;
    setFavouriteTeam(teamId: bigint): Promise<void>;
    unassignRefereeFromMatch(refereeId: bigint, matchId: bigint): Promise<boolean>;
    unfollowPlayer(playerId: bigint): Promise<void>;
    unfollowTeam(teamId: bigint): Promise<void>;
    updateMatchScore(id: bigint, homeScore: bigint, awayScore: bigint): Promise<boolean>;
    updateMatchStatus(id: bigint, status: MatchStatus): Promise<boolean>;
    updateNews(id: bigint, title: string, excerpt: string, content: string, category: string, date: string, emoji: string): Promise<boolean>;
    updateOfficial(id: bigint, name: string, role: string, phone: string, email: string, area: string): Promise<boolean>;
    updatePlayer(id: bigint, name: string, teamId: bigint, position: string, goals: bigint, assists: bigint, yellowCards: bigint): Promise<boolean>;
    updateReferee(id: bigint, name: string, licenseNumber: string, status: RefereeStatus, phone: string): Promise<boolean>;
    updateTeam(id: bigint, name: string, abbreviation: string, emoji: string, wins: bigint, draws: bigint, losses: bigint, goalsFor: bigint, goalsAgainst: bigint): Promise<boolean>;
    updateUserProfile(displayName: string, area: string, teamAffiliation: string): Promise<void>;
}
