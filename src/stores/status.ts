import { makeAutoObservable } from "mobx";

class Status {
  siteState = "loading";
  siteOverview: any = null;

  constructor() {
    makeAutoObservable(this);
  }

  changeSiteState(val: any) {
    this.siteState = val;
  }
  changeSiteOverview(val: any) {
    this.siteOverview = val;
  }
}

export default Status;
