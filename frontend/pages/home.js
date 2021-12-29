import { Container, Flex, Heading } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import FullPageLoader from "../components/FullPageLoader/FullPageLoader.js";

import Navbar from "../components/Navbar/Navbar.js";
import { actions, useAuthDispatch, useAuthState } from "../contexts/auth.js";

const Home = () => {
  const { loading, authenticated } = useAuthState();
  const router = useRouter();

  const dispatch = useAuthDispatch();

  useEffect(() => {
    if (!loading && !authenticated) {
      router.push("/login");
    }
  }, [authenticated, loading]);

  useEffect(() => {
    dispatch({ type: actions.STOP_LOADING });
  }, []);

  if (loading || !authenticated) {
    return <FullPageLoader />;
  }

  return (
    <Navbar>
      <Flex w="100vw" h="100vh" bg="#f4f4f4" justifyContent="center" alignItems="center">
        <Heading>Yo</Heading>
      </Flex>
    </Navbar>
  );
};

export default Home;
