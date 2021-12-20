import { Flex } from "@chakra-ui/react"

import styles from "./Background.module.css";

const Background = ({children, ...props}) => {
  return (
    <Flex {...props} className={styles.bg} w="full">
      {children}
    </Flex>
  )
}

export default Background
