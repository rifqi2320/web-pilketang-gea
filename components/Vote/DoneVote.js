import { ArrowBackIcon } from "@chakra-ui/icons";
import { Alert, AlertIcon, Button, Flex, Heading, Text } from "@chakra-ui/react";
import Router from "next/router";
import Background from "../Background/Background";

const DoneVote = () => {
  const handleClick = () => {
    Router.push("/dashboard");
  }

  return (
    <Background minH="100vh" w="100vw" justifyContent="center" alignItems="center">
      <Flex bg="white" borderRadius={8} boxShadow="lg" h="full" flexDir="column">
        <Flex p={8} pb={0}>
          <Heading textAlign="center" width="full">Telah Melakukan Vote</Heading>
        </Flex>
        <Flex p={8} maxW="500px">
          <Alert status="info" borderRadius={4} bg="white" borderWidth={1} borderColor="#3182ce">
            <AlertIcon />
            <Text textAlign="center">
              Terima kasih telah melakukan vote untuk pemilu ini. Berkas Anda akan segera diverifikasi.
            </Text>
          </Alert>
        </Flex>
        <Flex w="100%" justifyContent="center" mb={4}>
          <Button minW="100px" onClick={handleClick}>
            <ArrowBackIcon />
          </Button>
        </Flex>
      </Flex>
    </Background>
  );
};

export default DoneVote;
