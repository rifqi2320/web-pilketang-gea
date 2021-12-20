import { Button, Container, Flex, Text, VStack, Box, Heading } from "@chakra-ui/react";
import Router from "next/router";
import Background from "../components/Background/Background";
import Navbar from "../components/Navbar/Navbar";

const Vote = () => {
  const handleClick = () => {
    Router.push("/photo");
  };

  return (
    <>
      <Navbar />
      <Background justifyContent="center">
        <Flex>
          <Box
            w={["80vw", "80vw", "80vw", "60vw"]}
            bg="#f4f4f4"
            mt={24}
            mb={12}
            p={0}
            borderWidth="1px"
            borderRadius={8}
            boxShadow="lg"
          >
            <VStack display="flex">
                <Heading justifyContent="center" mt={4}>
                  Pemilu HMTG GEA 2021
                </Heading>
              <Container>
                <Text>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus in quam augue.
                  Aliquam euismod, dui sed cursus ullamcorper, felis velit tempor mi, a consectetur
                  sem nisi id justo. Donec nec elit eu odio sagittis consequat nec sit amet quam.
                  Donec imperdiet gravida massa, eu condimentum odio sagittis eget. Vivamus egestas
                  cursus diam, non rutrum ante placerat at. In hac habitasse platea dictumst. Sed
                  tempor, nisi non porttitor dictum, nisi nisl ultrices ante, id dignissim lacus
                  sapien lacinia mauris. Duis nec mauris finibus, laoreet lacus in, maximus purus.
                  Nullam vitae enim eget odio ultrices fringilla. Nunc rutrum ornare scelerisque.
                  Sed leo sem, consequat ac massa sed, iaculis tincidunt turpis. Pellentesque
                  habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.
                  Pellentesque sed malesuada ligula. Cras in ex tincidunt, imperdiet metus et,
                  egestas sem. Maecenas laoreet magna nisl. Fusce quis rhoncus diam, ut hendrerit
                  justo. Sed pharetra augue augue, ut sagittis quam feugiat eget. Nam nisl ex,
                  semper ut convallis sed, fringilla in sapien. Ut egestas magna a leo egestas
                  blandit. Phasellus vitae odio vitae eros iaculis iaculis id quis mi. Nunc sodales
                  libero sed nunc sodales ultricies. Praesent vitae felis sagittis, dapibus dui
                  vulputate, vestibulum libero. Maecenas commodo nunc vel libero tristique, et
                  convallis magna hendrerit. Maecenas mi libero, luctus tempor dolor vel,
                  consectetur elementum justo. Vivamus faucibus varius viverra.
                  jkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk
                </Text>
              </Container>
              <Button onClick={handleClick}>Vote</Button>
            </VStack>
          </Box>
        </Flex>
      </Background>
    </>
  );
};

export default Vote;
