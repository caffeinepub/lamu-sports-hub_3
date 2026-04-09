import Common "common";

module {
  public type PlayerId = Common.PlayerId;
  public type TeamId = Common.TeamId;

  public type Player = {
    id : PlayerId;
    name : Text;
    teamId : TeamId;
    position : Text;
    goals : Nat;
    assists : Nat;
    yellowCards : Nat;
  };
};
