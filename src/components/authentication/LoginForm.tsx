import { Formik } from "formik";
import React, { useState } from "react";
import styled from "styled-components";
import * as Yup from "yup";
import { FormInput } from "./FormInput";
import COLORS from "../../commonUtils/colors";
import {
  AccessTokenStorageKey,
  RefreshTokenStorageKey,
} from "../../commonUtils/consts";

const LoginSchema = Yup.object().shape({
  email: Yup.string().email("Must be valid email format").required(),
  password: Yup.string()
    .min(8, "Password must be between 8 and 50 characters")
    .max(50, "Password must be between 8 and 50 characters")
    .required(),
});

export const LoginForm: React.FC = () => {
  const [hasTriedSubmitting, setHasTriedSubmitting] = useState(false);
  const [formSubmissionError, setFormSubmissionError] = useState<null | string>(
    null
  );

  return (
    <Formik
      initialValues={{ email: "", password: "" }}
      validationSchema={LoginSchema}
      validateOnChange={hasTriedSubmitting}
      validateOnBlur={hasTriedSubmitting}
      onSubmit={async (values, { setSubmitting }) => {
        const body = JSON.stringify({
          email: values.email,
          password: values.password,
        });
        try {
          const res = await fetch("http://localhost:8080/auth/login", {
            method: "POST",
            body,
            headers: { "Content-Type": "application/json" },
          });
          switch (res.status) {
            case 200:
              const { access_token: accessToken, refresh_token: refreshToken } =
                await res.json();
              localStorage.setItem(AccessTokenStorageKey, accessToken);
              localStorage.setItem(RefreshTokenStorageKey, refreshToken);
              window.location.href = window.location.href
                .split("/")
                .slice(0, -1)
                .join("/");
              break;
            default:
              const { message } = await res.json();
              setFormSubmissionError(message);
          }
        } catch (e) {
          setFormSubmissionError("Network error. Please try again later");
        }
        setSubmitting(false);
      }}
    >
      {({
        values,
        errors,
        handleChange,
        handleBlur,
        handleSubmit,
        isSubmitting,
        isValidating,
      }) => {
        const hasValidationErrors = !!(errors.email || errors.password);
        const hasCompletedForm = values.email && values.password;
        return (
          <Form onSubmit={handleSubmit}>
            {formSubmissionError && <FormError message={formSubmissionError} />}
            <StyledFormInput
              type="text"
              name="email"
              label="Email"
              autoComplete="off"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.email}
            />
            {values.email && errors.email && (
              <FormError message={errors.email} />
            )}
            <StyledFormInput
              type="password"
              name="password"
              label="Password"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.password}
            />
            {values.password && errors.password && (
              <FormError message={errors.password} />
            )}
            <SubmitButton
              type="submit"
              disabled={
                isSubmitting ||
                isValidating ||
                hasValidationErrors ||
                !hasCompletedForm
              }
              onClick={() => setHasTriedSubmitting(true)}
            >
              {"Log in"}
            </SubmitButton>
          </Form>
        );
      }}
    </Formik>
  );
};

const FormError: React.FC<{ message?: string }> = ({ message }) => (
  <Span>{message}</Span>
);

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const Span = styled.span`
  color: red;
  font-size: 0.9rem;
  padding-left: 10px;
`;

const SubmitButton = styled.button`
  width: 80px;
  height: 40px;
  margin: 8px;
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

const StyledFormInput = styled(FormInput)`
  width: 100%;

  &:focus {
    outline: none;
  }
`;
