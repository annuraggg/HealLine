import React, { useEffect, useState } from "react";
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
  Image,
} from "@chakra-ui/react";
import Star from "../../../components/global/Star";
import Message from "./Message";
import Presc from "./Presc";
import Cookies from "js-cookie";
import jwt_decode from "jwt-decode";
import Twilio from "twilio-video";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Doctor = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const firstField = React.useRef();
  const [doctor, setDoctor] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [avg, setAvg] = React.useState(0);
  const [decoded, setDecoded] = React.useState({});
  const [update, setUpdate] = React.useState(false);
  const [time, setTime] = React.useState("");
  const [date, setDate] = React.useState("");
  const [appointmentId, setAppointmentId] = useState([]);
  const [showPay, setShowPay] = useState(false);

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

  useEffect(() => {
    if (appointmentId?.status === "approved") {
      setShowPay(true);
    } else {
      setShowPay(false);
    }
  }, [appointmentId]);

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
          setAppointmentId(data.appointment);
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
    const roomName = appointmentId._id;

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

  const checkoutHandler = async (amount) => {
    try {
      const {
        data: { key },
      } = await axios.get(`http://localhost:3000/api/v1/getKey`);
      const {
        data: { order },
      } = await axios.post(`http://localhost:3000/api/v1/checkout`, {
        amount,
      });
      const options = {
        key: key,
        amount: order.amount,
        currency: "INR",
        name: "Bharat Sharma",
        description: "Test Transaction",
        image: "https://avatars.githubusercontent.com/u/97161064?v=4",
        order_id: order.id,
        callback_url: `http://localhost:3000/api/v1/paymentVerification`,
        prefill: {
          name: "Bharat Sharma",
          email: "bharat.sharma@gmail.com",
          contact: "9555726438",
        },
        notes: {
          address: "Razorpay Corporate Office",
        },
        theme: {
          color: "#3399cc",
        },
      };
      const razor = new window.Razorpay(options);
      razor.open();
    } catch (error) {
      console.error("Error:", error);
    }
  };

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
  };

  console.log(appointmentId);

  const today = new Date().toISOString();
  return (
    <>
      <Navbar />
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
              borderRadius="20px"
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
              {!appointmentId ? (
                <Button
                  colorScheme="green"
                  onClick={() => {
                    onBookOpen();
                  }}
                >
                  Book Appointment
                </Button>
              ) : (
                <IconButton
                  onClick={goVideo}
                  icon={<i className="fa-solid fa-video" />}
                  colorScheme="blue"
                  size="sm"
                />
              )}

              <IconButton
                aria-label="Search database"
                icon={<i className="fa-solid fa-message"></i>}
                colorScheme="blue"
                size="sm"
                onClick={onOpen}
              />
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
              ₹{doctor.fees}{" "}
            </Text>
            {appointmentId?.status === "approved" ? (
              <Button
                colorScheme="green"
                onClick={() => {
                  checkoutHandler(doctor.fees);
                }}
              >
                Pay
              </Button>
            ) : (
              <Button />
            )}
          </Flex>
        </Flex>

        <Flex gap="20px" overflowX="auto">
          {doctor.review?.length > 0 ? (
            doctor?.review?.map((review, index) => {
              return (
                <Card
                  mt="25px"
                  minW="300px"
                  maxW="300px"
                  height="350px"
                  borderRadius="25px"
                  key={index}
                  bg="gray.300"
                >
                  <CardBody>
                    <Flex direction="column" align="center" p="5px">
                      <Star rating={review.rating} fontSize={"30px"} />
                      <Text fontSize="20px" mt="30px">
                        {review.review}
                      </Text>
                    </Flex>
                  </CardBody>
                </Card>
              );
            })
          ) : (
            <Text>No Reviews Yet</Text>
          )}
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
              <Input
                type="date"
                placeholder="Select Date"
                mr="15px"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
              <Flex gap="10px" wrap="wrap">
                {consultancyTimes.map((hours, index) => {
                  return (
                    <Button
                      key={index}
                      colorScheme={hours === time ? "green" : "blue"}
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

export default Doctor;
