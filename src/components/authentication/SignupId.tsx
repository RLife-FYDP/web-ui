import styled from "styled-components";

export const SignupId: React.FC = () => (
  <InputContainer>
    <Label htmlFor="username">User ID</Label>
    <Input id="username" placeholder="Username" />
    <Label htmlFor="username">Password</Label>
    <Input id="password" placeholder="Password" type="password" />
  </InputContainer>
);

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
`;

const Input = styled.input`
  width: 150px;
  height: 30px;
  margin: 4px 0 16px 0;
  padding: 2px 4px;
  border-radius: 5px;
  font-size: 16px;
  outline: none;
`;

const Label = styled.label``;
