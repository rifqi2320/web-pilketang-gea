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
  img_data: "",
  timeTaken: 0,
};

const TimeLeft = ({ time, ...props }) => {
  const timeLeft = 60 * 8 - time;

  return (
    <Flex textAlign="center" {...props} width="full" alignItems="center" flexDir="column">
      <Text>Waktu tersisa:</Text>
      <Text textColor={timeLeft > 0 ? "black" : "red"}>
        {timeLeft > 0 ? moment.utc(timeLeft * 1000).format("mm:ss") : "00:00"}
      </Text>
    </Flex>
  );
};

const Vote = () => {
  const [formData, setFormData] = useState(initialFormData);
  const [step, setStep] = useState(0);
  const [time, setTime] = useState({ start: Date.now(), taken: 0 });

  const { isVoted, token } = useAuthState();

  const API = axios.create({
    baseURL: "https://backend-pilketang-gea.azurewebsites.net/",
    headers: { Authorization: "Bearer " + token },
  });

  const handleTime = () => {
    setTime({ ...time, taken: time.taken + 1 });
  };

  useEffect(() => {
    const voteEnabled = localStorage.getItem("vote_enabled");
    let startTime = localStorage.getItem("startTime");

    if (voteEnabled === "false" || !voteEnabled) {
      return Router.push("/dashboard");
    }

    if (!startTime) {
      startTime = Date.now();
      localStorage.setItem("startTime", startTime);
      return setTime({ start: startTime, taken: 0 });
    }

    const delta = Math.floor((Date.now() - startTime) / 1000);
    setTime({ start: startTime, taken: delta });
  }, []);

  useEffect(() => {
    const timer = setInterval(handleTime, 1000);

    if ((time.taken > 8 * 60) && (isVoted === 0)) {
      handleAutoSubmit();
    }

    return () => clearInterval(timer);
  }, [time.taken]);

  const handleAutoSubmit = async () => {
    const timeTaken = Math.floor((Date.now() - time.start) / 1000);
    const autoSubmitData = {
      ...formData,
      bph_id: [-1, -1],
      senator_id: [-1, -1],
      img_data: "",
    };
    try {
      const result = await API.post("/vote", { ...autoSubmitData, timeTaken: timeTaken, status_code: 1 });
      localStorage.removeItem("startTime");
      if (result) Router.push("/vote-submitted");
    } catch (error) {
      Router.push("/vote-submitted");
    }
  };

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
      const form = { ...formData, timeTaken: timeTaken, status_code: 0 };
      localStorage.removeItem("startTime");
      const result = await API.post("/vote", form);
      if (result) {
        return Router.push("/vote-success");
      }
    } catch (error) {
      console.log(error.message);
      Router.push("/vote-failed");
    }
  };

  if (typeof window !== undefined) {
    if (isVoted !== undefined) {
      if (isVoted !== 0 && isVoted !== 2) {
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
              selectedBPH={formData.bph_id}
              selectedSenator={formData.senator_id}
            />
          </Background>
        </>
      );
    default:
      return null;
  }
};

export default Vote;
