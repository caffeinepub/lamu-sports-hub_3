import List "mo:core/List";
import Map "mo:core/Map";
import Set "mo:core/Set";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import NotifTypes "../types/notifications";
import NotificationsLib "../lib/notifications";

mixin (
  activities : List.List<NotifTypes.ActivityItem>,
  nextActivityId : { var value : Nat },
  dismissedActivities : Map.Map<Principal, Set.Set<Nat>>,
) {
  /// Returns the last 50 global activity items, most recent first
  public query func getActivities() : async [NotifTypes.ActivityItem] {
    NotificationsLib.getAll(activities)
  };

  /// Marks an activity as dismissed for the calling user
  public shared ({ caller }) func dismissActivity(activityId : Nat) : async () {
    if (caller.isAnonymous()) { Runtime.trap("Unauthorized") };
    NotificationsLib.dismiss(dismissedActivities, caller, activityId);
  };

  /// Returns the list of activity IDs dismissed by the caller
  public query ({ caller }) func getUserDismissed() : async [Nat] {
    NotificationsLib.getDismissed(dismissedActivities, caller)
  };
};
