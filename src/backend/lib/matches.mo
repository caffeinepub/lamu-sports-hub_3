import List "mo:core/List";
import Principal "mo:core/Principal";
import Types "../types/matches";

module {
  public type Match = Types.Match;
  public type MatchStatus = Types.MatchStatus;

  public func getAll(matches : List.List<Match>) : [Match] {
    matches.toArray()
  };

  public func getById(matches : List.List<Match>, id : Nat) : ?Match {
    matches.find(func(m) { m.id == id })
  };

  public func getByTeam(matches : List.List<Match>, teamId : Nat) : [Match] {
    matches.filter(func(m) { m.homeTeamId == teamId or m.awayTeamId == teamId }).toArray()
  };

  public func add(
    matches : List.List<Match>,
    nextId : Nat,
    homeTeamId : Nat,
    awayTeamId : Nat,
    matchDate : Text,
    matchTime : Text,
  ) : Nat {
    let m : Match = {
      id = nextId;
      homeTeamId;
      awayTeamId;
      homeScore = 0;
      awayScore = 0;
      status = #scheduled;
      matchDate;
      matchTime;
      joiners = [];
    };
    matches.add(m);
    nextId
  };

  public func updateScore(matches : List.List<Match>, id : Nat, homeScore : Nat, awayScore : Nat) : Bool {
    let idx = matches.findIndex(func(m) { m.id == id });
    switch (idx) {
      case null { false };
      case (?i) {
        let existing = matches.at(i);
        matches.put(i, { existing with homeScore; awayScore });
        true
      };
    }
  };

  public func updateStatus(matches : List.List<Match>, id : Nat, status : MatchStatus) : Bool {
    let idx = matches.findIndex(func(m) { m.id == id });
    switch (idx) {
      case null { false };
      case (?i) {
        let existing = matches.at(i);
        matches.put(i, { existing with status });
        true
      };
    }
  };

  public func joinMatch(matches : List.List<Match>, id : Nat, caller : Principal) : { #ok; #err : Text } {
    if (caller.isAnonymous()) { return #err("Login required") };
    let idx = matches.findIndex(func(m) { m.id == id });
    switch (idx) {
      case null { #err("Match not found") };
      case (?i) {
        let existing = matches.at(i);
        if (existing.status != #scheduled) {
          return #err("Can only join scheduled matches");
        };
        let alreadyJoined = existing.joiners.find(func(p : Principal) : Bool { p == caller });
        if (alreadyJoined != null) {
          return #err("Already joined this match");
        };
        let newJoiners = existing.joiners.concat([caller]);
        matches.put(i, { existing with joiners = newJoiners });
        #ok
      };
    }
  };

  public func hasJoinedMatch(matches : List.List<Match>, id : Nat, caller : Principal) : Bool {
    switch (matches.find(func(m) { m.id == id })) {
      case null { false };
      case (?m) {
        m.joiners.find(func(p : Principal) : Bool { p == caller }) != null
      };
    }
  };

  public func seed(matches : List.List<Match>, startId : Nat) : Nat {
    // (homeTeamId, awayTeamId, homeScore, awayScore, status, date, time)
    let seedData : [(Nat, Nat, Nat, Nat, MatchStatus, Text, Text)] = [
      // Finished matches
      (1, 2, 3, 1, #finished, "2026-04-01", "15:00"),
      (3, 4, 2, 2, #finished, "2026-04-01", "17:00"),
      (5, 6, 1, 0, #finished, "2026-04-03", "15:00"),
      (7, 8, 2, 1, #finished, "2026-04-03", "17:00"),
      (2, 3, 1, 3, #finished, "2026-04-05", "15:00"),
      (4, 1, 0, 2, #finished, "2026-04-05", "17:00"),
      (6, 7, 2, 0, #finished, "2026-04-07", "15:00"),
      (8, 5, 1, 2, #finished, "2026-04-07", "17:00"),
      // Live matches
      (1, 3, 1, 0, #live,     "2026-04-09", "15:00"),
      (2, 5, 0, 0, #live,     "2026-04-09", "17:00"),
      // Scheduled matches
      (4, 6, 0, 0, #scheduled, "2026-04-12", "15:00"),
      (7, 1, 0, 0, #scheduled, "2026-04-12", "17:00"),
    ];
    var id = startId;
    for ((htId, atId, hs, as_, status, date, time) in seedData.vals()) {
      let m : Match = {
        id;
        homeTeamId = htId;
        awayTeamId = atId;
        homeScore = hs;
        awayScore = as_;
        status;
        matchDate = date;
        matchTime = time;
        joiners = [];
      };
      matches.add(m);
      id += 1;
    };
    id
  };
};
