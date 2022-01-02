import {
  Flex,
  ListItem,
  Box,
  Heading,
  Text,
  Stack,
  Container,
  OrderedList,
  UnorderedList,
  StackDivider,
} from "@chakra-ui/layout";
import { Button } from "@chakra-ui/react";
import Background from "../Background/Background";
import { React, useState, useEffect } from "react";
import { useRouter } from "next/router";
import { getVoteStat } from "../../contexts/data";
import { actions, useAuthDispatch, useAuthState } from "../../contexts/auth";

const Dashboard = () => {
  const [voteData, setVoteData] = useState(null);
  const [isVoted, setIsVoted] = useState(null);
  const router = useRouter();
  const dispatch = useAuthDispatch();

  useEffect(() => {
    dispatch({ type: actions.STOP_LOADING });
    setIsVoted(localStorage.getItem("isVoted"));
    getVoteStat()
      .then((res) => {
        setVoteData(res);
      })
      .catch((err) => console.error(err));
  }, []);

  const handleClick = () => {
    router.push('/vote');
    localStorage.setItem("initialTime", Date.now());
  }

  return (
    <Background minH={"100vh"} justifyContent="center">
      <Flex pb={24} h="full">
        <Box
          w={["80vw", "80vw", "80vw", "60vw"]}
          minW="300px"
          mt={24}
          borderWidth={1}
          borderRadius={8}
          boxShadow="lg"
          bg="#ffffff"
        >
          <Stack
            borderWidth={1}
            borderRadius={8}
            px={8}
            py={8}
            dropShadow={"md"}
            direction={"row"}
            bg="#FF7315"
            color="white"
          >
            <Heading size="xl" m={2} align="center" w="full">
              Pemilu HMTG "GEA" 2022
            </Heading>
            <Heading size="xl" m={2}></Heading>
          </Stack>
          <Box>
            <Stack
              m={2}
              direction={["column", "row"]}
              divider={<StackDivider borderColor="gray.300" />}
            >
              <Container>
                <Heading m={4} size="lg">
                  Panduan Pemilihan
                </Heading>
                <OrderedList>
                  <ListItem>Pergi ke halaman pemilihan dengan menekan "Voting Sekarang"</ListItem>
                  <ListItem>Pilih kandidat</ListItem>
                </OrderedList>
              </Container>
              <Container p={4}>
                <UnorderedList>
                  <ListItem>
                    <Text>Belum voting : {voteData ? voteData["Not Voted"] : "-"}</Text>
                  </ListItem>
                  <ListItem>
                    <Text>
                      Suara sedang divalidasi : {voteData ? voteData["In Progress"] : "-"}
                    </Text>
                  </ListItem>
                  <ListItem>
                    <Text>Suara tervalidasi : {voteData ? voteData["Voted"] : "-"}</Text>
                  </ListItem>
                </UnorderedList>
                <Text my={4}>
                  Status Suara Anda : <b>{true ? "Belum Ada" : "Sudah Ada"}</b>
                </Text>
                {true ? (
                  <Button
                    size="sm"
                    colorScheme="whiteAlpha"
                    textColor="orange"
                    outline="orange"
                    variant={"outline"}
                    onClick={handleClick}
                  >
                    Vote Sekarang
                  </Button>
                ) : (
                  <Button size="sm" isDisabled={true} variant={"solid"}>
                    Anda sudah melakukan voting
                  </Button>
                )}
              </Container>
            </Stack>
          </Box>
        </Box>
      </Flex>
    </Background>
  );
};

export default Dashboard;
