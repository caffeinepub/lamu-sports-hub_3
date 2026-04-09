import List "mo:core/List";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import MatchTypes "../types/matches";
import NotifTypes "../types/notifications";
import MatchesLib "../lib/matches";
import NotificationsLib "../lib/notifications";
import UserTypes "../types/users";
import Map "mo:core/Map";

mixin (
  matches : List.List<MatchTypes.Match>,
  nextMatchId : { var value : Nat },
  _admins : List.List<Principal>,
  activities : List.List<NotifTypes.ActivityItem>,
  nextActivityId : { var value : Nat },
  userProfiles : Map.Map<Principal, UserTypes.UserProfile>,
) {
  public query func getAllMatches() : async [MatchTypes.Match] {
    MatchesLib.getAll(matches)
  };

  public query func getMatch(id : Nat) : async ?MatchTypes.Match {
    MatchesLib.getById(matches, id)
  };

  public query func getMatchesByTeam(teamId : Nat) : async [MatchTypes.Match] {
    MatchesLib.getByTeam(matches, teamId)
  };

  public shared ({ caller }) func addMatch(
    homeTeamId : Nat,
    awayTeamId : Nat,
    matchDate : Text,
    matchTime : Text,
  ) : async Nat {
    if (caller.isAnonymous()) { Runtime.trap("Unauthorized") };
    let id = MatchesLib.add(matches, nextMatchId.value, homeTeamId, awayTeamId, matchDate, matchTime);
    nextMatchId.value += 1;
    id
  };

  public shared ({ caller }) func updateMatchScore(id : Nat, homeScore : Nat, awayScore : Nat) : async Bool {
    if (caller.isAnonymous()) { Runtime.trap("Unauthorized") };
    let prevMatch = MatchesLib.getById(matches, id);
    let updated = MatchesLib.updateScore(matches, id, homeScore, awayScore);
    if (updated) {
      switch (prevMatch) {
        case (?prev) {
          if (prev.homeScore != homeScore or prev.awayScore != awayScore) {
            let matchName = "Match #" # id.toText();
            NotificationsLib.push(
              activities, nextActivityId,
              null, "Official",
              #goal, id, matchName # " " # homeScore.toText() # "-" # awayScore.toText(),
            );
          };
        };
        case null {};
      };
    };
    updated
  };

  public shared ({ caller }) func updateMatchStatus(id : Nat, status : MatchTypes.MatchStatus) : async Bool {
    if (caller.isAnonymous()) { Runtime.trap("Unauthorized") };
    let updated = MatchesLib.updateStatus(matches, id, status);
    if (updated) {
      let statusText = switch (status) {
        case (#scheduled) { "scheduled" };
        case (#live) { "live" };
        case (#finished) { "finished" };
      };
      NotificationsLib.push(
        activities, nextActivityId,
        null, "Official",
        #status_change, id, "Match #" # id.toText() # " is now " # statusText,
      );
    };
    updated
  };

  public shared ({ caller }) func scheduleMatch(
    homeTeamId : Nat,
    awayTeamId : Nat,
    matchDate : Text,
    matchTime : Text,
  ) : async Nat {
    if (caller.isAnonymous()) { Runtime.trap("Unauthorized") };
    let id = MatchesLib.add(matches, nextMatchId.value, homeTeamId, awayTeamId, matchDate, matchTime);
    nextMatchId.value += 1;
    id
  };

  public shared ({ caller }) func joinMatch(matchId : Nat) : async { #ok; #err : Text } {
    let result = MatchesLib.joinMatch(matches, matchId, caller);
    switch (result) {
      case (#ok) {
        let actorName = switch (userProfiles.get(caller)) {
          case (?p) { if (p.displayName == "") { caller.toText() } else { p.displayName } };
          case null { caller.toText() };
        };
        NotificationsLib.push(
          activities, nextActivityId,
          ?caller, actorName,
          #join, matchId, "Match #" # matchId.toText(),
        );
        #ok
      };
      case (#err(e)) { #err(e) };
    }
  };

  public query ({ caller }) func hasJoinedMatch(matchId : Nat) : async Bool {
    MatchesLib.hasJoinedMatch(matches, matchId, caller)
  };
};
