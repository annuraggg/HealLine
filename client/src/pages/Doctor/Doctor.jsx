import React, { useEffect, useState } from "react";
import Navbar from "../../components/doctor/Navbar";
import {
  Box,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
  Flex,
  Text,
} from "@chakra-ui/react";
import jwtDecode from "jwt-decode";
import Cookies from "js-cookie";
import Twilio from "twilio-video";
import { useToast } from "@chakra-ui/react";

const Doctor = () => {
  const toast = useToast();
  const date = new Date();
  const [appointments, setAppointments] = useState([]);
  const [decoded, setDecoded] = useState(null);
  const [loading, setLoading] = useState(true);
  const [todayAppointments, setTodayAppointments] = useState([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);

  
  useEffect(() => {
    const token = Cookies.get("token");
    try {
      const decoded = jwtDecode(token);
      setDecoded(decoded);
    } catch (err) {
      console.log(err);
    }
  }, []);

  useEffect(() => {
    if (decoded) {
      console.log(decoded.id)
      fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/doctors/appointments/`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: decoded.id }),
      })
        .then((res) => res.json())
        .then((data) => {
          setAppointments(data.appointments);
          console.log(data.appointments);
        }),
        (err) => console.log(err);
    }
  }, [decoded]);



  const {
    isOpen: isVideoOpen,
    onOpen: onVideoOpen,
    onClose: onVideoClose,
  } = useDisclosure();

  const goVideo = (id) => {
    onVideoOpen();
    startRoom(id);
  };

  const startRoom = async (id) => {
    const roomName = id;
    console.log(roomName);

    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_ADDRESS}/users/doctor/${
        decoded.id
      }/video`,
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


  useEffect(() => {
    if (appointments) {
      setTodayAppointments(
        appointments.filter((appointment) => {
          const appointmentDate = new Date(appointment.date);
          return (
            appointmentDate.getDate() === date.getDate() &&
            appointmentDate.getMonth() === date.getMonth() &&
            appointmentDate.getFullYear() === date.getFullYear()
          );
        })
      );
      setUpcomingAppointments(
        appointments.filter((appointment) => {
          const appointmentDate = new Date(appointment.date);
          return (
            appointmentDate.getDate() > date.getDate() ||
            appointmentDate.getMonth() > date.getMonth() ||
            appointmentDate.getFullYear() > date.getFullYear()
          );
        })
      );

      setLoading(false);
    }

    console.log(todayAppointments);
  }, [appointments]);

  if (!loading) {
    return (
      <>
        <Navbar />
        <Box bg="gray.100" height="90vh" p="10px 50px">
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
          <Box
            bg="green.100"
            height="45vh"
            overflowY="auto"
            borderRadius="15px"
            p="20px"
          >
            <Box>
              <Text fontWeight="bold">Today's Appointments</Text>
              <Box>
                <Table>
                  <Thead>
                    <Tr>
                      <Td>Patient Name</Td>
                      <Td>Schedule</Td>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {todayAppointments.map((appointment) => (
                      <Tr key={appointment._id}>
                        <Td>{appointment.patientName}</Td>
                        <Td>{appointment.date}</Td>
                        <Td>
                          <Button
                            colorScheme="green"
                            size="sm"
                            onClick={() => goVideo(appointment._id)}
                          >
                            Video Call
                          </Button>
                          <Button colorScheme="red" ml="20px">
                            Cancel Appointment
                          </Button>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </Box>
            </Box>
          </Box>
          <Box
            bg="blue.100"
            height="35vh"
            borderRadius="15px"
            overflowY="auto"
            mt="20px"
            p="20px"
          >
            <Box>
              <Text fontWeight="bold">Upcoming Appointments</Text>
              <Box>
                <Table>
                  <Thead>
                    <Tr>
                      <Td>Patient Name</Td>
                      <Td>Schedule</Td>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {upcomingAppointments.map((appointment) => (
                      <Tr key={appointment._id}>
                        <Td>{appointment.patientName}</Td>
                        <Td>{appointment.date}</Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </Box>
            </Box>
          </Box>
        </Box>
      </>
    );
  }
};

export default Doctor;
