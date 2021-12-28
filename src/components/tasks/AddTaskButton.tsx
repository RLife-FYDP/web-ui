import React from "react";
import { Link, useRouteMatch } from "react-router-dom";
import styled from "styled-components";
import COLORS from "../../commonUtils/colors";

interface AddTaskButtonProps {
  className?: string;
}

export const AddTaskButton: React.FC<AddTaskButtonProps> = ({ className }) => {
  let { url } = useRouteMatch();

  return (
    <Container className={className} to={`${url}/add`}>
      <PlusContainer>+</PlusContainer>
    </Container>
  );
};

const Container = styled(Link)`
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
  text-decoration: none;
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
