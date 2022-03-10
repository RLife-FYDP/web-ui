import { User } from "./../../commonUtils/types";
import { computed, makeAutoObservable, observable } from "mobx";
import { getUser } from "../../api/apiClient";

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
  @observable user?: User;

  constructor() {
    makeAutoObservable(this);
    this.init();
  }

  async init() {
    this.user = await getUser();
  }

  @computed
  get testData(): SettingsProps[] | undefined {
    if (this.user == undefined) {
      // eslint-disable-next-line getter-return
      return;
    }
    const language = this.user?.setting?.detailedSettingsJSON
      ? JSON.parse(this.user?.setting?.detailedSettingsJSON!).Spec.language
      : "";
    return [
      {
        sectionName: "Profile Information",
        settings: [
          {
            name: "Display Name",
            selectedSetting: `${this.user?.firstName} ${this.user?.lastName}`,
            availableOptions: ["Austin", "Marcus", "Lincoln", "Justin"],
          },
          {
            name: "Language",
            selectedSetting: language,
          },
        ],
      },
    ];
  }
}
