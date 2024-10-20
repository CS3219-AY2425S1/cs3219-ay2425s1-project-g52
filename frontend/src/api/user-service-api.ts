import axios from "axios";
import { userServiceApi } from "./constants";

const userLogin = async (
  email: string,
  password: string
): Promise<any | undefined> => {
  try {
    const response = await axios.post(`${userServiceApi}/auth/login`, {
      email: email,
      password: password,
    });

    const { token, username } = response.data;

    if (token) {
      // localStorage.setItem("token", token);
      sessionStorage.setItem("token", token);
    }

    console.log("Login successful:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error during login:", error);
    return undefined;
  }
};

const userSignUp = async (
  username: string,
  email: string,
  password: string
): Promise<any | undefined> => {
  try {
    const response = await axios.post(`${userServiceApi}/users/`, {
      username: username,
      email: email,
      password: password,
    });

    return response; // Return the successful response
  } catch (error: any) {
    // Check if the error has a response (comes from the server)
    if (error.response) {
      console.error("Error during signup:", error.response);
      return error.response; // Return the error response from the server
    } else {
      // Handle cases where there is no response from the server (e.g., network error)
      console.error("Error during signup:", error.message);
      return { error: error.message }; // Return a custom error message
    }
  }
};

export { userLogin, userSignUp };
