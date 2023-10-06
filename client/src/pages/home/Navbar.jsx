import React, { useState, useEffect } from "react";
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
import logout from "../../components/logout";
import Cookies from 'js-cookie';

const Navbar = () => {
  const navigate = useNavigate();
  const [menu, setMenu] = useState(false);

  useEffect(() => {
    const token = Cookies.get('token');
    setMenu(!!token); // Set the menu state based on whether the token exists or not
  }, []);

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
          <Link onClick={() => navigate("/user")}>Consult</Link>
        </Flex>
        <Box>
          <Menu>
            <MenuButton>
              <Avatar size="sm" />
            </MenuButton>
            <MenuList>
              {menu ? (
                <>
                  <MenuItem>Profile</MenuItem>
                  <MenuItem>Dashboard</MenuItem>
                  <MenuItem>Settings</MenuItem>
                  <MenuItem onClick={() => logout()}>Logout</MenuItem>
                </>
              ) : (
                <MenuItem onClick={() => navigate("/auth")}>Login</MenuItem>
              )}
            </MenuList>
          </Menu>
        </Box>
      </Flex>
    </Box>
  );
};

export default Navbar;
