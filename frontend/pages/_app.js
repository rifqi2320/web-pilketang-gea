import { ChakraProvider } from "@chakra-ui/react"

import "../styles/globals.css"
import { theme } from "../styles/theme.js"

function MyApp({ Component, pageProps }) {
    return (
        <ChakraProvider theme={theme}>
            <Component {...pageProps} />
        </ChakraProvider>
    )
}

export default MyApp
