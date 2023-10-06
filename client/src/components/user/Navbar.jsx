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

import { useNavigate } from "react-router-dom";
import logout from "../logout";

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <Box p="20px 50px" bg="gray.100">
      <Flex justifyContent="space-between">
        <Flex gap="20px" align="center">
          <Heading
            fontSize="20px"
            fontFamily="'Dancing Script', Cursive"
            cursor="pointer"
            onClick={() => navigate("/user")}
          >
            {import.meta.env.VITE_APP_NAME}
          </Heading>
          <Link onClick={() => navigate("/user/appointments")}>Appointments</Link>
        </Flex>
        <Box>
          <Menu>
            <MenuButton>
              <Avatar size="sm" />
            </MenuButton>
            <MenuList>
              <MenuItem>Settings</MenuItem>
              <MenuItem onClick={() => logout()}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </Box>
      </Flex>
    </Box>
  );
};

export default Navbar;
