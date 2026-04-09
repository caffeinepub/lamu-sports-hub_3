import Map "mo:core/Map";
import Principal "mo:core/Principal";
import UserTypes "../types/users";

module {
  public type UserProfile = UserTypes.UserProfile;

  let defaultProfile : UserProfile = {
    displayName = "";
    areaOfResidence = "";
    teamAffiliation = "";
    favouriteTeamId = null;
    followedTeamIds = [];
    followedPlayerIds = [];
  };

  /// Returns the caller's profile, or a default if not found
  public func getOrDefault(
    profiles : Map.Map<Principal, UserProfile>,
    caller : Principal,
  ) : UserProfile {
    switch (profiles.get(caller)) {
      case (?p) { p };
      case null { defaultProfile };
    }
  };

  /// Upserts displayName, areaOfResidence, teamAffiliation for the caller
  public func updateProfile(
    profiles : Map.Map<Principal, UserProfile>,
    caller : Principal,
    displayName : Text,
    area : Text,
    teamAffiliation : Text,
  ) : () {
    let existing = getOrDefault(profiles, caller);
    profiles.add(caller, { existing with displayName; areaOfResidence = area; teamAffiliation });
  };

  /// Sets favouriteTeamId for the caller
  public func setFavouriteTeam(
    profiles : Map.Map<Principal, UserProfile>,
    caller : Principal,
    teamId : Nat,
  ) : () {
    let existing = getOrDefault(profiles, caller);
    profiles.add(caller, { existing with favouriteTeamId = ?teamId });
  };

  /// Adds teamId to followedTeamIds (idempotent)
  public func followTeam(
    profiles : Map.Map<Principal, UserProfile>,
    caller : Principal,
    teamId : Nat,
  ) : () {
    let existing = getOrDefault(profiles, caller);
    let alreadyFollowing = existing.followedTeamIds.find(func(id : Nat) : Bool { id == teamId });
    if (alreadyFollowing == null) {
      profiles.add(caller, { existing with followedTeamIds = existing.followedTeamIds.concat([teamId]) });
    };
  };

  /// Removes teamId from followedTeamIds
  public func unfollowTeam(
    profiles : Map.Map<Principal, UserProfile>,
    caller : Principal,
    teamId : Nat,
  ) : () {
    let existing = getOrDefault(profiles, caller);
    let updated = existing.followedTeamIds.filter(func(id : Nat) : Bool { id != teamId });
    profiles.add(caller, { existing with followedTeamIds = updated });
  };

  /// Adds playerId to followedPlayerIds (idempotent)
  public func followPlayer(
    profiles : Map.Map<Principal, UserProfile>,
    caller : Principal,
    playerId : Nat,
  ) : () {
    let existing = getOrDefault(profiles, caller);
    let alreadyFollowing = existing.followedPlayerIds.find(func(id : Nat) : Bool { id == playerId });
    if (alreadyFollowing == null) {
      profiles.add(caller, { existing with followedPlayerIds = existing.followedPlayerIds.concat([playerId]) });
    };
  };

  /// Removes playerId from followedPlayerIds
  public func unfollowPlayer(
    profiles : Map.Map<Principal, UserProfile>,
    caller : Principal,
    playerId : Nat,
  ) : () {
    let existing = getOrDefault(profiles, caller);
    let updated = existing.followedPlayerIds.filter(func(id : Nat) : Bool { id != playerId });
    profiles.add(caller, { existing with followedPlayerIds = updated });
  };
};
