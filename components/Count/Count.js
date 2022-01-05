import Background from "../Background/Background";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import FullPageLoader from "../FullPageLoader/FullPageLoader";
import { actions, useAuthDispatch, useAuthState } from "../../contexts/auth";
import {
  Flex,
  Box,
  Heading,
  Text,
  Container,
  SimpleGrid,
  Link,
  OrderedList,
  UnorderedList,
  StackDivider,
} from "@chakra-ui/layout";
import axios from "axios";
import { getCount } from "../../contexts/count";
import { getPaslonData } from "../../contexts/data";
import { CircularProgress, Image, CircularProgressLabel, Button } from "@chakra-ui/react";

const Count = ({ mode }) => {
  const [dataPaslon, setDataPaslon] = useState({});
  const [dataVoting, setDataVoting] = useState({});
  const [isDone, setIsDone] = useState(false);
  const [counting, setCounting] = useState(null);
  const { loading, authenticated } = useAuthState();
  const dispatch = useAuthDispatch();
  const user = localStorage.getItem("user");
  const token = localStorage.getItem("token");
  const router = useRouter();

  const nextMode = () => {
    if (mode != "Senator") {
      axios
        .post(
          "https://backend-pilketang-gea.azurewebsites.net/stop_count",
          {},
          {
            headers: { Authorization: "Bearer " + token },
          }
        )
        .then(() => {
          axios.post(
            "https://backend-pilketang-gea.azurewebsites.net/start_count",
            {},
            {
              headers: { Authorization: "Bearer " + token },
            }
          );
        })
        .then(() => {
          router.push("count-senator");
        });
    }
  };

  useEffect(() => {
    getPaslonData().then((data_paslon) => {
      if (mode === "Senator") {
        setDataPaslon(data_paslon.senator);
      } else {
        setDataPaslon(data_paslon.bph);
      }
    });
    var timer = setInterval(() => {
      getCount(user, token).then((res) => {
        if (!res) {
          clearInterval(timer);
          setCounting(false);
        } else {
          if (res.counted === res.total) {
            setIsDone(true);
            clearInterval(timer);
          }
          setDataVoting(res);
          setCounting(true);
        }
      });
    }, 2000);

    dispatch({ type: actions.STOP_LOADING });
    return () => {
      clearInterval(timer);
    };
  }, []);

  if (loading || !authenticated || counting == null || !user) {
    return <FullPageLoader />;
  }

  if (!counting) {
    return (
      <Background minH={"100vh"} justifyContent={"center"}>
        <Flex pb={8} justifyContent={"center"} height="full">
          <Box
            w={["80vw", "80vw", "80vw", "60vw"]}
            minW="300px"
            alignContent={"center"}
            textAlign={"center"}
            mt={24}
            borderWidth={1}
            borderRadius={8}
            boxShadow="lg"
            bg="#ffffff"
          >
            <Heading mt={24} mx={8}>
              Hasil belum bisa ditampilkan
            </Heading>
            <Text mb={24} mx={8} mt={4}>
              Silahkan kembali lagi pada tanggal yang ditentukan
            </Text>
          </Box>
        </Flex>
      </Background>
    );
  }

  return (
    <Background minH={"100vh"} justifyContent={"center"}>
      <Flex pb={8} justifyContent={"center"} height="full">
        <Box
          w={["80vw", "80vw", "80vw", "60vw"]}
          minW="300px"
          alignContent={"center"}
          textAlign={"center"}
          mt={24}
          borderWidth={1}
          borderRadius={8}
          boxShadow="lg"
          bg="#ffffff"
        >
          <Heading my={8}>Perhitungan Suara {mode}</Heading>
          {user === "admin" ? (
            ""
          ) : mode === "Senator" ? (
            <Link href={"/count-bph"}>
              <Text textAlign="left" mx={5}>
                {"<<< Ketua BPH"}
              </Text>
            </Link>
          ) : (
            <Link href={"/count-senator"}>
              <Text textAlign="right" mx={5}>
                {"Senator >>>"}
              </Text>
            </Link>
          )}

          <CircularProgress
            color={"#FF7315"}
            value={(dataVoting.counted * 100) / dataVoting.total}
            size={["50vw", "40vw", "30vw", "10vw"]}
            m={2}
          >
            <CircularProgressLabel fontFamily={"Roboto"}>
              {Math.round((dataVoting.counted * 100) / dataVoting.total)}%
            </CircularProgressLabel>
          </CircularProgress>
          <Text mb={4}>
            <b>
              {dataVoting.counted}/{dataVoting.total}
            </b>
            <br /> Suara terhitung
          </Text>
          <Flex justifyContent={"center"} wrap={"wrap"}>
            {dataPaslon.length
              ? dataPaslon.map((item, index) => {
                  let resData = "-";
                  if (dataVoting.senator && dataPaslon) {
                    if (mode === "Senator") {
                      resData = dataVoting.senator[index];
                    } else {
                      resData = dataVoting.bph[index];
                    }
                  } else {
                    resData = "-";
                  }
                  return (
                    <Box
                      borderWidth={1}
                      mb={8}
                      p={2}
                      mx={[4, 4, 4, 4]}
                      borderRadius={8}
                      w={"300px"}
                      alignContent={"center"}
                      textAlign={"center"}
                    >
                      <Image src={item.photo} borderRadius={"10px"} />
                      <Text fontSize={"1.1rem"} my={2}>
                        {item.name}
                      </Text>
                      <Text>
                        <b>{item.nim}</b>
                      </Text>
                      <Text fontSize={"2rem"} fontFamily={"Roboto"}>
                        {resData}
                      </Text>
                    </Box>
                  );
                })
              : ""}
          </Flex>
          {isDone && mode !== "Senator" ? (
            <Button mb={8} colorScheme={"orange"} variant={"outline"} onClick={nextMode}>
              Next
            </Button>
          ) : null}
        </Box>
      </Flex>
    </Background>
  );
};

export default Count;
