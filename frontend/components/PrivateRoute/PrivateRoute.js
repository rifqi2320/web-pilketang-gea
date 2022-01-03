import { useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";

import { useAuthDispatch, useAuthState, actions, logout } from "../../contexts/auth.js";
import FullPageLoader from "../FullPageLoader/FullPageLoader.js";

const PrivateRoute = ({ protectedRoutes, children }) => {
  const router = useRouter();
  const { loading, authenticated, type } = useAuthState();
  const dispatch = useAuthDispatch();

  const pathIsProtected = protectedRoutes.indexOf(router.pathname) !== -1;
  const adminProtected = router.pathname.includes("admin");

  // to check for token if switching page
  const session = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        logout(dispatch);
        return router.push("/login");
      }

      const result = await axios.get("https://backend-piketang-gea.azurewebsites.net/user_data", {
        headers: { Authorization: "Bearer " + token },
      });
      if (result) {
        localStorage.setItem("user", result.data.username);
        localStorage.setItem("type", result.data.type);
        localStorage.setItem("isVoted", result.data.isVoted);
        localStorage.setItem("vote_enabled", result.data.vote_enabled);
      }
      dispatch({
        type: actions.LOGIN_SUCCESS,
        payload: {
          data: {
            username: result.data.username,
            password: token,
            type: result.data.type,
            isVoted: result.data.isVoted,
          },
        },
      });
      return result;
    } catch (error) {
      if (error.response?.status === 422) {
        // console.log(`Session error: ${error.message}`);
        // Session Error
        logout();
      }
    }
  };

  useEffect(() => {
    if (!(router.pathname === "/login")) {
      session();
    }
  }, [router.pathname]);

  useEffect(() => {
    if (!loading && !authenticated && pathIsProtected) {
      router.push("/login");
    }
    if (adminProtected && type !== "admin" && !loading) {
      router.push("/dashboard");
    }
  }, [loading, authenticated, pathIsProtected, type]);

  if (adminProtected && type !== "admin") {
    return <FullPageLoader />;
  }

  if ((loading || !authenticated) && pathIsProtected) {
    return <FullPageLoader />;
  }

  return children;
};

export default PrivateRoute;
