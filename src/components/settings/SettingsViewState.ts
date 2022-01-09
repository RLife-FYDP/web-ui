import { computed, makeAutoObservable } from "mobx";

// TODO: currently just fake data to develop UI - will 
// need to adjust for real data
interface SingleSettingProps {
  name: string;
  selectedSetting: string;
  availableOptions?: string[];
}

interface SettingsProps {
  sectionName: string;
  settings?: SingleSettingProps[];
}

export class SettingsViewState {
  constructor() {
    makeAutoObservable(this);
  }

  @computed
  get testData(): SettingsProps[] {
    return [
      {
        sectionName: "Profile Settings",
        settings: [
          {
            name: "Display Name",
            selectedSetting: "Austin",
            availableOptions: ["Austin", "Marcus", "Lincoln", "Justin"],
          },
        ],
      },
      {
        sectionName: "History",
        settings: [
          {
            name: "Dec 2, 2021",
            selectedSetting: "Blair House xxx",
          },
          {
            name: "March 15, 2021",
            selectedSetting: "Icon Suites xxx",
          },
        ],
      },
    ];
  }
}
