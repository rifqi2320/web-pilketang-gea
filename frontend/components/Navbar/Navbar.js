import {
  Box,
  Flex,
  Text,
  HStack,
  Button,
  Spacer,
  IconButton,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  useDisclosure,
  DrawerCloseButton,
} from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";
import Router from "next/router";

import Logo from "../Logo";

const handleRedirect = (dest) => {
  Router.push(dest);
};

const DesktopMenuItem = ({ children, to }) => {
  return (
    <Box
      as="button"
      height="100%"
      transition="all 0.3s cubic-bezier(0,.86,.45,.95)"
      fontSize="16px"
      bg="#FF7315"
      color="white"
      _hover={{ bg: "#E25B00" }}
      pl={6}
      pr={6}
      onClick={() => {
        handleRedirect(to);
      }}
    >
      <Text letterSpacing="0.5px" justifyContent="center">
        {children}
      </Text>
    </Box>
  );
};

const MobileMenuItem = ({ children, to }) => {
  return (
    <Box
      as="button"
      width="100%"
      transition="all 0.3s cubic-bezier(0,.86,.45,.95)"
      fontSize="18px"
      bg="#FF7315"
      color="white"
      p={4}
      _hover={{ bg: "#E25B00" }}
      onClick={() => {
        handleRedirect(to);
      }}
    >
      <Text letterSpacing="1px" justifyContent="center">
        {children}
      </Text>
    </Box>
  );
};

const Navbar = ({ children, ...props }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Flex
      as="header"
      w="100%"
      as="nav"
      position="fixed"
      alignItems="flex-end"
      justify="space-between"
      wrap="wrap"
      bg="#FF7315"
      color="white"
      height={16}
      zIndex={50}
      {...props}
    >
      <Logo pl={4} pr={4} alignItems="center" display="flex"/>
      <HStack
        spacing="0"
        color="white"
        m={0}
        height="100%"
        display={["none", "none", "flex", "flex"]}
      >
        <DesktopMenuItem to="/home">Dashboard</DesktopMenuItem>
        <DesktopMenuItem to="/vote-dashboard" id="votenow">
          Vote Now
        </DesktopMenuItem>
      </HStack>
      <Spacer display={["none", "none", "flex", "flex"]} />
      <HStack
        mr={4}
        mt={0}
        mb={0}
        spacing={4}
        height="100%"
        display={["none", "none", "flex", "flex"]}
      >
        <Text>12020000 - John Doe</Text>
        <Button size="sm" colorScheme="gray" textColor="orange" outline="none" onClick={() => {handleRedirect("/login")}}>
          Logout
        </Button>
      </HStack>
      <Flex justifyContent="center" alignItems="center" display="flex" height="full">
        <IconButton
          variant="ghost"
          mr={2}
          _hover={{ bg: "none" }}
          _active={{ bg: "none" }}
          icon={<HamburgerIcon w={6} h={6}/>}
          display={["flex", "flex", "none", "none"]}
          onClick={onOpen}
        />
      </Flex>
      <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="xs">
        <DrawerOverlay />
        <DrawerContent bg="#FF7315" textColor="white">
          <DrawerCloseButton />
          <DrawerHeader>12020000 - John Doe</DrawerHeader>
          <DrawerBody>
            <MobileMenuItem to="/home">Dashboard</MobileMenuItem>
            <MobileMenuItem to="/vote-dashboard">Vote</MobileMenuItem>
            <MobileMenuItem to="/login">Logout</MobileMenuItem>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Flex>
  );
};

export default Navbar;
