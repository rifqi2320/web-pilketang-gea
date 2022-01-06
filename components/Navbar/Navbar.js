import {
  Box,
  Flex,
  Text,
  HStack,
  Button,
  Spacer,
  IconButton,
  Image,
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
import { logout, useAuthDispatch, useAuthState } from "../../contexts/auth";

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

const MobileMenuItem = ({ children, to, onClick }) => {
  const handleClick = () => {
    if (!onClick) {
      handleRedirect(to);
    } else {
      onClick();
    }
  };

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
      onClick={handleClick}
    >
      <Text letterSpacing="1px" justifyContent="center">
        {children}
      </Text>
    </Box>
  );
};

const Navbar = ({ children, ...props }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { user } = useAuthState();
  const dispatch = useAuthDispatch();

  const handleLogout = () => {
    logout(dispatch);
  };

  return (
    <>
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
        borderBottomColor="#fb6500"
        borderBottomWidth={1}
        {...props}
      >
        {/* <Logo pl={4} pr={4} alignItems="center" display="flex" /> */}
        <Flex alignItems="center" height="full">
          <Image src="/images/hmtg_gea.png" boxSize="60px" mr={8} ml={1} userSelect="none" />
        </Flex>
        <HStack
          spacing="0"
          color="white"
          m={0}
          height="100%"
          display={["none", "none", "flex", "flex"]}
        >
          <DesktopMenuItem to="/dashboard">Dashboard</DesktopMenuItem>
          <DesktopMenuItem to="/count-bph">Hasil Counting</DesktopMenuItem>
          {user === "admin" ? (
            <DesktopMenuItem to="/admin/dashboard">Dashboard Admin</DesktopMenuItem>
          ) : null}
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
          <Text>{user}</Text>
          <Button size="sm" colorScheme="gray" textColor="orange" onClick={handleLogout}>
            Logout
          </Button>
        </HStack>
        <Flex justifyContent="center" alignItems="center" display="flex" height="full">
          <IconButton
            variant="ghost"
            mr={2}
            _hover={{ bg: "none" }}
            _active={{ bg: "none" }}
            icon={<HamburgerIcon w={6} h={6} />}
            display={["flex", "flex", "none", "none"]}
            onClick={onOpen}
          />
        </Flex>
        <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="xs">
          <DrawerOverlay />
          <DrawerContent bg="#FF7315" textColor="white">
            <DrawerCloseButton />
            <DrawerHeader bg="#F58539" textAlign="center">
              {user}
            </DrawerHeader>
            <DrawerBody>
              <MobileMenuItem to="/dashboard">Dashboard</MobileMenuItem>
              <MobileMenuItem to="/count-bph">Hasil Counting</MobileMenuItem>
              {user === "admin" ? (
                <MobileMenuItem to="/admin/dashboard">Dashboard Admin</MobileMenuItem>
              ) : null}
              <MobileMenuItem to="/login" onClick={handleLogout}>
                Logout
              </MobileMenuItem>
            </DrawerBody>
            <Spacer />
            <Text p={4} textAlign="center" fontWeight="semibold">
              Pemilu HMTG "GEA" 2021
            </Text>
          </DrawerContent>
        </Drawer>
      </Flex>
      {children}
    </>
  );
};

export default Navbar;
