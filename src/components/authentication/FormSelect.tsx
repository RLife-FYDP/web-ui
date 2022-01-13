import React, { useState } from "react";
import styled from "styled-components";

interface FormInputProps {
  label: string
  name: string
  autoComplete?: string
  value: string
  onChange: (e: React.ChangeEvent<any>) => void;
  onBlur: React.FocusEventHandler
}

export const FormSelect: React.FC<FormInputProps> = ({ label, onBlur, ...props }) => {
  const [isSelected, setIsSelected] = useState(false);
  const handleOnBlur = (e: React.FocusEvent) => {
    setIsSelected(false);
    onBlur(e);
  };
  return (
    <Container>
      <FormInputWrapper>
        <label>
          <FormInputLabel className={isSelected ? 'selected' : ''}>{label}</FormInputLabel>
          <Select
            onFocus={() => setIsSelected(true)}
            onBlur={handleOnBlur}
            {...props}>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Non-binary">Non-binary</option>
          </Select>
        </label>
      </FormInputWrapper>
    </Container>
  )
}

const Container = styled.div`
  padding: 10px 10px;
  display: inline-block;
  width: 250px;
`

const FormInputWrapper = styled.div`
  border-bottom: 2px solid grey;
`

const FormInputLabel = styled.span`
  width: 100%;
  display: block;
  padding: 5px 0 0 10px;
  color: grey;
  font-size: .9rem;
  &.selected {
    color: blue;
  }
`
const Select = styled.select`
  display: block;
  border: 0;
  height: 25px;
  width: 200px;
  padding-left: 10px;
  font-size: 1.1rem;
`