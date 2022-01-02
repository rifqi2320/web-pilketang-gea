import { Container, Flex, Heading } from "@chakra-ui/react";

import Navbar from "../components/Navbar/Navbar.js";

const Home = () => {
  return (
    <Navbar>
      <Flex w="100vw" h="100vh" bg="#f4f4f4" justifyContent="center" alignItems="center">
        <Heading>Yo</Heading>
      </Flex>
    </Navbar>
  );
};

export default Home;
