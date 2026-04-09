import List "mo:core/List";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import OfficialTypes "../types/officials";
import OfficialsLib "../lib/officials";

mixin (
  officials : List.List<OfficialTypes.Official>,
  nextOfficialId : { var value : Nat },
  _admins : List.List<Principal>,
) {
  /// Returns all officials (public read)
  public query func getAllOfficials() : async [OfficialTypes.Official] {
    OfficialsLib.getAll(officials)
  };

  /// Returns a single official by id
  public query func getOfficial(id : Nat) : async ?OfficialTypes.Official {
    OfficialsLib.getById(officials, id)
  };

  /// Admin-only: create an official record
  public shared ({ caller }) func addOfficial(
    name : Text,
    role : Text,
    phone : Text,
    email : Text,
    area : Text,
  ) : async Nat {
    if (caller.isAnonymous()) { Runtime.trap("Unauthorized") };
    OfficialsLib.add(officials, nextOfficialId, name, role, phone, email, area)
  };

  /// Admin-only: update an official record
  public shared ({ caller }) func updateOfficial(
    id : Nat,
    name : Text,
    role : Text,
    phone : Text,
    email : Text,
    area : Text,
  ) : async Bool {
    if (caller.isAnonymous()) { Runtime.trap("Unauthorized") };
    OfficialsLib.update(officials, id, name, role, phone, email, area)
  };

  /// Admin-only: delete an official record
  public shared ({ caller }) func deleteOfficial(id : Nat) : async Bool {
    if (caller.isAnonymous()) { Runtime.trap("Unauthorized") };
    OfficialsLib.remove(officials, id)
  };
};
