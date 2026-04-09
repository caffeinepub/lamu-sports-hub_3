import List "mo:core/List";
import RefereeTypes "../types/referees";

module {
  public type Referee = RefereeTypes.Referee;
  public type RefereeStatus = RefereeTypes.RefereeStatus;

  public func getAll(referees : List.List<Referee>) : [Referee] {
    referees.toArray()
  };

  public func getById(referees : List.List<Referee>, id : Nat) : ?Referee {
    referees.find(func(r : Referee) : Bool { r.id == id })
  };

  public func add(
    referees : List.List<Referee>,
    nextId : { var value : Nat },
    name : Text,
    licenseNumber : Text,
    phone : Text,
  ) : Nat {
    let id = nextId.value;
    referees.add({ id; name; licenseNumber; status = #active; phone; assignedMatchIds = [] });
    nextId.value += 1;
    id
  };

  public func update(
    referees : List.List<Referee>,
    id : Nat,
    name : Text,
    licenseNumber : Text,
    status : RefereeStatus,
    phone : Text,
  ) : Bool {
    let idx = referees.findIndex(func(r : Referee) : Bool { r.id == id });
    switch (idx) {
      case null { false };
      case (?i) {
        let existing = referees.at(i);
        referees.put(i, { existing with name; licenseNumber; status; phone });
        true
      };
    }
  };

  public func remove(referees : List.List<Referee>, id : Nat) : Bool {
    let idx = referees.findIndex(func(r : Referee) : Bool { r.id == id });
    switch (idx) {
      case null { false };
      case (?_) {
        let filtered = referees.filter(func(r : Referee) : Bool { r.id != id });
        referees.clear();
        referees.append(filtered);
        true
      };
    }
  };

  public func assignMatch(
    referees : List.List<Referee>,
    refereeId : Nat,
    matchId : Nat,
  ) : Bool {
    let idx = referees.findIndex(func(r : Referee) : Bool { r.id == refereeId });
    switch (idx) {
      case null { false };
      case (?i) {
        let existing = referees.at(i);
        let alreadyAssigned = existing.assignedMatchIds.find(func(mid : Nat) : Bool { mid == matchId });
        if (alreadyAssigned != null) { return true };
        referees.put(i, { existing with assignedMatchIds = existing.assignedMatchIds.concat([matchId]) });
        true
      };
    }
  };

  public func unassignMatch(
    referees : List.List<Referee>,
    refereeId : Nat,
    matchId : Nat,
  ) : Bool {
    let idx = referees.findIndex(func(r : Referee) : Bool { r.id == refereeId });
    switch (idx) {
      case null { false };
      case (?i) {
        let existing = referees.at(i);
        let updated = existing.assignedMatchIds.filter(func(mid : Nat) : Bool { mid != matchId });
        referees.put(i, { existing with assignedMatchIds = updated });
        true
      };
    }
  };

  public func seed(referees : List.List<Referee>, nextId : { var value : Nat }) : () {
    if (referees.size() > 0) { return };
    let seedData : [(Text, Text, Text)] = [
      ("Juma Abdalla", "KFF-REF-001", "+254705200001"),
      ("Hassan Mkomani", "KFF-REF-002", "+254705200002"),
      ("Salim Lamu", "KFF-REF-003", "+254705200003"),
    ];
    for ((name, license, phone) in seedData.vals()) {
      ignore add(referees, nextId, name, license, phone);
    };
  };
};
