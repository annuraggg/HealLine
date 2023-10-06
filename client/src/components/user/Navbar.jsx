import React from "react";
import {
  Box,
  Flex,
  Link,
  Menu,
  MenuButton,
  MenuItem,
  Avatar,
  MenuList,
  Heading,
  Button,
} from "@chakra-ui/react";

const Navbar = () => {
  return (
    <Box p="20px 50px" bg="gray.100">
      <Flex justifyContent="space-between">
        <Flex gap="20px" align="center">
          <Heading fontSize="20px" fontFamily="'Dancing Script', Cursive">
            {import.meta.env.VITE_APP_NAME}
          </Heading>
          <Link>Appointments</Link>
          <Button colorScheme="green" mr="20px">
            + Book a Appointment
          </Button>
        </Flex>
        <Box>
          <Menu>
            <MenuButton>
              <Avatar size="sm" />
            </MenuButton>
            <MenuList>
              <MenuItem>Settings</MenuItem>
              <MenuItem>Logout</MenuItem>
            </MenuList>
          </Menu>
        </Box>
      </Flex>
    </Box>
  );
};

export default Navbar;
