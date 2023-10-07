import React, { useEffect, useState } from "react";
import Navbar from "../../components/doctor/Navbar";
import { Box, Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import jwtDecode from "jwt-decode";
import Cookies from "js-cookie";

const Doctor = () => {
  const date = new Date();
  const [appointments, setAppointments] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [todayAppointments, setTodayAppointments] = useState([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);

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
          <Box bg="green.100" height="20vh" borderRadius="15px" p="20px">
            <Box>
              <Box>Today's Appointments</Box>
              <Box>
                {todayAppointments.map((appointment) => (
                  <Table key={appointment._id}>
                    <Thead>
                      <Tr>
                        <Td>Patient Name</Td>
                        <Td>Schedule</Td>
                      </Tr>
                    </Thead>
                    <Tbody>
                      <Tr>
                        <Td>{appointment.patientName}</Td>
                        <Td>{appointment.date}</Td>
                      </Tr>
                    </Tbody>
                  </Table>
                ))}
              </Box>
            </Box>
          </Box>
          <Box
            bg="blue.100"
            height="20vh"
            borderRadius="15px"
            mt="20px"
            p="20px"
          >
            <Box>
              <Box>Upcoming Appointments</Box>
              <Box>
                {upcomingAppointments.map((appointment) => (
                  <Box key={appointment._id}>
                    <Box>{appointment.patient.name}</Box>
                    <Box>{appointment.date}</Box>
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
        </Box>
      </>
    );
  }
};

export default Doctor;
