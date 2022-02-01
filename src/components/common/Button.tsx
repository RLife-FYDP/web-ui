import COLORS from "../../commonUtils/colors";
import styled from "styled-components";

interface ButtonProps {
  text: string
  onClick: React.MouseEventHandler
}

export const Button: React.FC<ButtonProps> = ({text, onClick}) => {
  return <ButtonStyled onClick={onClick}>{text}</ButtonStyled>
}

const ButtonStyled = styled.button`
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
