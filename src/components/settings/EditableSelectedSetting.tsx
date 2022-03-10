import React, { useCallback, useState } from "react";
import styled from "styled-components";
import EditIcon from '@mui/icons-material/Edit';
import EditOffIcon from '@mui/icons-material/EditOff';
import COLORS from "../../commonUtils/colors";

export enum Alignment {
  LEFT,
  RIGHT,
}

interface ChatBubbleProps {
  text: string;
  onDoneEditing?: (newValue: string) => void;
}

export const EditableSelectedSetting: React.FC<ChatBubbleProps> = ({ text, onDoneEditing}) => {
  const [value, setValue] = useState(text)
  const [isEditingMode, setIsEditingMode] = useState(false)

  const updateInputValue = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value)
  }, [setValue])

  const exitEditingMode = useCallback(() => {
    setIsEditingMode(false)
    onDoneEditing && onDoneEditing(value)
  }, [setIsEditingMode, onDoneEditing, value])
  const enterEditingMode = useCallback(() => setIsEditingMode(true), [setIsEditingMode, onDoneEditing])

  return (
    <Container>
      {isEditingMode ? <Input
        name="title"
        value={value}
        onChange={updateInputValue}
        onBlur={exitEditingMode}
      /> : <><SelectedSetting>{text}</SelectedSetting><span onClick={enterEditingMode}><EditIcon /></span></>}
    </Container>
  )

};


const SelectedSetting = styled.p`
  color: ${COLORS.Gray};
  padding-right: 5px;
`;

const Input = styled.input`
  height: 30px;
  margin: 2px 0;
  padding: 4px 8px;
  font-size: 18px;
  border: none;
  border-radius: 5px;
  background: ${COLORS.Graphite};
  vertical-align: top;

  &:focus {
    outline: none;
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: row
`