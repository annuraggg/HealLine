import React, { useEffect, useState } from "react";
import Navbar from "../../../components/user/Navbar";
import {
  Box,
  Divider,
  Heading,
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import jwtDecode from "jwt-decode";
import Cookies from "js-cookie";

const Appointments = () => {
  const [user, setUser] = useState(null);
  const [appointments, setAppointments] = useState([]);

  const [pending, setPending] = useState([]);
  const [resolved, setResolved] = useState([]);
  const [cancelled, setCancelled] = useState([]);

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
    if (appointments) {
      let pending = [];
      let resolved = [];
      let cancelled = [];

      appointments.map((appointment) => {
        if (appointment.status === "pending") {
          pending.push(appointment);
        } else if (appointment.status === "resolved") {
          resolved.push(appointment);
        } else if (appointment.status === "cancelled") {
          cancelled.push(appointment);
        }

        setPending(pending);
        setResolved(resolved);
        setCancelled(cancelled);
      });
    }
  }, [appointments]);

  useEffect(() => {
    if (user) {
      fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/users/appointments`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: user.id }),
      })
        .then(async (res) => {
          const response = await res.json();
          setAppointments(response.appointments);
          console.log(response);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [user]);

  function formatDate(date) {
    const inputDate = new Date(date);
    const formattedDate = inputDate
      .toLocaleString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      })
      .replace(/\//g, "-")
      .replace(",", " ");
    return formattedDate;
  }

  return (
    <>
      <Navbar />
      <Box bg="gray.100" height="90vh" p="10px 50px">
        <Box bg="green.100" borderRadius="20px" p="20px">
          <Heading size="md">Unresolved Appointments</Heading>
          {pending.length > 0 ? (
            <TableContainer>
              <Table variant="simple" mt="10px" overflowY="auto">
                <Thead>
                  <Tr>
                    <Th>Doctor Name</Th>
                    <Th>Appointment ID</Th>
                    <Th>Appointment Date</Th>
                    <Th>Description</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {pending.map((appointment) => {
                    return (
                      <Tr key={appointment._id}>
                        <Td>{appointment.doctorName}</Td>
                        <Td>{appointment._id}</Td>
                        <Td>{formatDate(appointment.date)}</Td>
                        <Td>{appointment.desc}</Td>
                      </Tr>
                    );
                  })}
                </Tbody>
              </Table>
            </TableContainer>
          ) : (
            <Alert status="success" mt="20px">
              <AlertIcon />
              No Unresolved Appointments
            </Alert>
          )}
        </Box>
        <Box mt="30px">
          <Heading size="md">Resolved Appointments</Heading>
          {resolved.length > 0 ? (
            <TableContainer>
              <Table variant="simple" mt="20px" overflowY="auto">
                <Thead>
                  <Tr>
                    <Th>Doctor Name</Th>
                    <Th>Appointment ID</Th>
                    <Th>Appointment Date</Th>
                    <Th>Description</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {resolved.map((appointment) => {
                    return (
                      <Tr key={appointment._id}>
                        <Td>{appointment.doctorName}</Td>
                        <Td>{appointment._id}</Td>
                        <Td>{formatDate(appointment.date)}</Td>
                        <Td>{appointment.desc}</Td>
                      </Tr>
                    );
                  })}
                </Tbody>
              </Table>
            </TableContainer>
          ) : (
            <Alert status="success" mt="20px">
              <AlertIcon />
              No Resolved Appointments
            </Alert>
          )}
        </Box>
      </Box>
    </>
  );
};

export default Appointments;
