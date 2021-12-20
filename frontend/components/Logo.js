import { Box, Text } from "@chakra-ui/react";

const Logo = (props) => {
  return (
    <Box {...props} height="100%">
      <Text
        fontSize="xl"
        fontWeight="bold"
        letterSpacing="4px"
        userSelect="none"
        textAlign="center"
      >
        HMTG GEA
      </Text>
    </Box>
  );
};

export default Logo;
