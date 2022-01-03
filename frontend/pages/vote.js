import { useEffect, useState } from "react";
import { Flex, Text } from "@chakra-ui/react";
import moment from "moment";

import StepZero from "../components/Vote/StepZero.js";
import StepOne from "../components/Vote/StepOne.js";
import StepTwo from "../components/Vote/StepTwo.js";
import Background from "../components/Background/Background.js";
import Navbar from "../components/Navbar/Navbar.js";
import { useAuthState } from "../contexts/auth.js";
import DoneVote from "../components/Vote/DoneVote.js";
import axios from "axios";
import Router from "next/router";

moment.locale();

const initialFormData = {
  bph_id: null,
  senator_id: null,
  img_data: null,
  timeTaken: 0,
};

const TimeLeft = ({ time, ...props }) => {
  return (
    <Flex textAlign="center" {...props} width="full" alignItems="center" flexDir="column">
      <Text>Waktu vote:</Text>
      <Text textColor={time < 480 ? "black" : "red"}>
        {moment.utc(time * 1000).format("mm:ss")}
      </Text>
    </Flex>
  );
};

const Vote = () => {
  const [formData, setFormData] = useState(initialFormData);
  const [step, setStep] = useState(0);
  const [time, setTime] = useState({ start: 0, taken: 0 });

  const { isVoted, token } = useAuthState();

  const API = axios.create({
    baseURL: "http://localhost:5000",
    headers: { Authorization: "Bearer " + token },
  });

  const handleTime = () => {
    setTime({ ...time, taken: time.taken + 1 });
  };

  useEffect(() => {
    const startTime = localStorage.getItem("startTime");

    if (!startTime) {
      localStorage.setItem("startTime", Date.now());
      return setTime({ start: startTime, taken: 0 });
    }

    const delta = Math.floor((Date.now() - startTime) / 1000);
    setTime({ start: startTime, taken: delta });
  }, []);

  useEffect(() => {
    const timer = setInterval(handleTime, 1000);
    return () => clearInterval(timer);
  }, [time.taken]);

  const handleSelectedBPH = (candidates) => {
    setFormData({ ...formData, bph_id: candidates });
  };

  const handleSelectedSenator = (candidates) => {
    setFormData({ ...formData, senator_id: candidates });
  };

  const handleCapture = (img) => {
    setFormData({ ...formData, img_data: img });
  };

  const handleSubmit = async () => {
    try {
      const timeTaken = Math.floor((Date.now() - time.start) / 1000);
      console.log({ ...formData, timeTaken: timeTaken });
      const result = await API.post("/vote", formData);

      if (result) {
        return Router.push("/vote-success");
      }
    } catch (error) {
      Router.push("/vote-failed");
    }
  };

  if (typeof window !== undefined) {
    if (isVoted !== undefined) {
      if (isVoted !== 0) {
        return <DoneVote />;
      }
    }
  }

  switch (step) {
    case 0:
      return (
        <>
          <Navbar />
          <Background minH="100vh">
            <StepZero
              onNext={handleSelectedBPH}
              changeStep={setStep}
              timeLeft={<TimeLeft time={time.taken} />}
            />
            )
          </Background>
        </>
      );
    case 1:
      return (
        <>
          <Navbar />
          <Background minH="100vh">
            <StepOne
              onNext={handleSelectedSenator}
              changeStep={setStep}
              timeLeft={<TimeLeft time={time.taken} />}
            />
            )
          </Background>
        </>
      );
    case 2:
      return (
        <>
          <Navbar />
          <Background minH="100vh">
            <StepTwo
              onCapture={handleCapture}
              onSubmit={handleSubmit}
              timeLeft={<TimeLeft time={time.taken} />}
            />
          </Background>
        </>
      );
    default:
      return null;
  }
};

export default Vote;
