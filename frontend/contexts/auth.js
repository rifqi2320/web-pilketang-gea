import axios from "axios";
import { createContext, useContext, useEffect, useReducer } from "react";

const API = axios.create({ baseURL: "http://localhost:5000" });

export const actions = {
  REQUEST_LOGIN: "REQUEST_LOGIN",
  LOGIN_SUCCESS: "LOGIN_SUCCESS",
  LOGIN_ERROR: "LOGIN_ERROR",
  LOGOUT: "LOGOUT",
  POPULATE: "POPULATE",
  STOP_LOADING: "STOP_LOADING",
};

const AuthStateContext = createContext({
  authenticated: false,
  user: null,
  isVoted: null,
  type: null,
  token: null,
  loading: true,
});
const AuthDispatchContext = createContext();

export const useAuthState = () => {
  const context = useContext(AuthStateContext);
  if (context === undefined) {
    throw new Error("useAuthState must be used within AuthProvider");
  }
  return context;
};

export const useAuthDispatch = () => {
  const context = useContext(AuthDispatchContext);
  if (context === undefined) {
    throw new Error("useAuthDispatch must be used within AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, {
    user: null,
    authenticated: false,
    token: null,
    isVoted: null,
    type: null,
    loading: true,
  });

  // to check for token if switching page
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const user = localStorage.getItem("user");
      dispatch({
        type: actions.LOGIN_SUCCESS,
        payload: { data: { username: user, password: token } },
      });
    }
  }, []);

  return (
    <AuthStateContext.Provider value={state}>
      <AuthDispatchContext.Provider value={dispatch}>{children}</AuthDispatchContext.Provider>
    </AuthStateContext.Provider>
  );
};

const reducer = (state, action) => {
  console.log(state);
  switch (action.type) {
    case actions.REQUEST_LOGIN:
      return {
        ...state,
        loading: true,
      };
    case actions.LOGIN_SUCCESS:
      return {
        ...state,
        user: action.payload.data.username,
        token: action.payload.data.password,
        isVoted: action.payload.data.isVoted,
        type: action.payload.data.type,
        loading: false,
        authenticated: true,
      };
    case actions.LOGIN_ERROR:
      return {
        ...state,
        loading: false,
      };
    case actions.LOGOUT:
      return {
        ...state,
        authenticated: false,
        token: null,
        user: null,
      };
    case actions.STOP_LOADING:
      return {
        ...state,
        loading: false,
      };
    default:
      throw new Error(`Unknown action type: ${action.type}`);
  }
};

export const login = async (dispatch, payload) => {
  try {
    dispatch({ type: actions.REQUEST_LOGIN });
    const result = await API.post("/login", payload);

    if (result) {
      dispatch({ type: actions.LOGIN_SUCCESS, payload: result });
      localStorage.setItem("user", result.data.username);
      localStorage.setItem("token", result.data.password);
      localStorage.setItem("isVoted", result.data.isVoted);
      localStorage.setItem("type", result.data.type);
      return result;
    }

    dispatch({ type: actions.LOGIN_ERROR });
  } catch (error) {
    dispatch({ type: actions.LOGIN_ERROR });
  }
};

export const logout = (dispatch, payload) => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  localStorage.removeItem("isVoted");
  localStorage.removeItem("type");
  dispatch({ type: actions.LOGOUT });
};
