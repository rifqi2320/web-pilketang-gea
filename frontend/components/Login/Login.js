import { useState } from "react";
import axios from "axios";

import {
  Flex,
  Box,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Alert,
  AlertIcon,
  AlertDescription,
} from "@chakra-ui/react";

const API = axios.create({ baseURL: "http://localhost:5000" });

const formInitialState = {
  username: "",
  password: "",
};

const Login = () => {
  const [formData, setFormData] = useState(formInitialState);
  const [badLogin, setBadLogin] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await API.post("/login", formData);
      console.log(result);
    } catch (error) {
      if (error.response.status === 400) {
        setBadLogin(true);
      }
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
        bg="white"
      >
        <Box textAlign="center">
          <Heading>Login</Heading>
          <Text fontSize="lg" mt={2}>
            Pemilu HMTG GEA 2021
          </Text>
        </Box>
        <Box my={6} textAlign="left">
          <form onSubmit={handleSubmit}>
            <FormControl id="login-username">
              <FormLabel>Username</FormLabel>
              <Input placeholder="username" onChange={handleChange} name="username" />
            </FormControl>
            <FormControl mt={6} id="login-password">
              <FormLabel>Password</FormLabel>
              <Input type="password" placeholder="******" onChange={handleChange} name="password" />
            </FormControl>
            {badLogin? (
              <Alert status="error" mt={4}>
                <AlertIcon />
                <AlertDescription>
                  Username atau password salah!
                </AlertDescription>
              </Alert>
            ): null}
            <Button
              disabled={formData.username === "" || formData.password === ""}
              width="full"
              mt={4}
              type="submit"
              colorScheme="orange"
            >
              Log In
            </Button>
          </form>
        </Box>
      </Box>
    </Flex>
  );
};

export default Login;
