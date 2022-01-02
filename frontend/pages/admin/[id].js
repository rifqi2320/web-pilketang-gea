import {
  Flex,
  Link,
  Heading,
  Text,
  Image,
  HStack,
  Button,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import { CheckIcon, CloseIcon, DeleteIcon } from "@chakra-ui/icons";
import moment from "moment";
import { useRouter } from "next/router";

import Background from "../../components/Background/Background";
import { useEffect, useState } from "react";
import { useAuthState } from "../../contexts/auth";
import axios from "axios";

const User = () => {
  const router = useRouter();
  const { id } = router.query;
  const { loading, token } = useAuthState();

  const [userData, setUserData] = useState({});
  const [voteData, setVoteData] = useState({});

  const API = axios.create({
    baseURL: "http://localhost:5000",
    headers: {
      Authorization: "Bearer " + token,
    },
  });

  useEffect(() => {
    console.log(`id: ${id}`);
    API.post("/get_user", { nim: id })
      .then((res) => setUserData(res.data.data))
      .catch((err) => console.log(err));
    API.post("/get_vote", { nim: id })
      .then((res) => setVoteData(res.data.data))
      .catch((err) => console.log(err));
  }, [id]);

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
          mt={2}
        >
          <Link textAlign={"left"} w="100%" pl={4} pt={4} href={"/admin/search"}>
            {"<<< Back"}
          </Link>
          <Flex flexDir="column" textAlign="center" mb={4} p={4} pt={0}>
            <Heading px={8} pb={0}>
              {userData.username}
            </Heading>
          </Flex>
          {userData.isVoted === 0 ? (
            <Text pb={8} px={4} fontSize={"xl"}>
              Peserta belum menggunakan suaranya
            </Text>
          ) : (
            <>
              <Flex
                m={8}
                mt={2}
                flexDir="column"
                alignItems="center"
                borderColor="#cccccc"
                borderWidth={1}
              >
                <Image src={voteData.img_url} htmlWidth="500px" />
              </Flex>
              <Flex pl={8} pr={8}>
                <Alert status="success">
                  <AlertIcon />
                  <Flex flexDir="column" textAlign="center">
                    <Text>Peserta ini telah diverifikasi dengan status: {userData.isVoted}</Text>
                    <Text>{moment().format("MMMM Do YYYY, h:mm:ss a")} </Text>
                  </Flex>
                </Alert>
              </Flex>
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
            </>
          )}
        </Flex>
      </Flex>
    </Background>
  );
};

export default User;
