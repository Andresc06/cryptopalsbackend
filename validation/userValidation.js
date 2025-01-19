import yup from 'yup';

// Schema for user registration
const registerSchema = yup.object({
  password: yup.string().min(8, "Minimum password lenght: 8").required("Please insert a password"),
  name: yup.string().required("Please insert a name"),
  email: yup.string().email("Please insert a valid email").required("Please insert an email")
});

// Schema for user login
const loginSchema = yup.object({
  password: yup.string().min(8, "Minimum password lenght: 8").required("Please insert a password"),
  email: yup.string().email("Please insert a valid email").required("Please insert an email")
});

export { registerSchema, loginSchema };
