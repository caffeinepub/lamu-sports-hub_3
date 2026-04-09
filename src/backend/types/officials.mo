import Common "common";

module {
  public type OfficialId = Common.OfficialId;

  public type Official = {
    id : OfficialId;
    name : Text;
    role : Text;
    phone : Text;
    email : Text;
    area : Text;
  };
};
