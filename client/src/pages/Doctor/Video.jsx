import { Box } from "@chakra-ui/react";
import React, { useEffect } from "react";
import Twilio from "twilio-video";

const Video = ({ did, decoded }) => {
  /* useEffect(() => {}, []);

  const startRoom = () => {
    fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/users/doctor/${did}/video`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ roomName: decoded.id }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        joinVideoRoom(decoded.id, data.token);
      })
      .catch((err) => console.log(err));
  };

  const joinVideoRoom = async (roomName, token) => {
    // join the video room with the Access Token and the given room name

    const room = await Twilio.connect(token, {
      room: roomName,
    });
    return room;
  };

  const handleConnectedParticipant = (participant) => {};

  // join the video room with the token
  const room = await joinVideoRoom(roomName, token);

  // render the local and remote participants' video and audio tracks
  handleConnectedParticipant(room.localParticipant);
  room.participants.forEach(handleConnectedParticipant);
  room.on("participantConnected", handleConnectedParticipant);*/




};

export default Video;
