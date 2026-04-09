import List "mo:core/List";
import Types "../types/players";

module {
  public type Player = Types.Player;

  public func getAll(players : List.List<Player>) : [Player] {
    players.toArray()
  };

  public func getById(players : List.List<Player>, id : Nat) : ?Player {
    players.find(func(p) { p.id == id })
  };

  public func getByTeam(players : List.List<Player>, teamId : Nat) : [Player] {
    players.filter(func(p) { p.teamId == teamId }).toArray()
  };

  public func add(
    players : List.List<Player>,
    nextId : Nat,
    name : Text,
    teamId : Nat,
    position : Text,
    goals : Nat,
    assists : Nat,
    yellowCards : Nat,
  ) : Nat {
    let player : Player = {
      id = nextId;
      name;
      teamId;
      position;
      goals;
      assists;
      yellowCards;
    };
    players.add(player);
    nextId
  };

  public func update(
    players : List.List<Player>,
    id : Nat,
    name : Text,
    teamId : Nat,
    position : Text,
    goals : Nat,
    assists : Nat,
    yellowCards : Nat,
  ) : Bool {
    let idx = players.findIndex(func(p) { p.id == id });
    switch (idx) {
      case null { false };
      case (?i) {
        let existing = players.at(i);
        players.put(i, { existing with name; teamId; position; goals; assists; yellowCards });
        true
      };
    }
  };

  public func remove(players : List.List<Player>, id : Nat) : Bool {
    let idx = players.findIndex(func(p) { p.id == id });
    switch (idx) {
      case null { false };
      case (?_i) {
        let filtered = players.filter(func(p) { p.id != id });
        players.clear();
        players.append(filtered);
        true
      };
    }
  };

  public func seed(players : List.List<Player>, startId : Nat) : Nat {
    // (name, teamId, position, goals, assists, yellowCards)
    let seedData : [(Text, Nat, Text, Nat, Nat, Nat)] = [
      // Lamu United FC (teamId 1)
      ("Omar Abdallah",     1, "Forward",    15, 6, 1),
      ("Salim Hassan",      1, "Midfielder",  8, 9, 2),
      ("Juma Mwana",        1, "Defender",    1, 3, 1),
      // Manda FC (teamId 2)
      ("Ali Kombo",         2, "Forward",    12, 4, 0),
      ("Rashid Faki",       2, "Midfielder",  5, 7, 3),
      ("Bakari Suleiman",   2, "Goalkeeper",  0, 1, 1),
      // Shela Wanderers (teamId 3)
      ("Yusuf Mzee",        3, "Forward",    10, 5, 2),
      ("Hassan Bwana",      3, "Midfielder",  4, 8, 1),
      ("Hamisi Omar",       3, "Defender",    2, 2, 0),
      // Pate Island SC (teamId 4)
      ("Fadhili Konde",     4, "Forward",     9, 3, 2),
      ("Mohammed Jabu",     4, "Midfielder",  6, 5, 3),
      ("Kassim Pwani",      4, "Defender",    1, 1, 1),
      // Hindi FC (teamId 5)
      ("Suleiman Ngao",     5, "Forward",     8, 4, 1),
      ("Abdul Karimi",      5, "Midfielder",  3, 6, 2),
      ("Musa Baraka",       5, "Goalkeeper",  0, 0, 0),
      // Mokowe City FC (teamId 6)
      ("Hemed Bahari",      6, "Forward",     7, 3, 2),
      ("Issa Mvita",        6, "Midfielder",  5, 4, 1),
      ("Ramadhan Lewa",     6, "Defender",    0, 2, 3),
      // Faza Rangers (teamId 7)
      ("Khalid Nuru",       7, "Forward",     5, 2, 1),
      ("Saleh Barua",       7, "Midfielder",  2, 3, 2),
      ("Amri Damu",         7, "Defender",    1, 0, 1),
      // Kiunga Athletic (teamId 8)
      ("Talib Sauti",       8, "Forward",     4, 1, 0),
      ("Idris Pwani",       8, "Midfielder",  1, 2, 2),
      ("Najib Kali",        8, "Goalkeeper",  0, 0, 1),
    ];
    var id = startId;
    for ((name, teamId, position, goals, assists, yellowCards) in seedData.vals()) {
      let player : Player = { id; name; teamId; position; goals; assists; yellowCards };
      players.add(player);
      id += 1;
    };
    id
  };
};
