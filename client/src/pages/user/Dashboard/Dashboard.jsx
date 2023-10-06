import React, { useEffect, useState } from "react";
import Navbar from "../../../components/user/Navbar";
import {
  Box,
  Flex,
  Input,
  Select,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  SliderMark,
  Tooltip,
  FormLabel,
  Text,
  Avatar,
  Button,
} from "@chakra-ui/react";
import Star from "../../../components/global/Star";

import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [docs, setDocs] = useState([])

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/users/dashboard`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    }).then(async (res) => {
      const response = await res.json();
      setDocs(response.doctors)
    }).catch((err) => {
      console.log(err);
    })
  }, []);

  const navigate = useNavigate();

  /* <Box bg="green.100" height="20vh" borderRadius="20px"></Box>*/

  return (
    <>
      <Navbar />
      <Box p="10px 50px" bg="gray.100">
        <Box mr="105px">
          <Flex
            gap="20px"
            mt="20px"
            width="100%"
            align="center"
            flexDirection="row-reverse"
          >
            <Input
              placeholder="Search"
              width="250px"
              border="1px solid gray"
            ></Input>
            <Select
              placeholder="Select Type"
              width="250px"
              border="1px solid gray"
            >
              <option>Allergists/Immunologists</option>
              <option>Cardiologists</option>
              <option>Dermatologists</option>
              <option>Gastroenterologists</option>
              <option>Nephrologists</option>
              <option>Ophthalmologists</option>
              <option>Otolaryngologists</option>
              <option>Pediatricians</option>
              <option>Podiatrists</option>
              <option>Psychiatrists</option>
              <option>Rheumatologists</option>
              <option>Urologists</option>
            </Select>
          </Flex>
        </Box>
        <Flex
          wrap="wrap"
          gap="20px"
          align="center"
          justify="center"
          overflowY="auto"
          height="73vh"
          mt="30px"
        >
          {docs.map((doc) => (
            <Flex
              key={doc._id}
              borderRadius="20px"
              mt="20px"
              p="20px"
              align="center"
              justify="space-between"
              width="40vw"
              bg="gray.200"
            >
              <Flex align="center" gap="20px">
                <Avatar p="10px" src={doc.image} size="xl"></Avatar>
                <Flex direction="column" gap="10px">
                  <Text fontSize="20px" fontWeight="bold">
                    {doc.fName} {doc.lName}
                  </Text>
                  <Text fontSize="15px">{doc.type}</Text>
                  <Flex gap="10px">
                    <Text fontSize="15px">Rating: {doc.rating}</Text>
                    <Text fontSize="15px">
                      Experience: {doc.exp} Years
                    </Text>
                  </Flex>
                  <Flex align="center" gap="10px">
                    <Text color="green" fontWeight="bold" fontSize="20px">
                      <span>₹</span> {doc.fees}
                    </Text>
                    <Star rating={doc.rating} fontSize={"12px"} />
                  </Flex>
                </Flex>
              </Flex>
              <Tooltip label="Book Appointment">
                <Button
                  colorScheme="green"
                  onClick={() => navigate(`doctor/${doc._id}`)}
                >
                  View
                </Button>
              </Tooltip>
            </Flex>
          ))}
        </Flex>
      </Box>
    </>
  );
};

export default Dashboard;
