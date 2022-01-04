import styled from "styled-components";
import COLORS from "../../commonUtils/colors";
import { State } from "./SignupViewState";

export const Intro: React.FC<{
  updateState: (state: State) => void;
}> = ({ updateState }) => (
  <Container>
    <InformationContainer>
      <Header>Welcome to RLife!</Header>
      <Description>Don't have an account yet? Signup below!</Description>
    </InformationContainer>
    <ButtonContainer>
      {/* TODO: We should direct to SIGNUP_EMAIL_VERIFICATION if we are doing email auth */}
      <Button onClick={() => updateState(State.SIGNUP_ID)}>Sign up</Button>
      <Button onClick={() => updateState(State.LOGIN_ID)}>Log in</Button>
    </ButtonContainer>
  </Container>
);

const Container = styled.div`
  margin-bottom: 80px;
`;

const InformationContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
`;

const Header = styled.h1`
  font-family: "roboto";
  font-weight: 400;
  margin-bottom: 4px;
`;

const Description = styled.p``;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  align-items: center;
`;

const Button = styled.button`
  width: 100px;
  height: 40px;
  margin: 4px 0;
  font-size: 18px;
  border-radius: 6px;
  color: ${COLORS.White};
  background: ${COLORS.NavyBlue};
  border: none;
  outline: none;
  transition: all 0.1s linear;

  &:active {
    color: ${COLORS.NavyBlue};
    background: ${COLORS.White};
    border: 1px solid ${COLORS.NavyBlue};
  }
`;
