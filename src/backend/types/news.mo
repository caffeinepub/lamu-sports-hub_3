import Common "common";

module {
  public type NewsId = Common.NewsId;

  public type NewsArticle = {
    id : NewsId;
    title : Text;
    excerpt : Text;
    content : Text;
    category : Text;
    date : Text;
    emoji : Text;
  };
};
