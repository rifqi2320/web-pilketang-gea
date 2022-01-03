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
import FullPageLoader from "../../components/FullPageLoader/FullPageLoader";

const showStatus = (isVoted, timestamp) => {
  if (isVoted === 4) {
    return (
      <Alert status="success">
        <AlertIcon />
        <Flex flexDir="column" textAlign="left">
          <Text>
            Peserta ini telah diverifikasi dengan status: <b>Valid</b>
          </Text>
          <Text>Waktu diverifikasi : {timestamp}</Text>
        </Flex>
      </Alert>
    );
  } else if (isVoted === 3) {
    return (
      <Alert status="warning">
        <AlertIcon />
        <Flex flexDir="column" textAlign="center">
          <Text>
            Peserta ini telah diverifikasi dengan status: <b>Suara dibuang</b>
          </Text>
          <Text>Waktu diverifikasi : {timestamp}</Text>
        </Flex>
      </Alert>
    );
  } else if (isVoted === 2) {
    return (
      <Alert status="warning">
        <AlertIcon />
        <Flex flexDir="column" textAlign="center">
          <Text>
            Peserta ini telah diverifikasi dengan status: <b>Tidak Valid</b>
          </Text>
          <Text>Waktu diverifikasi : {timestamp}</Text>
        </Flex>
      </Alert>
    );
  } else if (isVoted === 1) {
    return null;
  }
};

const User = () => {
  const router = useRouter();
  const { id } = router.query;
  const token = localStorage.getItem("token");

  const [userData, setUserData] = useState({});
  const [voteData, setVoteData] = useState({});

  const API = axios.create({
    baseURL: "https://backend-piketang-gea.azurewebsites.net/",
    headers: {
      Authorization: "Bearer " + token,
    },
  });

  useEffect(() => {
    API.post("/get_user", { nim: id })
      .then((res) => {
        setUserData(res.data.data);
      })
      .catch((err) => console.log(err));
    API.post("/get_vote", { nim: id })
      .then((res) => {
        if (res.status === 200) {
          setVoteData(res.data.data);
        } else {
          setVoteData({
            username: null,
            bph_id: null,
            senator_id: null,
            timestamp: null,
            img_url: null,
            timeTaken: null,
            status: 0,
          });
        }
      })
      .catch((err) => console.log(err));
  }, [id]);

  const reviewVote = (nim, status) => {
    API.post("/review", {
      username: nim,
      action: status,
    }).then((res) => {
      router.reload();
    });
  };

  if (!userData || !voteData || !id) {
    return <FullPageLoader />;
  }
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
            {"<<< Kembali"}
          </Link>
          <Flex flexDir="column" textAlign="center" p={4} pt={0}>
            <Heading px={8} pb={0}>
              {userData.username}
            </Heading>
          </Flex>
          {userData.isVoted === 0 ? (
            <Text pb={8} px={8} fontSize={"xl"}>
              Peserta belum menggunakan suaranya
            </Text>
          ) : (
            <>
              <Flex flexDir={"column"} textAlign={"center"}>
                <Text px={8}>Lama pengisian suara: {voteData.timeTaken}</Text>
                <Text px={8}>Waktu pengisian suara: {voteData.timestamp} </Text>
              </Flex>
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
                {showStatus(userData.isVoted, voteData.review_timestamp)}
              </Flex>
              <HStack p={6} spacing="24px">
                <Button
                  colorScheme="teal"
                  variant="outline"
                  onClick={() => reviewVote(userData.username, "Accept")}
                >
                  <Text mr={2}>Valid</Text>
                  <CheckIcon />
                </Button>
                <Button
                  colorScheme="yellow"
                  variant="outline"
                  onClick={() => reviewVote(userData.username, "Reject")}
                >
                  <Text mr={2}>Tidak Valid</Text>
                  <CloseIcon />
                </Button>
                <Button
                  colorScheme="red"
                  variant="outline"
                  onClick={() => reviewVote(userData.username, "Delete")}
                >
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
