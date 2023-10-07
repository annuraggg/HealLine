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
  InputGroup,
  InputRightAddon,
  InputRightElement,
  useToast
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import Register from "./Register";
import emailjs from "@emailjs/browser";

const Auth = () => {
  const [register, setRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [buttonLoading, setButtonLoading] = useState(false);

  const toast = useToast();

  const registerFunc = () => {
    setRegister(false);
  }

  const navigate = useNavigate();

  const login = () => {
    setButtonLoading(true);
    console.log(email);
    fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/auth`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    })
      .then(async (res) => await res.json())
      .then((response) => {
        setButtonLoading(false);
        if (response.success === true) {
          if (response.role === "D") {
            navigate("/doctor");
          } else if (response.role === "U") {
            navigate("/user");
          } else {
            toast({
              title: "Error",
              description: "Wrong email or password",
              status: "error",
              duration: 5000,
              isClosable: true,
            });
          }
        }
      })
      .catch((e) => {
        setButtonLoading(false);
        toast({
          title: "Error",
          description: "Wrong email or password",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      });
  };

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
          <Heading
            fontFamily="Dancing Script; cursive"
            fontSize="40px"
            mb="20px"
          >
            Welcome to {import.meta.env.VITE_APP_NAME}
          </Heading>
          <Flex gap="20px" direction="column">
            <FormControl>
              <InputGroup>
                <Input
                  placeholder="Enter Your Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                ></Input>
              </InputGroup>
            </FormControl>
            <FormControl>
              <Input
                placeholder="Enter Your Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              ></Input>
            </FormControl>
            <Flex direction="column" gap="10px" align="center" width="20vw">
              <Button
                width="20vw"
                colorScheme="purple"
                bg="#6D49FA"
                onClick={login}
                isLoading={buttonLoading}
              >
                Login
              </Button>
              <Link onClick={() => setRegister(true)} mt="10px" alignSelf="flex-end">
                Register?
              </Link>
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    );
  } else {
    return <Register register={registerFunc} />;
  }
};

export default Auth;
