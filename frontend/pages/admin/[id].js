import {
  Flex,
  Heading,
  Text,
  Image,
  HStack,
  Button,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import {
  CheckIcon,
  CloseIcon,
  DeleteIcon,
} from "@chakra-ui/icons";
import moment from "moment";

import Background from "../../components/Background/Background";

const User = ({ nim }) => {
  return (
    <Background>
      <Flex width="100vw" minH="100vh" justifyContent="center" alignItems="center">
        <Flex
          borderRadius={8}
          borderWidth={1}
          boxShadow="lg"
          bg="white"
          flexDir="column"
          alignItems="center"
          mt={8}
        >
          <Flex flexDir="column" textAlign="center" mb={4} p={4} pt={0}>
            <Heading p={8} pb={0}>
              {nim.nim}
            </Heading>
            <Text fontWeight="semibold" fontSize={24}>
              {nim.nama}
            </Text>
          </Flex>
          <Flex
            m={8}
            mt={2}
            flexDir="column"
            alignItems="center"
            borderColor="#cccccc"
            borderWidth={1}
          >
            <Image src={nim.image} htmlWidth="500px" />
          </Flex>
          {nim.isVoted === 0 ? null : (
            <Flex pl={8} pr={8}>
              <Alert status="success">
                <AlertIcon />
                <Flex flexDir="column" textAlign="center">
                  <Text>Peserta ini telah diverifikasi dengan status: {nim.isVoted}</Text>
                  <Text>{moment().format('MMMM Do YYYY, h:mm:ss a')} </Text>
                </Flex>
              </Alert>
            </Flex>
          )}
          <HStack p={6} spacing="24px">
            <Button colorScheme="teal" variant="outline">
              <Text mr={2}>Valid</Text>
              <CheckIcon />
            </Button>
            <Button colorScheme="yellow" variant="outline">
              <Text mr={2}>Tidak Valid</Text>
              <CloseIcon />
            </Button>
            <Button colorScheme="red" variant="outline">
              <Text mr={2}>Buang Suara</Text>
              <DeleteIcon />
            </Button>
          </HStack>
        </Flex>
      </Flex>
    </Background>
  );
};

export async function getStaticProps({ params }) {
  const res = await fetch(`http://localhost:3000/${params.id}.json`);
  const data = await res.json();

  return {
    props: { nim: data },
  };
}

export async function getStaticPaths() {
  const res = await fetch(`http://localhost:3000/nim.json`);
  const data = await res.json();

  const paths = data.map((nim) => {
    return { params: { id: nim } };
  });

  return {
    paths,
    fallback: false,
  };
}

export default User;
