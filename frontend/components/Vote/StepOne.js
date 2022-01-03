import { Stack, Flex, Heading, Text, Select, Button, HStack } from "@chakra-ui/react";

import candidateList from "../../calon.json";
import { useEffect, useState } from "react";

const SelectCandidate = ({ allCandidatesList, selectedCandidates, func, num }) => {
  const [notSelected, setNotSelected] = useState([]);

  useEffect(() => {
    const newArray = allCandidatesList.filter(
      (x) => !selectedCandidates.slice(0, num).includes(parse(x.id))
    );
    setNotSelected([...newArray]);
  }, [selectedCandidates]);

  const handleChange = (e) => {
    func(parse(e.target.value), num);
  };

  const parse = (num) => {
    if (num === "") {
      return -1;
    } else {
      return parseInt(num);
    }
  };

  return (
    <>
      {num > 0 && selectedCandidates.slice(0, num).some((result) => result === -1) ? null : (
        <Flex p={4} flexDir="column">
          <Text fontWeight="bold">Pilih Calon untuk Prioritas {num + 1}</Text>
          <Flex pb={4} pt={2}>
            <Select
              placeholder={num === 0 ? "Pilih calon" : "Tidak memilih"}
              onChange={handleChange}
            >
              {notSelected.map((profile, id) => (
                <option key={id} value={profile.id}>
                  {profile.nama}
                </option>
              ))}
            </Select>
          </Flex>
        </Flex>
      )}
    </>
  );
};

const StepOne = ({ timeLeft, onNext, changeStep }) => {
  const allCandidates = candidateList;

  const [selectedCandidates, setSelectedCandidates] = useState(
    new Array(allCandidates.length).fill(-1)
  );

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
    changeStep(2);
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
          w={["90vw", "80vw", "70vw", "50vw"]}
        >
          <Stack width="full" alignContent="center" p={4}>
            <Flex borderWidth={1} borderColor="#f4f4f4" width="full" borderRadius={4}>
              <Heading m={12} mt={2} mb={2} textAlign="center" width="full">
                Vote Senator
              </Heading>
            </Flex>
            <Flex flexDir="column">
              {timeLeft}
              <Stack width="full" alignContent="center" mt={4}>
                {allCandidates.map((_, id) => (
                  <SelectCandidate
                    allCandidatesList={allCandidates}
                    selectedCandidates={selectedCandidates}
                    func={handleSelectedCandidates}
                    num={id}
                    key={id}
                  />
                ))}
              </Stack>
            </Flex>
            <Flex width="full" justifyContent="center" flexDir="column" alignItems="center">
              {selectedCandidates[0] === -1 ? null : (
                <Text color="red" textAlign="center">
                  Periksa kembali pilihan Anda sebelum klik next
                </Text>
              )}
              <Button
                mt={4}
                disabled={selectedCandidates[0] === -1}
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

export default StepOne;
