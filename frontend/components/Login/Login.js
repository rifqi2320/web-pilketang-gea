import { useEffect, useState } from "react";
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
  Spinner,
} from "@chakra-ui/react";
import { useRouter } from "next/router";

import { actions, login, useAuthDispatch, useAuthState } from "../../contexts/auth.js";

const formInitialState = {
  username: "",
  password: "",
};

const Login = () => {
  const [formData, setFormData] = useState(formInitialState);
  const [badLogin, setBadLogin] = useState(false);

  const dispatch = useAuthDispatch();
  const { loading, authenticated } = useAuthState();

  const router = useRouter();

  // check if the user is logged in
  useEffect(() => {
    if (authenticated) {
      router.push("/home");
    }
  },[loading, authenticated])

  useEffect(() => {
    dispatch({ type: actions.STOP_LOADING });
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await login(dispatch, formData);

      if (!result) return setBadLogin(true);

      router.push("/home");
      setBadLogin(false);
    } catch (error) {
      if (error.response?.status === 400) {
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
            {badLogin ? (
              <Alert status="error" mt={4}>
                <AlertIcon />
                <AlertDescription>Username atau password salah!</AlertDescription>
              </Alert>
            ) : null}
            <Button
              disabled={formData.username === "" || formData.password === "" || loading}
              width="full"
              mt={4}
              type="submit"
              colorScheme="orange"
            >
              {loading ? <Spinner /> : "Log In"}
            </Button>
          </form>
        </Box>
      </Box>
    </Flex>
  );
};

export default Login;
