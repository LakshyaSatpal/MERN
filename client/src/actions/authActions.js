import { GET_ERRORS, SET_CURRENT_USER } from "./types";
import axios from "axios";
import setAuthToken from "../utils/setAuthToken";
import jwt_decode from "jwt-decode";

// Register User
export const registerUser = (userData, history) => {
  return async (dispatch) => {
    try {
      await axios.post("/api/users/register", userData);
      // result will be a promise
      // second parameter is body POST in post request
      history.push("/login");
    } catch (err) {
      // catch block will execute depending on the status code coming from backend
      // error.response.data to get json error data from backend
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data,
      });
    }
  };
};

// Login Get User Token
export const loginUser = (userData) => {
  return async (dispatch) => {
    try {
      const res = await axios.post("api/users/login", userData);
      const token = res.data.token;

      // Save to local Storage
      localStorage.setItem("jwtToken", token);

      // Set token to Auth Header
      setAuthToken(token);

      // Decode token to get user data
      const decoded = jwt_decode(token);

      // Set Current User
      dispatch(setCurrentUser(decoded));
    } catch (err) {
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data,
      });
    }
  };
};

export const logoutUser = () => {
  return (dispatch) => {
    // Remove token from localStorage
    localStorage.removeItem("jwtToken");
    // Remove Auth Header
    setAuthToken(false);
    // Set current user
    dispatch(setCurrentUser({}));
  };
};

export const setCurrentUser = (decoded) => {
  return {
    type: SET_CURRENT_USER,
    payload: decoded,
  };
};
