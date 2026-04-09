import List "mo:core/List";
import Map "mo:core/Map";
import Set "mo:core/Set";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";
import Time "mo:core/Time";
import NotifTypes "../types/notifications";

module {
  public type ActivityItem = NotifTypes.ActivityItem;
  public type ActionType = NotifTypes.ActionType;

  let maxActivities : Nat = 50;

  /// Returns activities, most recent first (sorted by timestamp desc)
  public func getAll(activities : List.List<ActivityItem>) : [ActivityItem] {
    let arr = activities.toArray();
    arr.sort(func(a : ActivityItem, b : ActivityItem) : { #less; #equal; #greater } {
      if (b.timestamp > a.timestamp) { #less }
      else if (b.timestamp < a.timestamp) { #greater }
      else { #equal }
    })
  };

  /// Appends a new activity; trims oldest when exceeding 50
  public func push(
    activities : List.List<ActivityItem>,
    nextId : { var value : Nat },
    actorPrincipal : ?Principal,
    actorName : Text,
    actionType : ActionType,
    entityId : Nat,
    entityName : Text,
  ) : () {
    let item : ActivityItem = {
      id = nextId.value;
      actorPrincipal;
      actorName;
      actionType;
      entityId;
      entityName;
      timestamp = Time.now();
    };
    nextId.value += 1;
    activities.add(item);
    // When over capacity, keep only the last maxActivities (newest are highest index)
    let size = activities.size();
    if (size > maxActivities) {
      let excess = size - maxActivities;
      // Drop oldest items from the front by rebuilding from the excess offset
      let kept = List.fromIter<ActivityItem>(activities.range(excess.toInt(), size.toInt()));
      activities.clear();
      activities.append(kept);
    };
  };

  /// Records that caller dismissed an activity ID
  public func dismiss(
    dismissed : Map.Map<Principal, Set.Set<Nat>>,
    caller : Principal,
    activityId : Nat,
  ) : () {
    let existing = switch (dismissed.get(caller)) {
      case (?s) { s };
      case null { Set.empty<Nat>() };
    };
    existing.add(activityId);
    dismissed.add(caller, existing);
  };

  /// Returns the set of dismissed activity IDs for the caller
  public func getDismissed(
    dismissed : Map.Map<Principal, Set.Set<Nat>>,
    caller : Principal,
  ) : [Nat] {
    switch (dismissed.get(caller)) {
      case (?s) { s.toArray() };
      case null { [] };
    }
  };
};
