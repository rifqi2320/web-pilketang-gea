import { Stack, Flex, Heading, Text, Button, Image } from "@chakra-ui/react";
import { useEffect, useState } from "react";

import SelectCandidate from "./SelectCandidate";
import PaslonList from "./PaslonList";
import Router from "next/router";

const StepZero = ({ timeLeft, onNext, changeStep }) => {
  // const allCandidates = candidateList.bph;
  const [allCandidates, setAllCandidates] = useState([]);

  const fetchData = async () => {
    try {
      const res = await fetch(`${window.location.origin}/data_paslon.json`);
      const data = await res.json();
      setAllCandidates(data.bph);
      setSelectedCandidates(new Array(2).fill(-1));
    } catch (error) {
      Router.push("/server-error");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const [selectedCandidates, setSelectedCandidates] = useState([]);

  const handleSelectedCandidates = (candidate, index) => {
    const arr = selectedCandidates;
    arr[index] = candidate;

    for (let i = index + 1; i < arr.length; i++) {
      arr[i] = -1;
    }
    setSelectedCandidates([...arr]);
  };

  const handleClick = () => {
    onNext(selectedCandidates);
    changeStep(1);
  };

  return (
    <>
      <Flex justifyContent="center" width="100vw" height="full">
        <Flex
          mt={28}
          mb={8}
          bg="#ffffff"
          borderWidth={1}
          borderRadius={8}
          boxShadow="lg"
          bg="white"
        >
          <Stack width="full" alignContent="center" p={4}>
            <Flex borderWidth={1} borderColor="#f4f4f4" width="full" borderRadius={4}>
              <Heading m={12} mt={2} mb={2} textAlign="center" width="full">
                Vote Ketua BPH
              </Heading>
            </Flex>
            <Flex flexDir="column">
              {timeLeft}
              <PaslonList profileList={allCandidates} mt={4} spacing="20px" />
              <Stack width="full" alignContent="center" mt={4}>
                {allCandidates.map((_, id) => (
                  <SelectCandidate
                    allCandidatesList={allCandidates}
                    selectedCandidates={selectedCandidates}
                    func={handleSelectedCandidates}
                    num={id}
                    key={id}
                    mt={8}
                  />
                ))}
              </Stack>
            </Flex>
            <Flex width="full" justifyContent="center" flexDir="column" alignItems="center">
              {selectedCandidates[0] === -1 || selectedCandidates.length === 0 ? null : (
                <Text color="red" textAlign="center">
                  Periksa kembali pilihan Anda sebelum klik next
                </Text>
              )}
              <Button
                mt={4}
                disabled={selectedCandidates[0] === -1 || selectedCandidates.length === 0}
                width="full"
                maxW="200px"
                bg="#FF7315"
                color="white"
                _hover={{ bg: "#E25B00" }}
                onClick={handleClick}
              >
                Next
              </Button>
            </Flex>
          </Stack>
        </Flex>
      </Flex>
    </>
  );
};

export default StepZero;
