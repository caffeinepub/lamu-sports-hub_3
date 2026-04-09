import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  ActionType as BackendActionType,
  MatchStatus as BackendMatchStatus,
  RefereeStatus as BackendRefereeStatus,
  createActor,
} from "../backend";
import type {
  ActivityItem as BackendActivityItem,
  Match as BackendMatch,
  NewsArticle as BackendNewsArticle,
  Official as BackendOfficial,
  Player as BackendPlayer,
  Referee as BackendReferee,
  Standing as BackendStanding,
  Team as BackendTeam,
  UserProfilePublic as BackendUserProfile,
} from "../backend.d.ts";
import type {
  ActivityItem,
  Match,
  NewsArticle,
  Official,
  Player,
  Referee,
  Standing,
  Team,
  UserProfile,
} from "../types";

export { BackendMatchStatus };
export type { BackendRefereeStatus };

// ─── Type mappers ─────────────────────────────────────────────────────────────

function mapTeam(t: BackendTeam): Team {
  return {
    id: t.id.toString(),
    name: t.name,
    shortName: t.abbreviation,
    emoji: t.emoji,
    location: "",
    foundedYear: 0,
    coach: "",
    stadium: "",
    wins: Number(t.wins),
    draws: Number(t.draws),
    losses: Number(t.losses),
    goalsFor: Number(t.goalsFor),
    goalsAgainst: Number(t.goalsAgainst),
  };
}

function mapPlayer(
  p: BackendPlayer,
  teamMap: Map<string, BackendTeam>,
): Player {
  const team = teamMap.get(p.teamId.toString());
  return {
    id: p.id.toString(),
    name: p.name,
    teamId: p.teamId.toString(),
    teamName: team?.name ?? "Unknown",
    position: p.position,
    jerseyNumber: 0,
    goals: Number(p.goals),
    assists: Number(p.assists),
    matches: 0,
    yellowCards: Number(p.yellowCards),
    emoji: "👨🏾",
  };
}

function mapBackendStatus(status: BackendMatch["status"]): Match["status"] {
  if (status === "live") return "live";
  if (status === "finished") return "finished";
  return "upcoming"; // "scheduled" → "upcoming"
}

function mapMatch(m: BackendMatch, teamMap: Map<string, BackendTeam>): Match {
  const home = teamMap.get(m.homeTeamId.toString());
  const away = teamMap.get(m.awayTeamId.toString());
  return {
    id: m.id.toString(),
    homeTeamId: m.homeTeamId.toString(),
    homeTeamName: home?.name ?? "Home Team",
    homeTeamEmoji: home?.emoji ?? "⚽",
    awayTeamId: m.awayTeamId.toString(),
    awayTeamName: away?.name ?? "Away Team",
    awayTeamEmoji: away?.emoji ?? "⚽",
    homeScore: Number(m.homeScore),
    awayScore: Number(m.awayScore),
    status: mapBackendStatus(m.status),
    venue: "",
    date: m.matchDate,
    league: "FKF Lamu County League",
    joiners: m.joiners.map((p) => p.toString()),
  };
}

function mapStanding(
  s: BackendStanding,
  teamMap: Map<string, BackendTeam>,
): Standing {
  const team = teamMap.get(s.teamId.toString());
  return {
    position: Number(s.position),
    teamId: s.teamId.toString(),
    teamName: team?.name ?? "Unknown",
    teamShortName: team?.abbreviation ?? "???",
    teamEmoji: team?.emoji ?? "⚽",
    played: Number(s.played),
    won: Number(s.wins),
    drawn: Number(s.draws),
    lost: Number(s.losses),
    goalsFor: Number(s.goalsFor),
    goalsAgainst: Number(s.goalsAgainst),
    goalDiff: Number(s.goalDiff),
    points: Number(s.points),
    form: [],
  };
}

function mapNews(n: BackendNewsArticle): NewsArticle {
  return {
    id: n.id.toString(),
    title: n.title,
    excerpt: n.excerpt,
    content: n.content,
    category: n.category,
    date: n.date,
    emoji: n.emoji,
    readTime: Math.max(1, Math.ceil(n.content.length / 1000)),
  };
}

function mapActionType(at: BackendActionType): ActivityItem["actionType"] {
  if (at === BackendActionType.join) return "join";
  if (at === BackendActionType.follow_team) return "follow_team";
  if (at === BackendActionType.follow_player) return "follow_player";
  if (at === BackendActionType.goal) return "goal";
  return "status_change";
}

function mapActivity(a: BackendActivityItem): ActivityItem {
  return {
    id: a.id,
    actorName: a.actorName,
    actionType: mapActionType(a.actionType),
    entityId: a.entityId,
    entityName: a.entityName,
    timestamp: a.timestamp,
  };
}

function mapUserProfile(p: BackendUserProfile): UserProfile {
  return {
    displayName: p.displayName,
    areaOfResidence: p.areaOfResidence,
    teamAffiliation: p.teamAffiliation,
    favouriteTeamId:
      p.favouriteTeamId != null ? Number(p.favouriteTeamId) : null,
    followedTeamIds: p.followedTeamIds.map(Number),
    followedPlayerIds: p.followedPlayerIds.map(Number),
  };
}

function mapOfficial(o: BackendOfficial): Official {
  return {
    id: o.id,
    name: o.name,
    role: o.role,
    phone: o.phone,
    email: o.email,
    area: o.area,
  };
}

function mapRefereeStatus(s: BackendRefereeStatus): Referee["status"] {
  return s === BackendRefereeStatus.active ? "active" : "inactive";
}

function mapReferee(r: BackendReferee): Referee {
  return {
    id: r.id,
    name: r.name,
    licenseNumber: r.licenseNumber,
    status: mapRefereeStatus(r.status),
    phone: r.phone,
    assignedMatchIds: r.assignedMatchIds,
  };
}

// ─── Core hooks ───────────────────────────────────────────────────────────────

export function useTeams() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<Team[]>({
    queryKey: ["teams"],
    queryFn: async () => {
      if (!actor) return [];
      const teams = await actor.getAllTeams();
      return teams.map(mapTeam);
    },
    enabled: !!actor && !isFetching,
    staleTime: 10 * 60 * 1000,
    retry: 3,
  });
}

export function usePlayers() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<Player[]>({
    queryKey: ["players"],
    queryFn: async () => {
      if (!actor) return [];
      const [players, teams] = await Promise.all([
        actor.getAllPlayers(),
        actor.getAllTeams(),
      ]);
      const teamMap = new Map(teams.map((t) => [t.id.toString(), t]));
      return players.map((p) => mapPlayer(p, teamMap));
    },
    enabled: !!actor && !isFetching,
    staleTime: 10 * 60 * 1000,
    retry: 3,
  });
}

export function useMatches() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<Match[]>({
    queryKey: ["matches"],
    queryFn: async () => {
      if (!actor) return [];
      const [matches, teams] = await Promise.all([
        actor.getAllMatches(),
        actor.getAllTeams(),
      ]);
      const teamMap = new Map(teams.map((t) => [t.id.toString(), t]));
      return matches.map((m) => mapMatch(m, teamMap));
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 30_000,
    staleTime: 0,
    retry: 3,
  });
}

export function useStandings() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<Standing[]>({
    queryKey: ["standings"],
    queryFn: async () => {
      if (!actor) return [];
      const [standings, teams] = await Promise.all([
        actor.getStandings(),
        actor.getAllTeams(),
      ]);
      const teamMap = new Map(teams.map((t) => [t.id.toString(), t]));
      return standings
        .map((s) => mapStanding(s, teamMap))
        .sort((a, b) => a.position - b.position);
    },
    enabled: !!actor && !isFetching,
    staleTime: 5 * 60 * 1000,
    retry: 3,
  });
}

export function useNews() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<NewsArticle[]>({
    queryKey: ["news"],
    queryFn: async () => {
      if (!actor) return [];
      const articles = await actor.getAllNews();
      return articles
        .map(mapNews)
        .sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
        );
    },
    enabled: !!actor && !isFetching,
    staleTime: 10 * 60 * 1000,
    retry: 3,
  });
}

export function useHasJoinedMatch(matchId: string) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<boolean>({
    queryKey: ["hasJoined", matchId],
    queryFn: async () => {
      if (!actor) return false;
      return actor.hasJoinedMatch(BigInt(matchId));
    },
    enabled: !!actor && !isFetching && !!matchId,
    staleTime: 0,
    retry: 3,
  });
}

export function useJoinMatch() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: async (matchId: string) => {
      if (!actor) throw new Error("Not connected");
      const result = await actor.joinMatch(BigInt(matchId));
      if (result.__kind__ === "err") {
        throw new Error(result.err);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["matches"] });
      queryClient.invalidateQueries({ queryKey: ["hasJoined"] });
      toast.success("You joined the match!");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to join match");
    },
  });
}

export function useLiveMatches() {
  const { data: matches, ...rest } = useMatches();
  return { data: matches?.filter((m) => m.status === "live") ?? [], ...rest };
}

// ─── User profile hooks ───────────────────────────────────────────────────────

export function useUserProfile() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<UserProfile>({
    queryKey: ["userProfile"],
    queryFn: async () => {
      if (!actor) throw new Error("Not connected");
      const profile = await actor.getUserProfile();
      return mapUserProfile(profile);
    },
    enabled: !!actor && !isFetching,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
}

export function useUpdateUserProfile() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      displayName,
      areaOfResidence,
      teamAffiliation,
    }: {
      displayName: string;
      areaOfResidence: string;
      teamAffiliation: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateUserProfile(
        displayName,
        areaOfResidence,
        teamAffiliation,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
      toast.success("Profile updated");
    },
    onError: (e: Error) => toast.error(e.message || "Failed to update profile"),
  });
}

export function useSetFavouriteTeam() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (teamId: string) => {
      if (!actor) throw new Error("Not connected");
      return actor.setFavouriteTeam(BigInt(teamId));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
      toast.success("Favourite team set!");
    },
    onError: (e: Error) =>
      toast.error(e.message || "Failed to set favourite team"),
  });
}

export function useFollowTeam() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (teamId: string) => {
      if (!actor) throw new Error("Not connected");
      return actor.followTeam(BigInt(teamId));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
      toast.success("Following team!");
    },
    onError: (e: Error) => toast.error(e.message || "Failed to follow team"),
  });
}

export function useUnfollowTeam() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (teamId: string) => {
      if (!actor) throw new Error("Not connected");
      return actor.unfollowTeam(BigInt(teamId));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
      toast.success("Unfollowed team");
    },
    onError: (e: Error) => toast.error(e.message || "Failed to unfollow team"),
  });
}

export function useFollowPlayer() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (playerId: string) => {
      if (!actor) throw new Error("Not connected");
      return actor.followPlayer(BigInt(playerId));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
      toast.success("Following player!");
    },
    onError: (e: Error) => toast.error(e.message || "Failed to follow player"),
  });
}

export function useUnfollowPlayer() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (playerId: string) => {
      if (!actor) throw new Error("Not connected");
      return actor.unfollowPlayer(BigInt(playerId));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
      toast.success("Unfollowed player");
    },
    onError: (e: Error) =>
      toast.error(e.message || "Failed to unfollow player"),
  });
}

// ─── Activity / notifications hooks ──────────────────────────────────────────

export function useActivities() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<ActivityItem[]>({
    queryKey: ["activities"],
    queryFn: async () => {
      if (!actor) return [];
      const items = await actor.getActivities();
      return items
        .map(mapActivity)
        .sort((a, b) => Number(b.timestamp - a.timestamp));
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 15_000,
    staleTime: 0,
    retry: 2,
  });
}

export function useDismissActivity() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (activityId: bigint) => {
      if (!actor) throw new Error("Not connected");
      return actor.dismissActivity(activityId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["activities"] });
      queryClient.invalidateQueries({ queryKey: ["userDismissed"] });
    },
    onError: (e: Error) => toast.error(e.message || "Failed to dismiss"),
  });
}

export function useGetUserDismissed() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<bigint[]>({
    queryKey: ["userDismissed"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getUserDismissed();
    },
    enabled: !!actor && !isFetching,
    staleTime: 60_000,
    retry: 2,
  });
}

// ─── Officials hooks ──────────────────────────────────────────────────────────

export function useOfficials() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<Official[]>({
    queryKey: ["officials"],
    queryFn: async () => {
      if (!actor) return [];
      const officials = await actor.getAllOfficials();
      return officials.map(mapOfficial);
    },
    enabled: !!actor && !isFetching,
    staleTime: 10 * 60 * 1000,
    retry: 3,
  });
}

export function useAddOfficial() {
  const { actor, isFetching } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      name,
      role,
      phone,
      email,
      area,
    }: {
      name: string;
      role: string;
      phone: string;
      email: string;
      area: string;
    }) => {
      if (!actor || isFetching) throw new Error("Actor not ready");
      return actor.addOfficial(name, role, phone, email, area);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["officials"] });
      toast.success("Official added");
    },
    onError: (e: Error) => toast.error(e.message || "Failed to add official"),
  });
}

export function useUpdateOfficial() {
  const { actor, isFetching } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      name,
      role,
      phone,
      email,
      area,
    }: {
      id: bigint;
      name: string;
      role: string;
      phone: string;
      email: string;
      area: string;
    }) => {
      if (!actor || isFetching) throw new Error("Actor not ready");
      return actor.updateOfficial(id, name, role, phone, email, area);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["officials"] });
      toast.success("Official updated");
    },
    onError: (e: Error) =>
      toast.error(e.message || "Failed to update official"),
  });
}

export function useDeleteOfficial() {
  const { actor, isFetching } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor || isFetching) throw new Error("Actor not ready");
      return actor.deleteOfficial(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["officials"] });
      toast.success("Official removed");
    },
    onError: (e: Error) =>
      toast.error(e.message || "Failed to remove official"),
  });
}

// ─── Referees hooks ───────────────────────────────────────────────────────────

export function useReferees() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<Referee[]>({
    queryKey: ["referees"],
    queryFn: async () => {
      if (!actor) return [];
      const refs = await actor.getAllReferees();
      return refs.map(mapReferee);
    },
    enabled: !!actor && !isFetching,
    staleTime: 10 * 60 * 1000,
    retry: 3,
  });
}

export function useAddReferee() {
  const { actor, isFetching } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      name,
      licenseNumber,
      phone,
    }: {
      name: string;
      licenseNumber: string;
      phone: string;
    }) => {
      if (!actor || isFetching) throw new Error("Actor not ready");
      return actor.addReferee(name, licenseNumber, phone);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["referees"] });
      toast.success("Referee added");
    },
    onError: (e: Error) => toast.error(e.message || "Failed to add referee"),
  });
}

export function useUpdateReferee() {
  const { actor, isFetching } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      name,
      licenseNumber,
      status,
      phone,
    }: {
      id: bigint;
      name: string;
      licenseNumber: string;
      status: BackendRefereeStatus;
      phone: string;
    }) => {
      if (!actor || isFetching) throw new Error("Actor not ready");
      return actor.updateReferee(id, name, licenseNumber, status, phone);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["referees"] });
      toast.success("Referee updated");
    },
    onError: (e: Error) => toast.error(e.message || "Failed to update referee"),
  });
}

export function useDeleteReferee() {
  const { actor, isFetching } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor || isFetching) throw new Error("Actor not ready");
      return actor.deleteReferee(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["referees"] });
      toast.success("Referee removed");
    },
    onError: (e: Error) => toast.error(e.message || "Failed to remove referee"),
  });
}

export function useAssignRefereeToMatch() {
  const { actor, isFetching } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      refereeId,
      matchId,
    }: {
      refereeId: bigint;
      matchId: bigint;
    }) => {
      if (!actor || isFetching) throw new Error("Actor not ready");
      return actor.assignRefereeToMatch(refereeId, matchId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["referees"] });
      queryClient.invalidateQueries({ queryKey: ["matches"] });
      toast.success("Referee assigned to match");
    },
    onError: (e: Error) => toast.error(e.message || "Failed to assign referee"),
  });
}

// ─── Admin mutation hooks ─────────────────────────────────────────────────────

export function useScheduleMatch() {
  const { actor, isFetching } = useActor(createActor);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      homeTeamId,
      awayTeamId,
      matchDate,
      matchTime,
    }: {
      homeTeamId: string;
      awayTeamId: string;
      matchDate: string;
      matchTime: string;
    }) => {
      if (!actor || isFetching) throw new Error("Actor not ready");
      return actor.scheduleMatch(
        BigInt(homeTeamId),
        BigInt(awayTeamId),
        matchDate,
        matchTime,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["matches"] });
      toast.success("Match scheduled successfully");
    },
    onError: (e: Error) => toast.error(e.message || "Failed to schedule match"),
  });
}

export function useUpdateMatchScore() {
  const { actor, isFetching } = useActor(createActor);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      homeScore,
      awayScore,
    }: {
      id: string;
      homeScore: number;
      awayScore: number;
    }) => {
      if (!actor || isFetching) throw new Error("Actor not ready");
      return actor.updateMatchScore(
        BigInt(id),
        BigInt(homeScore),
        BigInt(awayScore),
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["matches"] });
      queryClient.invalidateQueries({ queryKey: ["standings"] });
      toast.success("Score updated");
    },
    onError: (e: Error) => toast.error(e.message || "Failed to update score"),
  });
}

export function useUpdateMatchStatus() {
  const { actor, isFetching } = useActor(createActor);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      status,
    }: {
      id: string;
      status: BackendMatchStatus;
    }) => {
      if (!actor || isFetching) throw new Error("Actor not ready");
      return actor.updateMatchStatus(BigInt(id), status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["matches"] });
      queryClient.invalidateQueries({ queryKey: ["standings"] });
      toast.success("Match status updated");
    },
    onError: (e: Error) => toast.error(e.message || "Failed to update status"),
  });
}

export function useAddTeam() {
  const { actor, isFetching } = useActor(createActor);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      name,
      abbreviation,
      emoji,
    }: {
      name: string;
      abbreviation: string;
      emoji: string;
    }) => {
      if (!actor || isFetching) throw new Error("Actor not ready");
      return actor.addTeam(name, abbreviation, emoji);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teams"] });
      toast.success("Team added successfully");
    },
    onError: (e: Error) => toast.error(e.message || "Failed to add team"),
  });
}

export function useDeleteTeam() {
  const { actor, isFetching } = useActor(createActor);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor || isFetching) throw new Error("Actor not ready");
      return actor.deleteTeam(BigInt(id));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teams"] });
      toast.success("Team removed");
    },
    onError: (e: Error) => toast.error(e.message || "Failed to remove team"),
  });
}

export function useAddPlayer() {
  const { actor, isFetching } = useActor(createActor);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      name,
      teamId,
      position,
      goals,
      assists,
    }: {
      name: string;
      teamId: string;
      position: string;
      goals: number;
      assists: number;
    }) => {
      if (!actor || isFetching) throw new Error("Actor not ready");
      return actor.addPlayer(
        name,
        BigInt(teamId),
        position,
        BigInt(goals),
        BigInt(assists),
        BigInt(0),
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["players"] });
      toast.success("Player added successfully");
    },
    onError: (e: Error) => toast.error(e.message || "Failed to add player"),
  });
}

export function useDeletePlayer() {
  const { actor, isFetching } = useActor(createActor);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor || isFetching) throw new Error("Actor not ready");
      return actor.deletePlayer(BigInt(id));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["players"] });
      toast.success("Player removed");
    },
    onError: (e: Error) => toast.error(e.message || "Failed to remove player"),
  });
}

export function useAddNews() {
  const { actor, isFetching } = useActor(createActor);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      title,
      excerpt,
      category,
      date,
      emoji,
    }: {
      title: string;
      excerpt: string;
      category: string;
      date: string;
      emoji: string;
    }) => {
      if (!actor || isFetching) throw new Error("Actor not ready");
      return actor.addNews(title, excerpt, excerpt, category, date, emoji);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["news"] });
      toast.success("Article published");
    },
    onError: (e: Error) =>
      toast.error(e.message || "Failed to publish article"),
  });
}

export function useDeleteNews() {
  const { actor, isFetching } = useActor(createActor);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor || isFetching) throw new Error("Actor not ready");
      return actor.deleteNews(BigInt(id));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["news"] });
      toast.success("Article removed");
    },
    onError: (e: Error) => toast.error(e.message || "Failed to remove article"),
  });
}
