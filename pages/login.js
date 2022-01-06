import Head from "next/head";
import { Container } from "@chakra-ui/layout";

import Login from "../components/Login/Login";

const login = () => {
  return (
    <div>
      <Head>
        <title>Login - PEMILU HMTG "GEA" 2021</title>
      </Head>
      <Container bg="#f4f4f4" minW="100vw" minH="100vh" centerContent>
        <Login />
      </Container>
    </div>
  );
};

export default login;
