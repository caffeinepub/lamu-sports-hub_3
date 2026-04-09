import Map "mo:core/Map";
import List "mo:core/List";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import UserTypes "../types/users";
import NotifTypes "../types/notifications";
import UsersLib "../lib/users";
import NotificationsLib "../lib/notifications";

mixin (
  userProfiles : Map.Map<Principal, UserTypes.UserProfile>,
  activities : List.List<NotifTypes.ActivityItem>,
  nextActivityId : { var value : Nat },
) {
  /// Returns caller's profile (or sensible defaults if first visit)
  public query ({ caller }) func getUserProfile() : async UserTypes.UserProfilePublic {
    UsersLib.getOrDefault(userProfiles, caller)
  };

  /// Updates displayName, areaOfResidence, teamAffiliation for caller
  public shared ({ caller }) func updateUserProfile(
    displayName : Text,
    area : Text,
    teamAffiliation : Text,
  ) : async () {
    if (caller.isAnonymous()) { Runtime.trap("Unauthorized") };
    UsersLib.updateProfile(userProfiles, caller, displayName, area, teamAffiliation);
  };

  /// Sets caller's favourite team
  public shared ({ caller }) func setFavouriteTeam(teamId : Nat) : async () {
    if (caller.isAnonymous()) { Runtime.trap("Unauthorized") };
    UsersLib.setFavouriteTeam(userProfiles, caller, teamId);
  };

  /// Follow a team (adds to followedTeamIds)
  public shared ({ caller }) func followTeam(teamId : Nat) : async () {
    if (caller.isAnonymous()) { Runtime.trap("Unauthorized") };
    UsersLib.followTeam(userProfiles, caller, teamId);
    let profile = UsersLib.getOrDefault(userProfiles, caller);
    let actorName = if (profile.displayName == "") { caller.toText() } else { profile.displayName };
    NotificationsLib.push(
      activities, nextActivityId,
      ?caller, actorName,
      #follow_team, teamId, "Team " # teamId.toText(),
    );
  };

  /// Unfollow a team
  public shared ({ caller }) func unfollowTeam(teamId : Nat) : async () {
    if (caller.isAnonymous()) { Runtime.trap("Unauthorized") };
    UsersLib.unfollowTeam(userProfiles, caller, teamId);
  };

  /// Follow a player (adds to followedPlayerIds)
  public shared ({ caller }) func followPlayer(playerId : Nat) : async () {
    if (caller.isAnonymous()) { Runtime.trap("Unauthorized") };
    UsersLib.followPlayer(userProfiles, caller, playerId);
    let profile = UsersLib.getOrDefault(userProfiles, caller);
    let actorName = if (profile.displayName == "") { caller.toText() } else { profile.displayName };
    NotificationsLib.push(
      activities, nextActivityId,
      ?caller, actorName,
      #follow_player, playerId, "Player " # playerId.toText(),
    );
  };

  /// Unfollow a player
  public shared ({ caller }) func unfollowPlayer(playerId : Nat) : async () {
    if (caller.isAnonymous()) { Runtime.trap("Unauthorized") };
    UsersLib.unfollowPlayer(userProfiles, caller, playerId);
  };
};
