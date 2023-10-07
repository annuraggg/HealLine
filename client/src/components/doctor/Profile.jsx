import React, { useState } from "react";
import {
  Box,
  Heading,
  Input,
  Textarea,
  Button,
  FormControl,
  FormLabel,
  VStack,
} from "@chakra-ui/react";
import Navbar from "./Navbar"

const Profile = () => {
  const [doctorProfile, setDoctorProfile] = useState({
    name: "",
    specialty: "",
    contact: "",
    bio: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDoctorProfile({
      ...doctorProfile,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted:", doctorProfile);
  };

  return (
    <Box bg="gray.100" height='100vh'>
        <Navbar/>
      <Heading textAlign='center' as="h2" size="lg" mb={4}>
        Doctor Profile
      </Heading>
    <Box margin='40px 100px'>
    <form onSubmit={handleSubmit}>
        <VStack spacing={4}>
          <FormControl id="name">
            <FormLabel>Name</FormLabel>
            <Input
              type="text"
              name="name"
              value={doctorProfile.name}
              onChange={handleChange}
              required
            />
          </FormControl>
          <FormControl id="specialty">
            <FormLabel>Specialty</FormLabel>
            <Input
              type="text"
              name="specialty"
              value={doctorProfile.specialty}
              onChange={handleChange}
              required
            />
          </FormControl>
          <FormControl id="contact">
            <FormLabel>Contact Information</FormLabel>
            <Input
              type="text"
              name="contact"
              value={doctorProfile.contact}
              onChange={handleChange}
              required
            />
          </FormControl>
          <FormControl id="bio">
            <FormLabel>Bio</FormLabel>
            <Textarea
              name="bio"
              value={doctorProfile.bio}
              onChange={handleChange}
              required
            />
          </FormControl>
          <Button type="submit" colorScheme="blue">
            Save Profile
          </Button>
        </VStack>
      </form>
      </Box>
    </Box>
  );
};

export default Profile;
