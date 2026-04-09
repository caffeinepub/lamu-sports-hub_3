import List "mo:core/List";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import PlayerTypes "../types/players";
import PlayersLib "../lib/players";

mixin (
  players : List.List<PlayerTypes.Player>,
  nextPlayerId : { var value : Nat },
  _admins : List.List<Principal>
) {
  public query func getAllPlayers() : async [PlayerTypes.Player] {
    PlayersLib.getAll(players)
  };

  public query func getPlayer(id : Nat) : async ?PlayerTypes.Player {
    PlayersLib.getById(players, id)
  };

  public query func getPlayersByTeam(teamId : Nat) : async [PlayerTypes.Player] {
    PlayersLib.getByTeam(players, teamId)
  };

  public shared ({ caller }) func addPlayer(
    name : Text,
    teamId : Nat,
    position : Text,
    goals : Nat,
    assists : Nat,
    yellowCards : Nat,
  ) : async Nat {
    if (caller.isAnonymous()) { Runtime.trap("Unauthorized") };
    let id = PlayersLib.add(players, nextPlayerId.value, name, teamId, position, goals, assists, yellowCards);
    nextPlayerId.value += 1;
    id
  };

  public shared ({ caller }) func updatePlayer(
    id : Nat,
    name : Text,
    teamId : Nat,
    position : Text,
    goals : Nat,
    assists : Nat,
    yellowCards : Nat,
  ) : async Bool {
    if (caller.isAnonymous()) { Runtime.trap("Unauthorized") };
    PlayersLib.update(players, id, name, teamId, position, goals, assists, yellowCards)
  };

  public shared ({ caller }) func deletePlayer(id : Nat) : async Bool {
    if (caller.isAnonymous()) { Runtime.trap("Unauthorized") };
    PlayersLib.remove(players, id)
  };
};
