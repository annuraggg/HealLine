import React, { useEffect } from "react";
import Navbar from "../../../components/user/Navbar";
import {
  Box,
  Flex,
  Heading,
  Skeleton,
  Text,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  IconButton,
  useDisclosure,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerOverlay,
  DrawerHeader,
  DrawerFooter,
  Button,
  Input,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import Star from "../../../components/user/global/Star";
import Message from "./Message";
import Presc from "./Presc";
import Video from "./Video";
const Doctor = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const firstField = React.useRef();

  const {
    isOpen: isPrescOpen,
    onOpen: onPrescOpen,
    onClose: onPrescClose,
  } = useDisclosure();

  const {
    isOpen: isVideoOpen,
    onOpen: onVideoOpen,
    onClose: onVideoClose,
  } = useDisclosure();

  return (
    <>
      <Navbar />
      <Box bg="gray.100" height="88vh" p="10px 50px">
        <Flex gap="40px">
          <Skeleton height="250px" width="250px"></Skeleton>
          <Box width="60%">
            <Heading>Doctor Name</Heading>
            <Text mt="10px">Orthopedic</Text>
            <Text mt="20px">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Optio
              natus incidunt expedita, porro dolore eligendi dolor, voluptate
              nesciunt quos vel suscipit sunt necessitatibus, inventore maiores
              explicabo totam. Rem, quia neque. Doloremque, quisquam consequatur
              magnam aliquam id, dolor cumque totam unde nemo eaque sapiente qui
              quo doloribus, quae explicabo! Aliquam praesentium omnis nihil?
              Hic tempora, quia dolorum corrupti veniam a dolores.
            </Text>
            <Flex gap="10px" mt="20px">
              <IconButton
                aria-label="Search database"
                icon={<i className="fa-solid fa-video" />}
                colorScheme="blue"
                size="sm"
                onClick={onVideoOpen}
              />
              <IconButton
                aria-label="Search database"
                icon={<i className="fa-solid fa-message"></i>}
                colorScheme="blue"
                size="sm"
                onClick={onOpen}
              />{" "}
              <IconButton
                aria-label="Search database"
                icon={<i className="fa-solid fa-file-prescription" />}
                colorScheme="blue"
                size="sm"
                onClick={onPrescOpen}
              />
            </Flex>
          </Box>
          <Flex mt={"5px"} direction="column" gap="20px">
            <Star rating="2.5" fontSize={"35px"} />
            <Text fontSize="20px" fontWeight="bold" alignSelf="flex-end">₹5000</Text>
          </Flex>
        </Flex>

        <Flex gap="20px" overflowX="auto">
          <Card mt="25px" minW="300px" height="300px">
            <CardBody>
              <Text>
                View a summary of all your customers over the last month.
              </Text>
            </CardBody>
          </Card>{" "}
          <Card mt="25px" minW="300px" height="300px">
            <CardBody>
              <Text>
                View a summary of all your customers over the last month.
              </Text>
            </CardBody>
          </Card>{" "}
          <Card mt="25px" minW="300px" height="300px">
            <CardBody>
              <Text>
                View a summary of all your customers over the last month.
              </Text>
            </CardBody>
          </Card>{" "}
          <Card mt="25px" minW="300px" height="300px">
            <CardBody>
              <Text>
                View a summary of all your customers over the last month.
              </Text>
            </CardBody>
          </Card>{" "}
          <Card mt="25px" minW="300px" height="300px">
            <CardBody>
              <Text>
                View a summary of all your customers over the last month.
              </Text>
            </CardBody>
          </Card>{" "}
          <Card mt="25px" minW="300px" height="300px">
            <CardBody>
              <Text>
                View a summary of all your customers over the last month.
              </Text>
            </CardBody>
          </Card>
        </Flex>
      </Box>
      <Drawer
        isOpen={isOpen}
        placement="right"
        initialFocusRef={firstField}
        onClose={onClose}
        size="md"
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth="1px">Chat</DrawerHeader>

          <Message />

          <DrawerFooter borderTopWidth="1px">
            <Input placeholder="Enter a Chat to Send" mr="15px" />
            <IconButton
              aria-label="Search database"
              icon={<i className="fa-solid fa-paper-plane" />}
              colorScheme="blue"
              size="sm"
            />
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
      <Drawer
        isOpen={isPrescOpen}
        placement="right"
        initialFocusRef={firstField}
        onClose={onPrescClose}
        size="md"
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth="1px">Prescriptions</DrawerHeader>

          <Presc />

          <DrawerFooter borderTopWidth="1px"></DrawerFooter>
        </DrawerContent>
      </Drawer>
      <Modal isOpen={isVideoOpen} onClose={onVideoClose} size="5xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Video Call</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Video />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default Doctor;
