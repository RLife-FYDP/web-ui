import { observable } from "mobx";
import { observer } from "mobx-react";
import { Component } from "react";
import styled from "styled-components";
import COLORS from "../../commonUtils/colors";
import { SettingsViewState } from "./SettingsViewState";

@observer
export class Settings extends Component {
  @observable private viewState = new SettingsViewState();

  render() {
    return (
      <Container>
        {this.viewState.testData.map((category) => (
          <SectionContainer>
            <Header>{category.sectionName}</Header>
            {category.settings?.map((setting) => (
              <SettingOptions>
                <SettingsTitle>{setting.name}</SettingsTitle>
                <SelectedSetting>{setting.selectedSetting}</SelectedSetting>
              </SettingOptions>
            ))}
          </SectionContainer>
        ))}
      </Container>
    );
  }
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
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

const SettingsTitle = styled.p`
  font-size: 18px;
  color: ${COLORS.Teal};
`;

const SelectedSetting = styled.p`
  color: ${COLORS.Gray};
`;
