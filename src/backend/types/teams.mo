import Common "common";

module {
  public type TeamId = Common.TeamId;

  public type Team = {
    id : TeamId;
    name : Text;
    abbreviation : Text;
    emoji : Text;
    wins : Nat;
    draws : Nat;
    losses : Nat;
    goalsFor : Nat;
    goalsAgainst : Nat;
  };
};
