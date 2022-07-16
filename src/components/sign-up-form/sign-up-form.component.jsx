import { useState } from "react";
import FormInput from "../form-input/form-input.component";
import Button from "../button/button.component";

import {
  createAuthUserWithEmailAndPassword,
  createUserDocumentFromAuth,
  auth,
} from "../../utils/firebase/firebase.utils";

const defaultFormFields = {
  displayName: "",
  email: "",
  password: "",
  confirmPassword: "",
};

const SignUpForm = () => {
  const [formFields, setFormFields] = useState(defaultFormFields);
  const { displayName, email, password, confirmPassword } = formFields;

  const handleChange = (event) => {
    const { value, name } = event.target;

    setFormFields({ ...formFields, [name]: value });
  };

  const resetFormFields = () => {
    setFormFields(defaultFormFields);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      alert("passwords do not match");
      return;
    }

    try {
      const { user } = await createAuthUserWithEmailAndPassword(
        email,
        password
      );

      await createUserDocumentFromAuth(user, { displayName });
      resetFormFields();
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        alert("Cannot create user, email already in use");
      } else {
        console.log("user creation encountered an error", error);
      }
    }
  };

  return (
    <div className="sign-up-container">
      <h1>Sign Up with your email and your password</h1>
      <form onSubmit={handleSubmit}>
        <FormInput
          type="text"
          onChange={handleChange}
          name="displayName"
          value={displayName}
          label="Display Name"
          required
        />

        <FormInput
          type="email"
          onChange={handleChange}
          name="email"
          value={email}
          label="Email"
          required
        />

        <FormInput
          type="password"
          onChange={handleChange}
          name="password"
          value={password}
          minLength="6"
          label="Password"
          required
        />

        <FormInput
          type="password"
          onChange={handleChange}
          name="confirmPassword"
          value={confirmPassword}
          minLength="6"
          label="Confirm Password"
          required
        />

        <Button type="submit">Sign Up</Button>
      </form>
    </div>
  );
};

export default SignUpForm;
