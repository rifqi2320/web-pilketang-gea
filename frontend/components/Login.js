import { useState } from "react";
import axios from "axios";

import { Flex, Box, Heading, FormControl, FormLabel, Input, Button, Text } from "@chakra-ui/react";

const API = axios.create({ baseURL: "http://localhost:3050" });

const formInitialState = {
  username: "",
  password: "",
};

const Login = () => {
  const [formData, setFormData] = useState(formInitialState);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log(formData);
      const result = await API.post("/user/signin", formData);
      console.log(result);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Flex width="full" align="center" justifyContent="center">
      <Box
        px={8}
        py={4}
        w="30vw"
        minW="300px"
        my="10vh"
        borderWidth={1}
        borderRadius={8}
        boxShadow="lg"
      >
        <Box textAlign="center">
          <Heading>Login</Heading>
          <Text fontSize="lg" mt={2}>
            Pemilu HMTG GEA 2021
          </Text>
        </Box>
        <Box my={6} textAlign="left">
          <form onSubmit={handleSubmit}>
            <FormControl>
              <FormLabel>Username</FormLabel>
              <Input placeholder="username" onChange={handleChange} name="username" />
            </FormControl>
            <FormControl mt={6}>
              <FormLabel>Password</FormLabel>
              <Input type="password" placeholder="******" onChange={handleChange} name="password" />
            </FormControl>
            <Button width="full" mt={6} type="submit" colorScheme="orange">
              Log In
            </Button>
          </form>
        </Box>
      </Box>
    </Flex>
  );
};

export default Login;
