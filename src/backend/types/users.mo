import Common "common";

module {
  public type TeamId = Common.TeamId;
  public type PlayerId = Common.PlayerId;

  /// Stored per-principal in a Map<Principal, UserProfile>
  public type UserProfile = {
    displayName : Text;
    areaOfResidence : Text;
    teamAffiliation : Text;
    favouriteTeamId : ?TeamId;
    followedTeamIds : [TeamId];
    followedPlayerIds : [PlayerId];
  };

  /// Public-facing (shared) — same shape; all fields are already shared types
  public type UserProfilePublic = UserProfile;
};
