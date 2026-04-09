import List "mo:core/List";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import TeamTypes "../types/teams";
import StandingTypes "../types/standings";
import TeamsLib "../lib/teams";
import StandingsLib "../lib/standings";

mixin (
  teams : List.List<TeamTypes.Team>,
  nextTeamId : { var value : Nat },
  _admins : List.List<Principal>
) {
  public query func getAllTeams() : async [TeamTypes.Team] {
    TeamsLib.getAll(teams)
  };

  public query func getTeam(id : Nat) : async ?TeamTypes.Team {
    TeamsLib.getById(teams, id)
  };

  public query func getStandings() : async [StandingTypes.Standing] {
    StandingsLib.compute(teams)
  };

  public shared ({ caller }) func addTeam(name : Text, abbreviation : Text, emoji : Text) : async Nat {
    if (caller.isAnonymous()) { Runtime.trap("Unauthorized") };
    let id = TeamsLib.add(teams, nextTeamId.value, name, abbreviation, emoji);
    nextTeamId.value += 1;
    id
  };

  public shared ({ caller }) func updateTeam(
    id : Nat,
    name : Text,
    abbreviation : Text,
    emoji : Text,
    wins : Nat,
    draws : Nat,
    losses : Nat,
    goalsFor : Nat,
    goalsAgainst : Nat,
  ) : async Bool {
    if (caller.isAnonymous()) { Runtime.trap("Unauthorized") };
    TeamsLib.update(teams, id, name, abbreviation, emoji, wins, draws, losses, goalsFor, goalsAgainst)
  };

  public shared ({ caller }) func deleteTeam(id : Nat) : async Bool {
    if (caller.isAnonymous()) { Runtime.trap("Unauthorized") };
    TeamsLib.remove(teams, id)
  };
};
