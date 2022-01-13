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
  const { loading, authenticated } = useAuthState();
  const [isVoting, setIsVoting] = useState(null);
  const router = useRouter();
  const dispatch = useAuthDispatch();

  const isVoted = localStorage.getItem("isVoted");

  useEffect(() => {
    const vote_enabled = localStorage.getItem("vote_enabled");
    setIsVoting(vote_enabled === "true");
    dispatch({ type: actions.STOP_LOADING });
    getVoteStat()
      .then((res) => {
        setVoteData(res);
      })
      .catch((err) => console.error(err));
  }, []);

  const handleClick = () => {
    router.push("/vote");
  };

  if (loading || !authenticated) {
    return <FullPageLoader />;
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
              Pemilu HMTG "GEA" 2021
            </Heading>
            <Heading size="xl" m={2}></Heading>
          </Stack>
          <Box>
            <Stack
              m={2}
              direction={["column", "row", "row", "row"]}
              divider={<StackDivider borderColor="gray.300" />}
              pb={4}
            >
              <Container w={["100%", "170%", "170%", "170%"]}>
                <Heading m={4} size="lg">
                  Panduan Pemilihan
                </Heading>
                <OrderedList>
                  <ListItem>Klik tombol "Voting Sekarang"</ListItem>
                  <ListItem>Anda akan memasuki halaman pemungutan suara</ListItem>
                  <ListItem>
                    Pilih calon ketua umum BPH HMTG "GEA" ITB berdasarkan prioritas yang anda
                    inginkan.
                  </ListItem>
                  <ListItem>
                    Lanjut ke halaman selanjutnya, pilih calon Senator HMTG "GEA" ITB berdasarkan
                    prioritas yang anda inginkan.
                  </ListItem>
                  <ListItem>
                    Ambil foto wajah dengan menyertakan kartu identitas seperti KTM,KTP,atau kartu
                    lainnya dengan terlihat wajah dan identitas dengan jelas dalam satu frame.
                    (Kartu identitas yang dipilih minimal dengan foto yang diambil saat SMA)
                  </ListItem>
                  <ListItem>Setelah itu, klik tombol submit.</ListItem>
                  <ListItem>Klik tombol konfirmasi.</ListItem>
                  <ListItem>
                    <b>
                      Perlu diingat waktu yang diberikan selama pemilihan adalah 8 menit. Jika
                      pemilih melebihi waktu yang diberikan maka akan auto tersubmit dengan suara
                      kosong.
                    </b>
                  </ListItem>
                </OrderedList>
              </Container>
              <Container p={4} w={["100%", "50%", "50%", "50%"]}>
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
                    <Text>
                      Suara tervalidasi :
                      {voteData ? voteData["Validated"] + voteData["Rejected"] : "-"}
                    </Text>
                  </ListItem>
                </UnorderedList>
                <Text my={4}>
                  Status Suara Anda : <b>{isVoted == 0 ? "Belum Ada" : "Sudah Ada"}</b>
                </Text>
                {isVoting ? (
                  (isVoted == 0) | (isVoted == 2) ? (
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
                    <Button size={"sm"} isDisabled={true} variant={"solid"}>
                      Anda sudah melakukan voting
                    </Button>
                  )
                ) : (
                  <Button size={"sm"} isDisabled={true} variant={"solid"}>
                    Anda tidak bisa melakukan voting
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
