import List "mo:core/List";
import Types "../types/teams";

module {
  public type Team = Types.Team;

  public func getAll(teams : List.List<Team>) : [Team] {
    teams.toArray()
  };

  public func getById(teams : List.List<Team>, id : Nat) : ?Team {
    teams.find(func(t) { t.id == id })
  };

  public func add(
    teams : List.List<Team>,
    nextId : Nat,
    name : Text,
    abbreviation : Text,
    emoji : Text,
  ) : Nat {
    let team : Team = {
      id = nextId;
      name;
      abbreviation;
      emoji;
      wins = 0;
      draws = 0;
      losses = 0;
      goalsFor = 0;
      goalsAgainst = 0;
    };
    teams.add(team);
    nextId
  };

  public func update(
    teams : List.List<Team>,
    id : Nat,
    name : Text,
    abbreviation : Text,
    emoji : Text,
    wins : Nat,
    draws : Nat,
    losses : Nat,
    goalsFor : Nat,
    goalsAgainst : Nat,
  ) : Bool {
    let idx = teams.findIndex(func(t) { t.id == id });
    switch (idx) {
      case null { false };
      case (?i) {
        let existing = teams.at(i);
        teams.put(
          i,
          {
            existing with
            name;
            abbreviation;
            emoji;
            wins;
            draws;
            losses;
            goalsFor;
            goalsAgainst;
          },
        );
        true
      };
    }
  };

  public func remove(teams : List.List<Team>, id : Nat) : Bool {
    let idx = teams.findIndex(func(t) { t.id == id });
    switch (idx) {
      case null { false };
      case (?i) {
        // shift remaining elements by rebuilding
        let filtered = teams.filter(func(t) { t.id != id });
        teams.clear();
        teams.append(filtered);
        ignore i;
        true
      };
    }
  };

  public func seed(teams : List.List<Team>, startId : Nat) : Nat {
    let seedData : [(Text, Text, Text, Nat, Nat, Nat, Nat, Nat)] = [
      ("Lamu United FC",    "LUF", "⚽", 8, 3, 3, 24, 14),
      ("Manda FC",          "MFC", "🦁", 7, 4, 3, 20, 13),
      ("Shela Wanderers",   "SWA", "🌊", 6, 5, 3, 18, 15),
      ("Pate Island SC",    "PIS", "🏝️", 6, 3, 5, 17, 18),
      ("Hindi FC",          "HFC", "🔥", 5, 4, 5, 16, 17),
      ("Mokowe City FC",    "MCF", "🏙️", 4, 5, 5, 14, 18),
      ("Faza Rangers",      "FAZ", "⚡", 3, 4, 7, 12, 22),
      ("Kiunga Athletic",   "KAT", "🏃", 2, 3, 9, 10, 28),
    ];
    var id = startId;
    for ((name, abbr, emoji, w, d, l, gf, ga) in seedData.vals()) {
      let team : Team = {
        id;
        name;
        abbreviation = abbr;
        emoji;
        wins = w;
        draws = d;
        losses = l;
        goalsFor = gf;
        goalsAgainst = ga;
      };
      teams.add(team);
      id += 1;
    };
    id
  };
};
