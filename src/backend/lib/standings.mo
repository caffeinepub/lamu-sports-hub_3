import List "mo:core/List";
import Array "mo:core/Array";
import TeamTypes "../types/teams";
import StandingTypes "../types/standings";

module {
  public type Standing = StandingTypes.Standing;
  public type Team = TeamTypes.Team;

  public func compute(teams : List.List<Team>) : [Standing] {
    let raw : [Standing] = teams.map<Team, Standing>(func(t) {
      let played = t.wins + t.draws + t.losses;
      let points = t.wins * 3 + t.draws;
      let goalDiff : Int = t.goalsFor.toInt() - t.goalsAgainst.toInt();
      {
        position = 0; // will be assigned after sorting
        teamId = t.id;
        played;
        wins = t.wins;
        draws = t.draws;
        losses = t.losses;
        goalsFor = t.goalsFor;
        goalsAgainst = t.goalsAgainst;
        goalDiff;
        points;
      }
    }).toArray();

    let sorted = raw.sort(
      func(a, b) {
        if (a.points > b.points) { #less }
        else if (a.points < b.points) { #greater }
        else if (a.goalDiff > b.goalDiff) { #less }
        else if (a.goalDiff < b.goalDiff) { #greater }
        else { #equal }
      },
    );

    sorted.mapEntries<Standing, Standing>(
      func(s, i) { { s with position = i + 1 } },
    )
  };
};
