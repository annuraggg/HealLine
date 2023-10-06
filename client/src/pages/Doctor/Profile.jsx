import React, { useEffect, useRef } from "react";
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
  Image,
} from "@chakra-ui/react";
import Star from "../../components/global/Star";
import Message from "./Message";
import Presc from "./Presc";
import Cookies from "js-cookie";
import jwt_decode from "jwt-decode";
import Twilio from "twilio-video";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const firstField = React.useRef();
  const [doctor, setDoctor] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [avg, setAvg] = React.useState(0);
  const [decoded, setDecoded] = React.useState({});
  const [update, setUpdate] = React.useState(false);
  const [time, setTime] = React.useState("");
  const [date, setDate] = React.useState("");

  const navigate = useNavigate();

  const {
    isOpen: isBookOpen,
    onOpen: onBookOpen,
    onClose: onBookClose,
  } = useDisclosure();

  useEffect(() => {
    if (!loading) {
      let sum = 0;
      doctor?.review?.map((review) => {
        sum += review.rating;
      });
      console.log(sum);
      setAvg(sum / doctor.review.length);
    }
  }, [doctor, loading]);

  useEffect(() => {
    try {
      const token = Cookies.get("token");
      const decoded = jwt_decode(token);
      setDecoded(decoded);
    } catch (error) {
      navigate("/auth");
    }
  }, []);

  const id = window.location.pathname.split("/")[3];
  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/users/doctor/${id}`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success == true) {
          setDoctor(data.doctor);
          setLoading(false);
        } else {
          console.log("error");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

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

  const goVideo = () => {
    onVideoOpen();
    startRoom();
  };

  const startRoom = async (event) => {
    const roomName = decoded.id;

    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_ADDRESS}/users/doctor/${id}/video`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ roomName: roomName }),
      }
    );
    const { token } = await response.json();
    const room = await joinVideoRoom(roomName, token);

    handleConnectedParticipant(room.localParticipant);
    room.participants.forEach(handleConnectedParticipant);
    room.on("participantConnected", handleConnectedParticipant);

    room.on("participantDisconnected", handleDisconnectedParticipant);
    window.addEventListener("pagehide", () => room.disconnect());
    window.addEventListener("beforeunload", () => room.disconnect());
  };

  const handleConnectedParticipant = (participant) => {
    const participantDiv = document.createElement("div");
    participantDiv.setAttribute("id", participant.identity);
    participantDiv.setAttribute("style", "border: 3px solid black;");
    document.getElementById("video-container").appendChild(participantDiv);
    participant.tracks.forEach((trackPublication) => {
      handleTrackPublication(trackPublication, participant);
    });

    participant.on("trackPublished", handleTrackPublication);
  };

  const handleTrackPublication = (trackPublication, participant) => {
    function displayTrack(track) {
      const participantDiv = document.getElementById(participant.identity);
      participantDiv.append(track.attach());
    }
    if (trackPublication.track) {
      displayTrack(trackPublication.track);
    }

    trackPublication.on("subscribed", displayTrack);
  };

  const handleDisconnectedParticipant = (participant) => {
    participant.removeAllListeners();
    const participantDiv = document.getElementById(participant.identity);
    participantDiv.remove();
  };

  const joinVideoRoom = async (roomName, token) => {
    const room = await Twilio.connect(token, {
      room: roomName,
    });
    return room;
  };

  const disconnectVideoRoom = () => {
    window.location.reload();
  };

  const consultancyTimes = [
    "10:00 AM",
    "10:30 AM",
    "11:00 AM",
    "11:30 AM",
    "12:00 PM",
    "12:30 PM",
    "01:00 PM",
    "01:30 PM",
    "02:00 PM",
    "02:30 PM",
    "03:00 PM",
    "03:30 PM",
    "04:00 PM",
    "04:30 PM",
    "05:00 PM",
    "05:30 PM",
    "06:00 PM",
    "06:30 PM",
    "07:00 PM",
    "07:30 PM",
  ];

  const bookSlot = () => {
    fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/users/doctor/${id}/book`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ date, time }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success == true) {
          onBookClose();
        } else {
          console.log("error");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return (
    <>
      <Box bg="gray.100" height="88vh" p="10px 50px">
        <Modal
          isOpen={isVideoOpen}
          onClose={onVideoClose}
          size="5xl"
          blockScrollOnMount={false}
        >
          <ModalOverlay backdropFilter="blur(10px) hue-rotate(90deg)" />
          <ModalContent>
            <ModalHeader>Video Call</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Box height="50vh">
                <Flex id="video-container" gap="20px"></Flex>
              </Box>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="red" mr={3} onClick={disconnectVideoRoom}>
                End
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
        <Flex gap="40px">
          {doctor.image !== "" ? (
            <Image
              height="250px"
              width="250px"
              src={doctor.image}
              objectFit="cover"
            ></Image>
          ) : (
            <Box bg="gray.300" height="250px" width="250px" />
          )}
          <Box width="60%">
            <Heading>
              {doctor.fname} {doctor.lname}
            </Heading>
            <Text mt="10px">{doctor.category}</Text>
            <Text mt="20px">{doctor.about}</Text>
            <Flex gap="10px" mt="20px">
              <Button colorScheme="green" size="sm" onClick={onBookOpen}>
                Book Call
              </Button>
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
            <Star rating={avg} fontSize={"35px"} />
            <Text fontSize="20px" fontWeight="bold" alignSelf="flex-end">
              ₹{doctor.fees}
            </Text>
          </Flex>
        </Flex>

        <Flex gap="20px" overflowX="auto">
          <Card mt="25px" minW="300px" height="300px">
            <CardBody>
              {doctor.review?.length > 0 ? (
                doctor?.review?.map((review, index) => {
                  return (
                    <Box key={index}>
                      <Star rating={review.rating} fontSize={"20px"} />
                      <Text fontSize="20px">{review.review}</Text>
                    </Box>
                  );
                })
              ) : (
                <Text>No Reviews Yet</Text>
              )}
            </CardBody>
          </Card>{" "}
          <Box>
          <FontAwesomeIcon  icon="fa-solid fa-pen" />
          </Box>
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

      <Modal
        isOpen={isBookOpen}
        onClose={onBookClose}
        size="5xl"
        blockScrollOnMount={false}
      >
        <ModalOverlay backdropFilter="blur(10px) hue-rotate(90deg)" />
        <ModalContent>
          <ModalHeader>Book Consultancy</ModalHeader>

          <ModalCloseButton />
          <ModalBody>
            <Flex justifyContent="center" direction="column" gap="20px">
              <Input type="date" placeholder="Select Date" mr="15px" value={date} onChange={(e) => setDate(e.target.value)}/>
              <Flex gap="10px" wrap="wrap">
                {consultancyTimes.map((hours, index) => {
                  return (
                    <Button
                      key={index}
                      colorScheme={hours === time ? "green" : "blue" }
                      size="sm"
                      onClick={() => setTime(hours)}
                      width="100px"
                    >
                      {hours}
                    </Button>
                  );
                })}
              </Flex>
            </Flex>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="green" mr={3} onClick={bookSlot}>
              Book Slot
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default Profile;
