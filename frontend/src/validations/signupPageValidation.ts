import * as Yup from "yup";

export interface SignupFormValues {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export const initialValues: SignupFormValues = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
};

export const validationSchema = Yup.object({
  name: Yup.string()
    .min(3, "Name must be at least 3 characters")
    .required("Full name is required"),
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Confirm Password is required"),
});
