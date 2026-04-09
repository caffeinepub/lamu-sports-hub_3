import List "mo:core/List";
import Map "mo:core/Map";
import Set "mo:core/Set";
import Principal "mo:core/Principal";
import TeamTypes "types/teams";
import PlayerTypes "types/players";
import MatchTypes "types/matches";
import NewsTypes "types/news";
import UserTypes "types/users";
import NotifTypes "types/notifications";
import OfficialTypes "types/officials";
import RefereeTypes "types/referees";
import TeamsLib "lib/teams";
import PlayersLib "lib/players";
import MatchesLib "lib/matches";
import NewsLib "lib/news";
import OfficialsLib "lib/officials";
import RefereesLib "lib/referees";
import TeamsApi "mixins/teams-api";
import PlayersApi "mixins/players-api";
import MatchesApi "mixins/matches-api";
import NewsApi "mixins/news-api";
import UsersApi "mixins/users-api";
import NotificationsApi "mixins/notifications-api";
import OfficialsApi "mixins/officials-api";
import RefereesApi "mixins/referees-api";

actor {
  // --- Existing state ---
  let teams   = List.empty<TeamTypes.Team>();
  let players = List.empty<PlayerTypes.Player>();
  let matches = List.empty<MatchTypes.Match>();
  let articles = List.empty<NewsTypes.NewsArticle>();
  let admins  = List.empty<Principal>();

  let nextTeamId   = { var value : Nat = 1 };
  let nextPlayerId = { var value : Nat = 1 };
  let nextMatchId  = { var value : Nat = 1 };
  let nextNewsId   = { var value : Nat = 1 };

  // --- New state: users ---
  let userProfiles = Map.empty<Principal, UserTypes.UserProfile>();

  // --- New state: notifications/activity ---
  let activities = List.empty<NotifTypes.ActivityItem>();
  let nextActivityId = { var value : Nat = 1 };
  let dismissedActivities = Map.empty<Principal, Set.Set<Nat>>();

  // --- New state: officials ---
  let officials = List.empty<OfficialTypes.Official>();
  let nextOfficialId = { var value : Nat = 1 };

  // --- New state: referees ---
  let referees = List.empty<RefereeTypes.Referee>();
  let nextRefereeId = { var value : Nat = 1 };

  // --- Seed on first load (runs once; data persists via enhanced orthogonal persistence) ---
  nextTeamId.value   := TeamsLib.seed(teams, 1);
  nextPlayerId.value := PlayersLib.seed(players, 1);
  nextMatchId.value  := MatchesLib.seed(matches, 1);
  nextNewsId.value   := NewsLib.seed(articles, 1);
  OfficialsLib.seed(officials, nextOfficialId);
  RefereesLib.seed(referees, nextRefereeId);

  // --- Mixins ---
  include TeamsApi(teams, nextTeamId, admins);
  include PlayersApi(players, nextPlayerId, admins);
  include MatchesApi(matches, nextMatchId, admins, activities, nextActivityId, userProfiles);
  include NewsApi(articles, nextNewsId, admins);
  include UsersApi(userProfiles, activities, nextActivityId);
  include NotificationsApi(activities, nextActivityId, dismissedActivities);
  include OfficialsApi(officials, nextOfficialId, admins);
  include RefereesApi(referees, nextRefereeId, admins);
};
