import { Stack, Flex, Heading } from "@chakra-ui/react";

import Background from "../components/Background/Background.js";
import Navbar from "../components/Navbar/Navbar.js";

const vote = () => {
  return (
    <>
      <Navbar />
      <Background>
        <Flex justifyContent="center" alignItems="center" width="100vw">
          <Flex mt={16} bg="#ffffff">    
        <Heading mt={24}>Vote</Heading>
          </Flex>
        </Flex>
      </Background>
    </>
  );
};

export default vote;
