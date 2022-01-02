import { Alert, AlertIcon, Flex, Heading, Link, Text } from "@chakra-ui/react";
import Background from "../components/Background/Background";

const VoteFailed = () => {
  return (
    <Background minH="100vh" justifyContent="center" alignItems="center">
      <Flex
        mt={28}
        mb={8}
        bg="#ffffff"
        borderWidth={1}
        borderRadius={8}
        boxShadow="lg"
        bg="white"
        flexDir="column"
      >
        <Alert status="error">
          <AlertIcon />
          <Flex flexDir="column" textAlign="center">
            <Heading fontSize="xl" p={4} pb={2}>
              Gagal Melakukan Vote
            </Heading>
            <Text p={4} pt={2}>Mohon hubungi panitia untuk tindak lanjut</Text>
            <Link ></Link>
          </Flex>
        </Alert>
      </Flex>
    </Background>
  );
};

export default VoteFailed;
