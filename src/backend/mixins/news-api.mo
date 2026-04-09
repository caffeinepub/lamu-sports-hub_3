import List "mo:core/List";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import NewsTypes "../types/news";
import NewsLib "../lib/news";

mixin (
  articles : List.List<NewsTypes.NewsArticle>,
  nextNewsId : { var value : Nat },
  _admins : List.List<Principal>
) {
  public query func getAllNews() : async [NewsTypes.NewsArticle] {
    NewsLib.getAll(articles)
  };

  public query func getArticle(id : Nat) : async ?NewsTypes.NewsArticle {
    NewsLib.getById(articles, id)
  };

  public shared ({ caller }) func addNews(
    title : Text,
    excerpt : Text,
    content : Text,
    category : Text,
    date : Text,
    emoji : Text,
  ) : async Nat {
    if (caller.isAnonymous()) { Runtime.trap("Unauthorized") };
    let id = NewsLib.add(articles, nextNewsId.value, title, excerpt, content, category, date, emoji);
    nextNewsId.value += 1;
    id
  };

  public shared ({ caller }) func updateNews(
    id : Nat,
    title : Text,
    excerpt : Text,
    content : Text,
    category : Text,
    date : Text,
    emoji : Text,
  ) : async Bool {
    if (caller.isAnonymous()) { Runtime.trap("Unauthorized") };
    NewsLib.update(articles, id, title, excerpt, content, category, date, emoji)
  };

  public shared ({ caller }) func deleteNews(id : Nat) : async Bool {
    if (caller.isAnonymous()) { Runtime.trap("Unauthorized") };
    NewsLib.remove(articles, id)
  };
};
