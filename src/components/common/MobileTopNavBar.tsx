import React from "react";
import styled from "styled-components";

import RLifeIcon from "../../icons/RLifeIcon.svg";
import ProfileIcon from "../../icons/ProfileIcon.svg";
import { Link } from "react-router-dom";

// TODO: Should we make this sticky or scrollable?
export const MobileTopNavBar: React.FC = () => (
  <Container>
    <LogoContainer src={RLifeIcon} />
    <Link to="/settings">
      <ProfileContainer src={ProfileIcon} />
    </Link>
  </Container>
);

const Container = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin: 16px 8px;
  height: 48px;
`;

const LogoContainer = styled.img`
  height: auto;
  width: 48px;
`;

const ProfileContainer = styled.img`
  height: auto;
  width: auto;
`;
