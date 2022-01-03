import { Flex, Heading, Text, Button, VStack } from "@chakra-ui/react";

import { useEffect, useState } from "react";

import Background from "../../components/Background/Background.js";
import { logout, useAuthDispatch } from "../../contexts/auth.js";
import { getVoteStat } from "../../contexts/data.js";

const Admin = () => {
  const [dataStatus, setDataStatus] = useState({});
  const dispatch = useAuthDispatch();

  useEffect(() => {
    getVoteStat().then((res) => {
      console.log(res);
      setDataStatus(res);
    });
  }, []);

  const handleLogout = () => {
    logout(dispatch);
  };

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
              <Text fontSize="xl">{dataStatus["Validated"]} Peserta Terverifikasi</Text>
              <Text fontSize="xl">{dataStatus["In Progress"]} Peserta Belum Terverifikasi</Text>
            </Flex>
            <Flex flexDir="column">
              <Button colorScheme="teal" as="a" href="search" variant="outline">
                Verifikasi Peserta
              </Button>
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
