import { Container, Heading } from "@chakra-ui/react";

import Navbar from "../components/Navbar/Navbar.js";

const Home = () => {
  return (
    <div>
      <Navbar>
      <Container minH="100vh">
        <Heading>Content</Heading>
      </Container>
      </Navbar>
    </div>
  );
};

export default Home;
