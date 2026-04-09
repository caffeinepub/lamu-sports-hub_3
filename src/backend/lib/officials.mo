import List "mo:core/List";
import OfficialTypes "../types/officials";

module {
  public type Official = OfficialTypes.Official;

  public func getAll(officials : List.List<Official>) : [Official] {
    officials.toArray()
  };

  public func getById(officials : List.List<Official>, id : Nat) : ?Official {
    officials.find(func(o : Official) : Bool { o.id == id })
  };

  public func add(
    officials : List.List<Official>,
    nextId : { var value : Nat },
    name : Text,
    role : Text,
    phone : Text,
    email : Text,
    area : Text,
  ) : Nat {
    let id = nextId.value;
    officials.add({ id; name; role; phone; email; area });
    nextId.value += 1;
    id
  };

  public func update(
    officials : List.List<Official>,
    id : Nat,
    name : Text,
    role : Text,
    phone : Text,
    email : Text,
    area : Text,
  ) : Bool {
    let idx = officials.findIndex(func(o : Official) : Bool { o.id == id });
    switch (idx) {
      case null { false };
      case (?i) {
        let existing = officials.at(i);
        officials.put(i, { existing with name; role; phone; email; area });
        true
      };
    }
  };

  public func remove(officials : List.List<Official>, id : Nat) : Bool {
    let idx = officials.findIndex(func(o : Official) : Bool { o.id == id });
    switch (idx) {
      case null { false };
      case (?_) {
        let filtered = officials.filter(func(o : Official) : Bool { o.id != id });
        officials.clear();
        officials.append(filtered);
        true
      };
    }
  };

  public func seed(officials : List.List<Official>, nextId : { var value : Nat }) : () {
    if (officials.size() > 0) { return };
    let seedData : [(Text, Text, Text, Text, Text)] = [
      ("Ali Hassan Mwana", "League Chairman", "+254705100001", "chairman@lamusportshub.co.ke", "Lamu Town"),
      ("Fatuma Shee", "Secretary General", "+254705100002", "secretary@lamusportshub.co.ke", "Shela"),
      ("Omar Said", "Match Commissioner", "+254705100003", "commissioner@lamusportshub.co.ke", "Hindi"),
    ];
    for ((name, role, phone, email, area) in seedData.vals()) {
      ignore add(officials, nextId, name, role, phone, email, area);
    };
  };
};
