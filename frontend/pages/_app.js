import { ChakraProvider } from "@chakra-ui/react";
import PrivateRoute from "../components/PrivateRoute/PrivateRoute";
import { AuthProvider } from "../contexts/auth";

import "../styles/globals.css";
import { theme } from "../styles/theme.js";

function MyApp({ Component, pageProps }) {
  const protectedRoutes = ['/', '/home', '/vote', '/dashboard', '/count-bph', '/count-senator'];

  return (
    <ChakraProvider theme={theme}>
      <AuthProvider>
        <PrivateRoute protectedRoutes={protectedRoutes}>
          <Component {...pageProps} />
        </PrivateRoute>
      </AuthProvider>
    </ChakraProvider>
  );
}

export default MyApp;
