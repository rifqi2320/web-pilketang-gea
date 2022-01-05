import { Flex, Heading, Link, Text, Button, VStack } from "@chakra-ui/react";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Background from "../../components/Background/Background.js";
import { logout, useAuthDispatch, useAuthState, actions } from "../../contexts/auth.js";
import { getVoteStat } from "../../contexts/data.js";
import { getCount } from "../../contexts/count.js";
import axios from "axios";

const Admin = () => {
  const [dataStatus, setDataStatus] = useState({});
  const [readyCount, setReadyCount] = useState(null);
  const [isCounting, setIsCounting] = useState(null);
  const [isVoting, setIsVoting] = useState(null);
  const [isFinished, setIsFinished] = useState(null);
  const dispatch = useAuthDispatch();
  const { loading, authenticated } = useAuthState();
  const router = useRouter();

  const token = localStorage.getItem("token");
  const vote_enabled = localStorage.getItem("vote_enabled");

  const toggleVoting = () => {
    axios
      .put(
        `https://backend-pilketang-gea.azurewebsites.net/toggle_voting`,
        {},
        {
          headers: { Authorization: "Bearer " + token },
        }
      )
      .then(() => {
        setIsVoting(!isVoting);
      });
  };

  const toggleFinished = () => {
    axios
      .put(
        `https://backend-pilketang-gea.azurewebsites.net/toggle_results`,
        {},
        {
          headers: { Authorization: "Bearer " + token },
        }
      )
      .then(() => {
        setIsFinished(!isFinished);
      });
  };

  const toggleCounting = () => {
    if (isCounting) {
      axios
        .post(
          "https://backend-pilketang-gea.azurewebsites.net/stop_count",
          {},
          {
            headers: { Authorization: "Bearer " + token },
          }
        )
        .then((res) => {
          setIsCounting(false);
        });
    } else {
      axios
        .post(
          "https://backend-pilketang-gea.azurewebsites.net/start_count",
          {},
          {
            headers: { Authorization: "Bearer " + token },
          }
        )
        .then((res) => {
          setIsCounting(true);
        });
    }
  };

  useEffect(() => {
    if (vote_enabled == "true") {
      setIsVoting(true);
    } else {
      setIsVoting(false);
    }
    getVoteStat().then((res) => {
      setDataStatus(res);
      if (res["In Progress"] === 0) {
        setReadyCount(true);
      } else {
        setReadyCount(false);
      }
    });
    getCount("admin", token).then((res) => {
      if (res) {
        setIsCounting(true);
      } else {
        setIsCounting(false);
      }
    });
    getCount("12020001", "").then((res) => {
      if (res) {
        setIsFinished(true);
      } else {
        setIsFinished(false);
      }
    });

    dispatch({ type: actions.STOP_LOADING });
  }, []);

  const handleLogout = () => {
    logout(dispatch);
  };

  if (loading || !authenticated) {
    return <FullPageLoader />;
  }
  return (
    <Background>
      <Flex width="100vw" minH="100vh" justifyContent="center" alignItems="center">
        <Flex borderRadius={8} borderWidth={1} boxShadow="lg" bg="white" flexDir="column">
          <Flex>
            <Heading p={8} pb={4} width="full" textAlign="center">
              Panel Validasi Voting
            </Heading>
          </Flex>
          <VStack p={8} pt={0} spacing={8}>
            <Flex justifyContent="center" textAlign="center" flexDir="column">
              <Text fontSize="xl">
                {dataStatus["Validated"] + dataStatus["Rejected"]} Peserta Terverifikasi
              </Text>
              <Text fontSize="xl">{dataStatus["In Progress"]} Peserta Belum Terverifikasi</Text>
            </Flex>
            <Flex flexDir="column">
              <Button colorScheme="teal" as="a" href="search" variant="outline">
                Verifikasi Peserta
              </Button>
              <Button colorScheme="teal" as="a" href="/dashboard" variant="outline" mt={4}>
                Dashboard
              </Button>
              {isCounting ? (
                <Button colorScheme="yellow" onClick={toggleCounting} variant="outline" mt={4}>
                  Stop Counting
                </Button>
              ) : (
                <Button
                  colorScheme="yellow"
                  onClick={toggleCounting}
                  isDisabled={!readyCount || isVoting}
                  variant="outline"
                  mt={4}
                >
                  Start Counting
                </Button>
              )}
              {isVoting ? (
                <Button colorScheme="yellow" onClick={toggleVoting} variant="outline" mt={4}>
                  Stop Voting
                </Button>
              ) : (
                <Button colorScheme="yellow" onClick={toggleVoting} variant="outline" mt={4}>
                  Start Voting
                </Button>
              )}
              {isFinished ? (
                <Button colorScheme="yellow" onClick={toggleFinished} variant="outline" mt={4}>
                  Hide Results
                </Button>
              ) : (
                <Button
                  colorScheme="yellow"
                  onClick={toggleFinished}
                  isDisabled={!isCounting && isVoting}
                  variant="outline"
                  mt={4}
                >
                  Show Results
                </Button>
              )}
              <Button
                colorScheme="red"
                onClick={handleLogout}
                as="a"
                href="/login"
                variant="outline"
                mt={4}
              >
                Log out
              </Button>
            </Flex>
          </VStack>
        </Flex>
      </Flex>
    </Background>
  );
};

export default Admin;
