import Login from "../components/Login/Login";
import { Container } from "@chakra-ui/layout";

const login = () => {

  return (
    <div>
      <Container bg="#f4f4f4" minW="100vw" minH="100vh" centerContent>
        <Login />
      </Container>
    </div>
  );
};

export default login;
