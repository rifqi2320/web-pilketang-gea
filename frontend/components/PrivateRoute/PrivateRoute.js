import { useEffect } from "react";
import { useRouter } from "next/router";

import { useAuthDispatch, useAuthState, actions } from "../../contexts/auth.js";
import FullPageLoader from "../FullPageLoader/FullPageLoader.js";

const PrivateRoute = ({ protectedRoutes, children }) => {
  const router = useRouter();
  const { loading, authenticated, type } = useAuthState();
  const dispatch = useAuthDispatch();

  const pathIsProtected = protectedRoutes.indexOf(router.pathname) !== -1;
  const adminProtected = router.pathname.includes("admin");

  // to check for token if switching page
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const user = localStorage.getItem("user");
      const type = localStorage.getItem("type");
      const isVoted = localStorage.getItem("isVoted");
      dispatch({
        type: actions.LOGIN_SUCCESS,
        payload: { data: { username: user, password: token, type: type, isVoted: isVoted } },
      });
    } else {
      dispatch({
        type: actions.LOGIN_ERROR,
      });
    }
  }, []);

  useEffect(() => {
    if (!loading && !authenticated && pathIsProtected) {
      router.push("/login");
    }
    if (adminProtected && type !== "admin" && !loading) {
      router.push("/dashboard");
    }
  }, [loading, authenticated, pathIsProtected, type]);

  if (adminProtected && type !== "admin") {
    return <FullPageLoader />
  }

  if ((loading || !authenticated) && (pathIsProtected)) {
    return <FullPageLoader />;
  }

  return children;
};

export default PrivateRoute;
