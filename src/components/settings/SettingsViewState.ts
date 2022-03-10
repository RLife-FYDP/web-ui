import { User } from "./../../commonUtils/types";
import { action, computed, makeAutoObservable, observable } from "mobx";
import { authenticatedRequestWithBody, getUser } from "../../api/apiClient";

// TODO: currently just fake data to develop UI - will
// need to adjust for real data
interface SingleSettingProps {
  name: string;
  selectedSetting: string;
  notEditable?: boolean;
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

  @action
  updateSetting(key: string, newValue: string) {
    switch (key) {
      case 'First Name':
        this.user!.firstName = newValue
        this.updateSettingRequest({firstName: newValue})
        break;
      case 'Last Name':
        this.user!.lastName = newValue
        this.updateSettingRequest({lastName: newValue})
        break;
      case 'Email':
        this.user!.email = newValue
        this.updateSettingRequest({email: newValue})
        break;
      case 'Age':
        this.user!.age = Number(newValue)
        this.updateSettingRequest({age: Number(newValue)})
        break;
      }
  }

  @action
  updateLastName(newName: string) {
    if (newName === this.user?.lastName) return;
    this.user!.lastName = newName
    this.updateSettingRequest({lastName: newName})
  }


  async updateSettingRequest(updatedUser: Partial<User>) {
    const body = JSON.stringify(updatedUser)
    authenticatedRequestWithBody(`/users/${this.user?.id}`, body, 'PUT')
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
            name: "First Name",
            selectedSetting: this.user.firstName,
          },
          {
            name: "Last Name",
            selectedSetting: this.user.lastName,
          },
          {
            name: "Email",
            selectedSetting: this.user.email,
          },
          {
            name: "Age",
            selectedSetting: this.user.age.toString(),
            notEditable: true,
          },
          {
            name: "Gender",
            selectedSetting: this.user.gender,
            notEditable: true,
          },
          {
            name: "Language",
            selectedSetting: language,
            notEditable: true
          },
        ],
      },
    ];
  }
}
