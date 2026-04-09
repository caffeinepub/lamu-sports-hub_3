import Common "common";

module {
  public type MatchId = Common.MatchId;
  public type TeamId = Common.TeamId;

  public type MatchStatus = {
    #scheduled;
    #live;
    #finished;
  };

  public type Match = {
    id : MatchId;
    homeTeamId : TeamId;
    awayTeamId : TeamId;
    homeScore : Nat;
    awayScore : Nat;
    status : MatchStatus;
    matchDate : Text;
    matchTime : Text;
    joiners : [Principal];
  };
};
