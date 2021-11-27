import React from "react";
import styled from "styled-components";
import COLORS from "../../commonUtils/colors";

interface AddTaskButtonProps {
  className?: string;
  onClick: () => void;
}

export const AddTaskButton: React.FC<AddTaskButtonProps> = ({
  className,
  onClick,
}) => {
  return (
    <Container className={className}>
      <PlusContainer>+</PlusContainer>
    </Container>
  );
};

const Container = styled.div`
  cursor: default;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
  width: 50px;
  height: 50px;
  border-radius: 20%;
  background: ${COLORS.NavyBlue};
`;

const PlusContainer = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  border: 3px solid ${COLORS.Yellow};
  border-radius: 20%;
  background: transparent;
  font-size: 40px;
  color: ${COLORS.Yellow};
`;
