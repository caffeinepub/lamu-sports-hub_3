import List "mo:core/List";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import RefereeTypes "../types/referees";
import RefereesLib "../lib/referees";

mixin (
  referees : List.List<RefereeTypes.Referee>,
  nextRefereeId : { var value : Nat },
  _admins : List.List<Principal>,
) {
  /// Returns all referees (public read)
  public query func getAllReferees() : async [RefereeTypes.Referee] {
    RefereesLib.getAll(referees)
  };

  /// Returns a single referee by id
  public query func getReferee(id : Nat) : async ?RefereeTypes.Referee {
    RefereesLib.getById(referees, id)
  };

  /// Admin-only: register a referee
  public shared ({ caller }) func addReferee(
    name : Text,
    licenseNumber : Text,
    phone : Text,
  ) : async Nat {
    if (caller.isAnonymous()) { Runtime.trap("Unauthorized") };
    RefereesLib.add(referees, nextRefereeId, name, licenseNumber, phone)
  };

  /// Admin-only: update referee details and status
  public shared ({ caller }) func updateReferee(
    id : Nat,
    name : Text,
    licenseNumber : Text,
    status : RefereeTypes.RefereeStatus,
    phone : Text,
  ) : async Bool {
    if (caller.isAnonymous()) { Runtime.trap("Unauthorized") };
    RefereesLib.update(referees, id, name, licenseNumber, status, phone)
  };

  /// Admin-only: remove a referee
  public shared ({ caller }) func deleteReferee(id : Nat) : async Bool {
    if (caller.isAnonymous()) { Runtime.trap("Unauthorized") };
    RefereesLib.remove(referees, id)
  };

  /// Admin-only: assign a referee to a match
  public shared ({ caller }) func assignRefereeToMatch(refereeId : Nat, matchId : Nat) : async Bool {
    if (caller.isAnonymous()) { Runtime.trap("Unauthorized") };
    RefereesLib.assignMatch(referees, refereeId, matchId)
  };

  /// Admin-only: unassign a referee from a match
  public shared ({ caller }) func unassignRefereeFromMatch(refereeId : Nat, matchId : Nat) : async Bool {
    if (caller.isAnonymous()) { Runtime.trap("Unauthorized") };
    RefereesLib.unassignMatch(referees, refereeId, matchId)
  };
};
