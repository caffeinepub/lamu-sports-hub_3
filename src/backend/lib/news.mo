import List "mo:core/List";
import Types "../types/news";

module {
  public type NewsArticle = Types.NewsArticle;

  public func getAll(articles : List.List<NewsArticle>) : [NewsArticle] {
    articles.toArray()
  };

  public func getById(articles : List.List<NewsArticle>, id : Nat) : ?NewsArticle {
    articles.find(func(a) { a.id == id })
  };

  public func add(
    articles : List.List<NewsArticle>,
    nextId : Nat,
    title : Text,
    excerpt : Text,
    content : Text,
    category : Text,
    date : Text,
    emoji : Text,
  ) : Nat {
    let article : NewsArticle = { id = nextId; title; excerpt; content; category; date; emoji };
    articles.add(article);
    nextId
  };

  public func update(
    articles : List.List<NewsArticle>,
    id : Nat,
    title : Text,
    excerpt : Text,
    content : Text,
    category : Text,
    date : Text,
    emoji : Text,
  ) : Bool {
    let idx = articles.findIndex(func(a) { a.id == id });
    switch (idx) {
      case null { false };
      case (?i) {
        let existing = articles.at(i);
        articles.put(i, { existing with title; excerpt; content; category; date; emoji });
        true
      };
    }
  };

  public func remove(articles : List.List<NewsArticle>, id : Nat) : Bool {
    let idx = articles.findIndex(func(a) { a.id == id });
    switch (idx) {
      case null { false };
      case (?_i) {
        let filtered = articles.filter(func(a) { a.id != id });
        articles.clear();
        articles.append(filtered);
        true
      };
    }
  };

  public func seed(articles : List.List<NewsArticle>, startId : Nat) : Nat {
    let seedData : [(Text, Text, Text, Text, Text, Text)] = [
      (
        "🏆 Lamu United FC Tops the Table After Matchday 8",
        "Lamu United FC cement their league lead with a dominant 3-1 victory over Manda FC at Lamu Stadium.",
        "Lamu United FC put on an impressive display on Tuesday evening, defeating Manda FC 3-1 in a fiercely contested derby. Omar Abdallah was the star of the show, netting a brace and setting up the third goal for Salim Hassan. The win puts Lamu United five points clear at the summit.",
        "Match Report",
        "2026-04-01",
        "🏆",
      ),
      (
        "🌊 Shela Wanderers Hold Pate Island to a Thrilling 2-2 Draw",
        "An action-packed encounter at Shela Ground ends level as both sides share the spoils in a six-goal thriller.",
        "Shela Wanderers and Pate Island SC served up an entertaining contest that ended 2-2. Yusuf Mzee opened the scoring for the Wanderers before Fadhili Konde equalised. Hassan Bwana's superb long-range strike restored Shela's lead, but Mohammed Jabu's 88th-minute header earned Pate Island a share of the points.",
        "Match Report",
        "2026-04-01",
        "🌊",
      ),
      (
        "🔥 Transfer Bombshell: Omar Abdallah Linked with Nairobi Giants",
        "Lamu United's star striker Omar Abdallah, the league's top scorer with 15 goals, is reportedly attracting interest from top-flight clubs.",
        "Sources close to the player confirm that two Nairobi-based Premier League clubs have made enquiries about Omar Abdallah's availability. The 24-year-old has been in stunning form this season and Lamu United are determined to keep him beyond the summer window.",
        "Transfer News",
        "2026-04-02",
        "🔥",
      ),
      (
        "📊 FKF Lamu County League Standings: The Race Heats Up",
        "With six matchdays remaining, the title race is wide open as four clubs are separated by just eight points.",
        "The FKF Lamu County League is heading for a thrilling finale. Lamu United FC lead on 27 points but Manda FC, Shela Wanderers and Pate Island SC are all in contention. The bottom two places are also tightly contested, with Faza Rangers and Kiunga Athletic fighting to avoid relegation.",
        "League Update",
        "2026-04-03",
        "📊",
      ),
      (
        "⚡ Hindi FC Edge Out Mokowe City in Midweek Clash",
        "Suleiman Ngao's second-half winner sealed all three points for Hindi FC in a tightly contested local derby.",
        "Hindi FC secured a vital 1-0 win over Mokowe City FC thanks to Suleiman Ngao's 67th-minute strike. The victory lifts Hindi to fifth place and adds pressure on the clubs below them. Mokowe City's Hemed Bahari missed a penalty in the first half that could have changed the complexion of the match.",
        "Match Report",
        "2026-04-03",
        "⚡",
      ),
      (
        "🏝️ Pate Island SC Appoint New Head Coach Ahead of Run-In",
        "Pate Island SC have confirmed the appointment of coach Hamza Baraka as they look to push for a top-two finish.",
        "Pate Island SC have moved quickly to bolster their backroom staff, bringing in the experienced Hamza Baraka as head coach. The former Mombasa FC assistant has a strong record in coastal football and will take charge immediately ahead of Sunday's crucial home fixture against Lamu United.",
        "League Update",
        "2026-04-04",
        "🏝️",
      ),
      (
        "⚽ Player of the Month: Salim Hassan of Lamu United FC",
        "The creative midfielder has been instrumental in Lamu United's title charge, recording 9 assists and 8 goals this season.",
        "Salim Hassan has been voted FKF Lamu County League Player of the Month for March. The 22-year-old has been pivotal in Lamu United's attacking play, combining goals with a remarkable assist tally. His vision and work rate have drawn comparisons to some of Kenya's finest midfielders.",
        "Feature",
        "2026-04-06",
        "⚽",
      ),
      (
        "🏃 Kiunga Athletic Launch Academy to Develop Local Talent",
        "Struggling Kiunga Athletic announce a grassroots academy initiative to nurture the next generation of footballers in Lamu County.",
        "Despite their difficult season on the pitch, Kiunga Athletic are investing in the future with the launch of the Kiunga Youth Academy. The initiative will provide free coaching to children aged 8-16 across Kiunga and surrounding areas. Club chairman Ali Mwinga said: 'We want to be the club that produces champions for Lamu County for generations to come.'",
        "Feature",
        "2026-04-08",
        "🏃",
      ),
    ];
    var id = startId;
    for ((title, excerpt, content, category, date, emoji) in seedData.vals()) {
      let article : NewsArticle = { id; title; excerpt; content; category; date; emoji };
      articles.add(article);
      id += 1;
    };
    id
  };
};
