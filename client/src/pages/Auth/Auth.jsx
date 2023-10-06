import React, { useState } from "react";
import {
  Box,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Flex,
  Input,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Link,
} from "@chakra-ui/react";

const Auth = () => {
  const [register, setRegister] = useState(false);

  if (!register) {
    return (
      <Flex
        align="center"
        justify="center"
        height="100vh"
        direction="column"
        gap="20px"
        bg="#FDFDFF"
      >
        <Flex
          align="center"
          justify="center"
          direction="column"
          gap="20px"
          padding="50px"
          borderRadius="20px"
          bg="#FEFFFE"
          border="1px solid #F5F7FF"
        >
          <Heading>Welcome to {import.meta.env.VITE_APP_NAME}</Heading>
          <Flex gap="20px" direction="column">
            <FormControl>
              <Input placeholder="Enter Your Username"></Input>
            </FormControl>
            <FormControl>
              <Input placeholder="Enter Your Password" tyoe="password"></Input>
            </FormControl>
            <Flex direction="column" gap="10px" align="center" width="20vw">
              <Button width="20vw" colorScheme="purple" bg="#6D49FA">
                Login
              </Button>
              <Link onClick={() => setRegister(true)}>
                Or Create a New Account
              </Link>
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    );
  } else {
    return (
      <Flex
        align="center"
        justify="center"
        height="100vh"
        direction="column"
        gap="20px"
        bg="#FDFDFF"
      >
        <Flex
          align="center"
          justify="center"
          direction="column"
          gap="20px"
          padding="50px"
          borderRadius="20px"
          bg="#FEFFFE"
          border="1px solid #F5F7FF"
        >
          <Heading>Welcome to {import.meta.env.VITE_APP_NAME}</Heading>
          <Tabs variant="soft-rounded" colorScheme="green">
            <TabList>
              <Tab>Signup as User</Tab>
              <Tab>Signup as Doctor</Tab>
            </TabList>
            <TabPanels mt="20px">
              <TabPanel>
                <Flex direction="column" gap="20px">
                  <Flex gap="20px">
                    <Input placeholder="First Name" />
                    <Input placeholder="Last Name" />
                  </Flex>
                  <Input placeholder="Email" />
                  <Input placeholder="Phone" />
                  <Flex gap="20px">
                    <Input placeholder="Password" />
                    <Input placeholder="Confirm Password" />
                  </Flex>
                </Flex>
                <Button mt="20px" float="right" colorScheme="green">
                  Signup
                </Button>
              </TabPanel>
              <TabPanel>
                <Flex direction="column" gap="20px">
                  <Flex gap="20px">
                    <Input placeholder="First Name" />
                    <Input placeholder="Last Name" />
                  </Flex>
                  <Input placeholder="Email" />
                  <Input placeholder="Phone" />
                  <Flex gap="20px">
                    <Input placeholder="Password" />
                    <Input placeholder="Confirm Password" />
                  </Flex>
                </Flex>
                <Button mt="20px" float="right" colorScheme="green">
                  Signup
                </Button>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Flex>
      </Flex>
    );
  }
};

export default Auth;
