import { Alert, AlertIcon, Flex, Heading, Text, Link } from "@chakra-ui/react";
import Background from "../Background/Background";

const ServerError = () => {
  return (
    <Background minH="100vh" w="100vw" alignItems="center" justifyContent="center">
      <Flex
        borderRadius={8}
        boxShadow="lg"
        minW="300px"
        flexDir="column"
        textAlign="center"
        bg="white"
      >
        <Heading p={4}>Server Error</Heading>
        <Flex p={8} pt={2} pb={0}>
          <Alert status="error">
            <AlertIcon />
            <Text>Terjadi kesalahan pada server</Text>
          </Alert>
        </Flex>
        <Link
          href="/dashboard"
          textColor="blue"
          width="full"
          textAlign="center"
          mt={4}
          mb={4}
          _focus={{ boxShadow: "none" }}
        >
          Kembali ke Dashboard
        </Link>
      </Flex>
    </Background>
  );
};

export default ServerError;
