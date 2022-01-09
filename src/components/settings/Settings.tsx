import { observable } from "mobx";
import { observer } from "mobx-react";
import { Component } from "react";
import { SettingsViewState } from "./SettingsViewState";

@observer
export class Settings extends Component {
  @observable private viewState = new SettingsViewState();

  render() {
    return <div>SETTINGS PAGE</div>;
  }
}
