import { ChakraProvider } from "@chakra-ui/react";
import { AuthProvider } from "../contexts/auth";

import "../styles/globals.css";
import { theme } from "../styles/theme.js";

function MyApp({ Component, pageProps }) {
  return (
      <ChakraProvider theme={theme}>
        <AuthProvider>
          <Component {...pageProps} />
        </AuthProvider>
      </ChakraProvider>
  );
}

export default MyApp;
