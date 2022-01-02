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
import { getCount } from "../../contexts/count";
import { getPaslonData } from "../../contexts/data";
import { CircularProgress, Image, CircularProgressLabel } from "@chakra-ui/react";

const Count = ({ mode }) => {
  const [dataPaslon, setDataPaslon] = useState({});
  const [dataVoting, setDataVoting] = useState({});
  const router = useRouter();
  const dispatch = useAuthDispatch();

  useEffect(() => {
    getPaslonData().then((data_paslon) => {
      if (mode === "Senator") {
        setDataPaslon(
          data_paslon.data.filter((value, index, array) => {
            return value.paslon_id.includes("senator");
          })
        );
      } else {
        setDataPaslon(
          data_paslon.data.filter((value, index, array) => {
            return value.paslon_id.includes("bph");
          })
        );
      }
    });
    console.log(dataPaslon);
    var timer = setInterval(() => {
      getCount().then((res) => {
        if (!res) {
          router.push("/dashboard");  
        } else {
          if (res.counted === res.total) {
            clearInterval(timer);
          }
          setDataVoting(res);
        }
      });
    }, 2000);

    dispatch({ type: actions.STOP_LOADING });
    return () => {
      clearInterval(timer);
    };
  }, []);

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
          <Heading my={4}>Perhitungan Suara {mode}</Heading>
          {mode === "Senator" ? (
            <Link href={"/count_bph"}>
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
              {(dataVoting.counted * 100) / dataVoting.total}%
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
                    <Box borderWidth={1} mb={8} mx={[4, 4, 4, 4]} borderRadius={8} w={"175px"}>
                      <Image src={item.img} />
                      <Text>{item.name}</Text>
                      <Text>{item.nim}</Text>
                      <Text fontSize={"2rem"} fontFamily={"Roboto"}>
                        {resData}
                      </Text>
                    </Box>
                  );
                })
              : ""}
          </Flex>
        </Box>
      </Flex>
    </Background>
  );
};

export default Count;
