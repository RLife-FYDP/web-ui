import styled, { keyframes } from "styled-components";
import { ReactComponent as SpinnerIcon } from "../../icons/Spinner.svg";

export const Loading: React.FC = () => {
  return (
    <Container>
      <StyledSpinner />
    </Container>
  );
};

const rotate = keyframes`
  0% {
    transform: rotate(0deg);
  }
  
  100% {
    transform: rotate(360deg);
  }
`;

const Container = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const StyledSpinner = styled(SpinnerIcon)`
  width: 40px;
  height: 40px;
  animation: ${rotate} 3s linear infinite;
`;
