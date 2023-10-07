import React, { useState, useEffect } from "react";
import Navbar from "../../components/doctor/Navbar";
import {
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  Box,
  Link,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  AlertDialogCloseButton,
  Button,
  useDisclosure,
} from "@chakra-ui/react";
import jwtDecode from "jwt-decode";
import Cookies from "js-cookie";

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [user, setUser] = useState(null);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef();

  const [selectedAppointment, setSelectedAppointment] = useState(null);

  function formatDate(inputDateStr) {
    const date = new Date(inputDateStr);

    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Month is zero-based
    const year = date.getFullYear().toString().slice(-2);
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");

    return `${day}-${month}-${year} ${hours}:${minutes}`;
  }

  useEffect(() => {
    const token = Cookies.get("token");
    try {
      const decoded = jwtDecode(token);
      setUser(decoded);
    } catch (err) {
      console.log(err);
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/doctors/appointments`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: user.id }),
      })
        .then((res) => res.json())
        .then((data) => {
          setAppointments(data.appointments);
          console.log(data.appointments);
        }),
        (err) => console.log(err);
    }
  }, [user]);

  useEffect(() => {
    if (appointments.length > 0) {
      appointments.sort((a, b) => {
        if (a.status === "pending" && b.status !== "pending") {
          return -1; // "a" comes before "b" (move "pending" to the top)
        } else if (a.status !== "pending" && b.status === "pending") {
          return 1; // "b" comes before "a" (move "pending" to the top)
        } else {
          return a.status.localeCompare(b.status); // Sort other statuses alphabetically
        }
      });
    }
  }, [appointments]);

  const openAlert = (ap) => {
    setSelectedAppointment(ap);
    onOpen();
  };

  const accept = () => {
    fetch(
      `${import.meta.env.VITE_BACKEND_ADDRESS}/doctors/appointments/${
        selectedAppointment._id
      }/accept`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(selectedAppointment),
      }
    )
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        onClose();
      }),
      (err) => console.log(err);
  };

  const reject = () => {
    fetch(
      `${import.meta.env.VITE_BACKEND_ADDRESS}/doctors/appointments/${
        selectedAppointment._id
      }/reject`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(selectedAppointment),
      }
    )
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        onClose();
      }),
      (err) => console.log(err);
  };

  return (
    <>
      <Navbar />
      <Box p="10px 50px" bg="gray.100" height="90vh" overflowY="auto">
        <TableContainer>
          <Table variant="striped">
            <Thead>
              <Tr>
                <Th>Patient Name</Th>
                <Th>Schedule</Th>
                <Th>Status</Th>
                <Th></Th>
              </Tr>
            </Thead>
            <Tbody>
              {appointments.map((appointment) => (
                <Tr key={appointment._id}>
                  <Td>{appointment.patientName}</Td>
                  <Td>{formatDate(appointment.date)}</Td>
                  <Td>{appointment.status}</Td>
                  <Td>
                    <Link onClick={() => openAlert(appointment)}>View</Link>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      </Box>

      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold" ref={cancelRef}>
              Appointment
            </AlertDialogHeader>
            <AlertDialogCloseButton />

            <AlertDialogBody>
              Description: {selectedAppointment?.desc}
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button colorScheme="red" onClick={reject}>
                Reject
              </Button>
              <Button colorScheme="green" onClick={accept} ml={3}>
                Accept
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};

export default Appointments;
