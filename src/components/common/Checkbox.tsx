import React, { useEffect, useState } from "react";
import styled from "styled-components";
import COLORS from "../../commonUtils/colors";

interface CheckboxProps {
  onClick: () => void;
  isDisabled?: boolean;
  defaultChecked?: boolean;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  onClick,
  isDisabled,
  defaultChecked,
}) => {
  const [isChecked, toggleChecked] = useState(false);

  useEffect(() => {
    toggleChecked(defaultChecked ?? false);
  }, [defaultChecked]);

  return (
    <Container
      isDisabled={isDisabled}
      isChecked={isChecked}
      onClick={() => {
        if (isDisabled) {
          return;
        }
        toggleChecked(!isChecked);
        onClick();
      }}
    ></Container>
  );
};

const Container = styled.div<{
  isChecked: Boolean;
  isDisabled?: Boolean;
}>`
  position: relative;
  width: 25px;
  height: 25px;
  padding: 5px;
  border: 2px solid ${COLORS.Yellow};
  border-radius: 25%;

  // TODO: this isn't centered for some reason
  &::after {
    content: "";
    position: absolute;
    width: 17px;
    height: 17px;
    padding: 0;
    margin: 0;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border-radius: 25%;
    background: ${({ isChecked }) =>
      isChecked ? COLORS.NavyBlue : "transparent"};
  }

  &:hover:after {
    background: ${({ isDisabled }) =>
      isDisabled ? "transparent" : COLORS.NavyBlue};
  }
`;
