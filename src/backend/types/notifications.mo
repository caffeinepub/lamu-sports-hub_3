import Common "common";

module {
  public type ActivityId = Common.ActivityId;
  public type Timestamp = Common.Timestamp;

  public type ActionType = {
    #join;
    #follow_team;
    #follow_player;
    #goal;
    #status_change;
  };

  /// Single activity event stored globally
  public type ActivityItem = {
    id : ActivityId;
    actorPrincipal : ?Principal;
    actorName : Text;
    actionType : ActionType;
    entityId : Nat;
    entityName : Text;
    timestamp : Timestamp;
  };
};
