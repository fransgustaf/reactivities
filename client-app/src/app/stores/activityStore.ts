import { makeAutoObservable, configure } from "mobx";
import { createContext, SyntheticEvent } from "react";
import agent from "../api/agent";
import { IActivity } from "../modules/activity";

configure({ enforceActions: "always" });

class ActivityStore {
  activityRegistry = new Map();
  activity: IActivity | null = null;
  loadingInitial = false;
  submitting = false;
  target = "";

  constructor() {
    makeAutoObservable(this);
  }

  get activitiesByDate() {
    return this.groupActivitiesByDate(Array.from(this.activityRegistry.values()));
  }

  groupActivitiesByDate(activities: IActivity[]) {
    const sortedActvities = activities.sort((a, b) => Date.parse(a.date) - Date.parse(b.date));
    return Object.entries(sortedActvities.reduce((activities, activity) => {
      const date = activity.date.split('T')[0];
      activities[date] = activities[date] ? [...activities[date], activity] : [activity]
      return activities;
    }, {} as {[key: string]: IActivity[]}));
  }

  loadActivities = async () => {
    console.log("100");
    this.loadingInitial = true;
    try {
      const activities = await agent.Activities.list();
      activities.forEach((activity) => {
        activity.date = activity.date.split(".")[0];
        this.activityRegistry.set(activity.id, activity);
      });
      this.loadingInitial = false;
    } catch (error) {
      console.log(error);
      this.loadingInitial = false;
    }

    /*
    agent.Activities.list()
      .then((activities) => {
        activities.forEach((activity) => {
          activity.date = activity.date.split(".")[0];
          this.activities.push(activity);
        });
      })
      .finally(() => (this.loadingInitial = false));
  */
  };

  loadActivity = async (id: string) => {
    let activity = this.getActivity(id);

    if (activity) {
      this.activity = activity;
    } else {
      this.loadingInitial = true;
      try {
        this.activity = await agent.Activities.details(id);
        this.loadingInitial = false;
      } catch (error) {
        console.log(error);
        this.loadingInitial = false;
      }
    }
  };

  getActivity = (id: string) => {
    return this.activityRegistry.get(id);
  };

  clearActivity = () => {
    this.activity = null;
  };

  createActivity = async (activity: IActivity) => {
    this.submitting = false;
    try {
      await agent.Activities.create(activity);
      this.activityRegistry.set(activity.id, activity);
      this.submitting = false;
    } catch (error) {
      console.log(error);
      this.submitting = false;
    }
  };

  editActivity = async (activity: IActivity) => {
    this.submitting = true;
    try {
      await agent.Activities.update(activity);
      this.activityRegistry.set(activity.id, activity);
      this.activity = activity;
      this.submitting = false;
    } catch (error) {
      this.submitting = false;
      console.error(error);
    }
  };

  deleteActivity = async (event: SyntheticEvent<HTMLButtonElement>, id: string) => {
    this.submitting = true;
    this.target = event.currentTarget.name;
    try {
      await agent.Activities.delete(id);
      this.submitting = false;
      this.activityRegistry.delete(id);
      this.target = "";
    } catch (error) {
      console.log(error);
      this.submitting = false;
      this.target = "";
    }
  };
}

export default createContext(new ActivityStore());
