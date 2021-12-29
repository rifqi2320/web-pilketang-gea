import Login from "../components/Login/Login";
import { Container } from "@chakra-ui/layout";
import Check from "../components/Check";
// import { useRouter } from "next/router";
// import { useAuthState, useAuthDispatch, actions } from "../contexts/auth";

const login = () => {

  return (
    <div>
      <Container bg="#f4f4f4" minW="100vw" minH="100vh" centerContent>
        <Check />
        <Login />
      </Container>
    </div>
  );
};

export default login;
