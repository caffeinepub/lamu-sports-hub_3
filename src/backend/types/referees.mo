import Common "common";

module {
  public type RefereeId = Common.RefereeId;
  public type MatchId = Common.MatchId;

  public type RefereeStatus = {
    #active;
    #inactive;
  };

  public type Referee = {
    id : RefereeId;
    name : Text;
    licenseNumber : Text;
    status : RefereeStatus;
    phone : Text;
    assignedMatchIds : [MatchId];
  };
};
