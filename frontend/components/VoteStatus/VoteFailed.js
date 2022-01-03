import { Alert, AlertIcon, Flex, Heading, Link, Text } from "@chakra-ui/react";
import Background from "../Background/Background";

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
        <Flex p={8} pb={4} flexDir="column">
          <Alert status="error" borderRadius={4} maxW="500px">
            <AlertIcon />
            <Flex flexDir="column" textAlign="center">
              <Heading fontSize="xl" p={2} pb={2}>
                Gagal Melakukan Vote
              </Heading>
              <Text p={2} pt={2}>
                Silakan lakukan vote kembali. Hubungi panitia jika Anda tidak bisa melakukan vote kembali.
              </Text>
            </Flex>
          </Alert>
          <Flex textAlign="center">
            <Link
              href="/dashboard"
              textColor="blue"
              width="full"
              textAlign="center"
              mt={4}
              _focus={{ boxShadow: "none" }}
            >
              Kembali ke Dashboard
            </Link>
          </Flex>
        </Flex>
      </Flex>
    </Background>
  );
};

export default VoteFailed;
