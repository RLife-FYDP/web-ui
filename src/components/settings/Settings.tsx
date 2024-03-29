import { observable } from "mobx";
import { observer } from "mobx-react";
import { Component } from "react";
import styled from "styled-components";
import COLORS from "../../commonUtils/colors";
import {
  AccessTokenStorageKey,
  RefreshTokenStorageKey,
  SignupPageUrl,
} from "../../commonUtils/consts";
import { Button } from "../common/Button";
import ImageUpload from "../images/ImageUpload";
import { EditableSelectedSetting } from "./EditableSelectedSetting";
import { SettingsViewState } from "./SettingsViewState";

@observer
export class Settings extends Component {
  @observable private viewState = new SettingsViewState();

  render() {
    if (this.viewState.testData === undefined) {
      return null;
    }

    return (
      <Container>
        {this.viewState.testData.map((category, i) => (
          <SectionContainer key={i}>
            <Header>{category.sectionName}</Header>
            {category.settings?.map((setting) => (
              <SettingOptions key={setting.name}>
                <SettingsTitle>{setting.name}</SettingsTitle>
                {setting.notEditable ? <SelectedSetting>{setting.selectedSetting}</SelectedSetting> :
                  <EditableSelectedSetting text={setting.selectedSetting} onDoneEditing={(value) => this.viewState.updateSetting(setting.name, value)} />}
              </SettingOptions>
            ))}
          </SectionContainer>
        ))}
        <SectionContainer>
          <Header>Edit Profile Photo</Header>
          <ImageUpload
              onImageUploaded={(url?: string) =>
                this.viewState.updateSetting('Profile Image', url!)
              }
            />
            {this.viewState.user?.profileImageLink ? (
              <Image src={this.viewState.user.profileImageLink} />
            ) : null}
        </SectionContainer>
        <Button onClick={logout} text={"Logout"} />
      </Container>
    );
  }
}

function logout() {
  localStorage.removeItem(AccessTokenStorageKey);
  localStorage.removeItem(RefreshTokenStorageKey);
  window.location.href = SignupPageUrl;
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  overflow-y: scroll;
`;

const SectionContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 16px;
`;

const Header = styled.h2`
  font-weight: 400;
  padding-bottom: 4px;
  margin: 8px;
  color: ${COLORS.NavyBlue};
  border-bottom: 1px solid ${COLORS.Graphite};
  font-size: 24px;
`;

const SettingOptions = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: baseline;
  margin: 2px 24px;
  padding: 2px 0;
`;

const Image = styled.img`
  max-width: 100%;
`;

const SettingsTitle = styled.p`
  font-size: 18px;
  color: ${COLORS.Teal};
`;

const SelectedSetting = styled.p`
  color: ${COLORS.Gray};
  padding-right: 28px;
`;
