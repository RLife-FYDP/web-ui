import { Formik } from "formik";
import React, { useState } from "react";
import styled from "styled-components";
import * as Yup from "yup";
import { FormInput } from "./FormInput";
import COLORS from "../../commonUtils/colors";
import { FormSelect } from "./FormSelect";
import {
  AccessTokenStorageKey,
  RefreshTokenStorageKey,
} from "../../commonUtils/consts";

const SignupSchema = Yup.object().shape({
  email: Yup.string().email("Must be valid email format").required(),
  password: Yup.string()
    .min(6, "Password must be between 8 and 50 characters")
    .max(50, "Password must be between 8 and 50 characters")
    .required(),
  firstname: Yup.string()
    .min(2, "Names must have between 2 and 20 characters")
    .max(20, "Names must have between 2 and 20 characters")
    .matches(
      /^[a-zA-Z-\s]+$/,
      "First name must only contain alphabet characters and '-', ' '"
    )
    .required(),
  lastname: Yup.string()
    .min(2, "Names must have between 2 and 20 characters")
    .max(20, "Names must have between 2 and 20 characters")
    .matches(
      /^[a-zA-Z-\s]+$/,
      "Last name must only contain alphabet characters and '-', ' '"
    )
    .required(),
  age: Yup.number()
    .min(0, "Age must be between 0 and 100")
    .max(100, "Age must be between 0 and 100")
    .required(),
  gender: Yup.string().oneOf(["Male", "Female", "Non-binary"]).required(),
});

export const SignupForm: React.FC = () => {
  const [hasTriedSubmitting, setHasTriedSubmitting] = useState(false);
  const [formSubmissionError, setFormSubmissionError] = useState<null | string>(
    null
  );

  return (
    <Formik
      initialValues={{
        email: "",
        password: "",
        firstname: "",
        lastname: "",
        age: "",
        gender: "Male",
      }}
      validationSchema={SignupSchema}
      validateOnChange={hasTriedSubmitting}
      validateOnBlur={hasTriedSubmitting}
      onSubmit={async (values, { setSubmitting }) => {
        const body = JSON.stringify({
          email: values.email,
          first_name: values.firstname,
          last_name: values.lastname,
          password: values.password,
          age: values.age,
          gender: values.gender,
        });
        try {
          const res = await fetch("http://localhost:8080/auth/register", {
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
              window.location.href =
                window.location.href.split("/").slice(0, -1).join("/") +
                "/create";
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
        const hasValidationErrors = !!(
          errors.email ||
          errors.password ||
          errors.firstname ||
          errors.lastname ||
          errors.age ||
          errors.gender
        );
        const hasCompletedForm =
          values.email &&
          values.password &&
          values.firstname &&
          values.lastname &&
          values.age &&
          values.gender;
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
              type="text"
              name="firstname"
              label="First Name"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.firstname}
            />
            <StyledFormInput
              type="text"
              name="lastname"
              label="Last Name"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.lastname}
            />
            {((values.lastname && errors.lastname) ||
              (values.firstname && errors.firstname)) && (
              <FormError
                message={
                  (values.lastname && errors.lastname) ||
                  (values.firstname && errors.firstname)
                }
              />
            )}
            <StyledFormInput
              type="number"
              name="age"
              label="Age"
              autoComplete="off"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.age}
            />
            {values.age && errors.age && <FormError message={errors.age} />}
            <StyledFormSelect
              name="gender"
              label="Gender"
              autoComplete="off"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.gender}
            />
            {values.gender && errors.gender && (
              <FormError message={errors.gender} />
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
              {"Sign up"}
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

const StyledFormSelect = styled(FormSelect)`
  width: 100%;

  &:focus {
    outline: none;
  }
`;
