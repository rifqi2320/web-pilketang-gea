import { Flex, Spinner } from "@chakra-ui/react";

const FullPageLoader = () => {
  return (
    <Flex zIndex={100} width="100vw" height="100vh" justifyContent="center" alignItems="center">
      <Spinner color="orange" size="xl" />
    </Flex>
  );
};

export default FullPageLoader;
