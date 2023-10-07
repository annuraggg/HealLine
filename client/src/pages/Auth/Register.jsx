import React, { useEffect, useState } from "react";
import {
  Flex,
  Heading,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Input,
  InputGroup,
  InputRightAddon,
  Button,
  PinInput,
  PinInputField,
  HStack,
  useToast,
  Link
} from "@chakra-ui/react";
import emailjs from "@emailjs/browser";


// 







// 
const Register = ({register}) => {
  const [doctorProfile, setDoctorProfile] = useState({
    name: '',
    specialty: '',
    contact: '',
    bio: '',
  });
  
  const toast = useToast();
  const [fName, setFName] = useState("");
  const [lName, setLName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [emailLoading, setEmailLoading] = useState(false);
  const [showOtpField, setShowOtpField] = useState(false);

  const [disableSignup, setDisableSignup] = useState(true);

  const [sendOTPBtnDisable, setSendOTPBtnDisable] = useState(false);

  const [storedOTP, setStoredOTP] = useState(
    Math.floor(100000 + Math.random() * 900000)
  );

  const [verified, setVerified] = useState(false);

  const [otp, setOtp] = useState("");
  const [role, setRole] = useState("U");

  const sendOTP = () => {
    setEmailLoading(true);
 
    emailjs
      .send(
        "service_75zs06n",
        "template_8x7mvjo",
        {
          to: email,
          otp: storedOTP,
        },
        import.meta.env.VITE_EMAILJS_KEY
      )
      .then((res) => {
        setEmailLoading(false);
        if (res.status === 200) {
          setShowOtpField(true);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const verifyOTP = () => {
    console.log(otp);
    console.log(storedOTP);
    if (otp == storedOTP) {
      toast({
        title: "OTP verified",
        description: "OTP has been verified successfully",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      setShowOtpField(false);
      setSendOTPBtnDisable(true);
      setVerified(true);
    } else {
      toast({
        title: "Wrong OTP",
        description: "OTP is incorrect",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    if (
      fName &&
      lName &&
      email &&
      phone &&
      password &&
      confirmPassword &&
      verified
    ) {
      setDisableSignup(false);
    } else {
      setDisableSignup(true);
    }
  }, [fName, lName, email, phone, password, confirmPassword, verified]);

    const signup = () => {
        if (password === confirmPassword) {
            fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/auth/register`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                fName,
                lName,
                email,
                phone,
                password,
                role,
            }),
            })
            .then(async (res) => await res.json())
            .then((response) => {
                if (response.success === true) {
                toast({
                    title: "Account created",
                    description: "Account has been created successfully",
                    status: "success",
                    duration: 5000,
                    isClosable: true,
                });
                register();
                } else {
                toast({
                    title: "Account not created",
                    description: "Account has not been created successfully",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                });
                }
            })
            .catch((e) => {
                console.log(e);
            });
        } else {
            toast({
            title: "Password mismatch",
            description: "Password and confirm password do not match",
            status: "error",
            duration: 5000,
            isClosable: true,
            });
        }
        }

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
        <Heading fontFamily='"Dancing Script", Cursive' fontSize="35px">Welcome to {import.meta.env.VITE_APP_NAME}</Heading>

        <Tabs variant="soft-rounded" colorScheme="green">
          <TabList>
            <Tab onClick={() => setRole('U')}>User</Tab>
            <Tab onClick={() => setRole('D')}>Doctor</Tab>
          </TabList>
          <TabPanels></TabPanels>
        </Tabs>

        <Flex direction="column" gap="20px">
          <Flex gap="20px">
            <Input
              placeholder="First Name"
              value={fName}
              onChange={(e) => setFName(e.target.value)}
            />
            <Input
              placeholder="Last Name"
              value={lName}
              onChange={(e) => setLName(e.target.value)}
            />
          </Flex>
          <InputGroup>
            <Input
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              isDisabled={sendOTPBtnDisable}
            />

            <InputRightAddon bg="green.500">
              <Button
                colorScheme="green"
                size="sm"
                onClick={sendOTP}
                isLoading={emailLoading}
                isDisabled={sendOTPBtnDisable}
              >
                Send OTP
              </Button>
            </InputRightAddon>
          </InputGroup>

          {showOtpField ? (
            <InputGroup>
              <HStack>
                <PinInput value={otp} onChange={(e) => setOtp(e)}>
                  <PinInputField width="52px" />
                  <PinInputField width="52px" />
                  <PinInputField width="52px" />
                  <PinInputField width="52px" />
                  <PinInputField width="52px" />
                  <PinInputField width="52px" />
                </PinInput>
              </HStack>

              <InputRightAddon bg="green.500">
                <Button colorScheme="green" size="sm" onClick={verifyOTP}>
                  Verify
                </Button>
              </InputRightAddon>
            </InputGroup>
          ) : null}

          <Input
            placeholder="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <Flex gap="20px">
            <Input
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Input
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </Flex>
        </Flex>
        <Button
          mt="20px"
          float="right"
          colorScheme="green"
          isDisabled={disableSignup}
          onClick={signup}
        >
          Signup
        </Button>
        <Link onClick={() => register()}>Sign In Instead</Link>
      </Flex>
    </Flex>
  );
};

export default Register;
