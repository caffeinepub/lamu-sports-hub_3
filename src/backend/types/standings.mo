import Common "common";

module {
  public type TeamId = Common.TeamId;

  public type Standing = {
    position : Nat;
    teamId : TeamId;
    played : Nat;
    wins : Nat;
    draws : Nat;
    losses : Nat;
    goalsFor : Nat;
    goalsAgainst : Nat;
    goalDiff : Int;
    points : Nat;
  };
};
