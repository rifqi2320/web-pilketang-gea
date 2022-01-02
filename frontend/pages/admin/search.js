import { Flex, Heading, Input, VStack, Button } from "@chakra-ui/react";
import { useState } from "react";
import Router from "next/router";

import Background from "../../components/Background/Background";
import nimList from "../../public/nim.json";

const UserList = ({ children, isVoted }) => {
  let color;
  if (isVoted === 0) {
    color = "gray";
  } else if (isVoted === 1) {
    color = "red";
  } else if (isVoted === 2) {
    color = "orange";
  } else if (isVoted === 3) {
    color = "green";
  } else {
    color = "black";
  }

  return (
    <Button
      colorScheme="gray"
      isExternal
      as="a"
      href={children}
      w="full"
      color={color}
      textAlign="center"
      variant="outline"
    >
      {children}
    </Button>
  );
};

const Search = () => {
  const [search, setSearch] = useState("");

  const handleChange = (e) => {
    setSearch(e.target.value);
  };

  return (
    <Background minH="100vh" position="absolute">
      <Flex width="100vw" justifyContent="center">
        <Flex
          borderRadius={8}
          borderWidth={1}
          boxShadow="lg"
          bg="white"
          flexDir="column"
          minW="400px"
          mt={16}
          mb={16}
        >
          <Flex>
            <Heading p={8} pb={4} width="full" textAlign="center">
              Cari Peserta
            </Heading>
          </Flex>
          <Flex p={8} pb={2}>
            <Input placeholder="NIM" value={search} onChange={handleChange} />
          </Flex>
          <Flex p={8} pt={2}>
            <VStack w="full" spacing={1}>
              {nimList
                .filter((nim) => {
                  if (search === "") {
                    return nim;
                  } else if (nim.includes(search)) {
                    return nim;
                  }
                })
                .map((nim) => (
                  <UserList>{nim}</UserList>
                ))}
            </VStack>
          </Flex>
        </Flex>
      </Flex>
    </Background>
  );
};

export default Search;
