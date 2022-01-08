import { useEffect, useState } from "react";
import { Flex, Text } from "@chakra-ui/react";
import moment from "moment";
import Head from "next/head";

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

  const fetchTime = async () => {
    try {
      const result = await API.post("/start_voting");
      const delta = Math.floor((Date.now() - result.data.startTime * 1000) / 1000);

      setTime({ start: result.data.startTime * 1000, taken: delta });
    } catch (error) {
      Router.push("/vote-failed");
    }
  };

  useEffect(() => {
    const voteEnabled = localStorage.getItem("vote_enabled");

    if (voteEnabled === "false" || !voteEnabled) {
      return Router.push("/dashboard");
    } else {
      fetchTime();
    }
  }, []);

  useEffect(() => {
    const timer = setInterval(handleTime, 1000);

    if (time.taken > 8 * 60 && isVoted === 0) {
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
      const result = await API.post("/vote", {
        ...autoSubmitData,
        timeTaken: timeTaken,
        status_code: 1,
      });
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
          <Head>
            <title>Vote Calon BPH - PEMILU HMTG "GEA" 2021</title>
          </Head>
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
          <Head>
            <title>Vote Calon Senator - PEMILU HMTG "GEA" 2021</title>
          </Head>
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
          <Head>
            <title>Bukti Foto - PEMILU HMTG "GEA" 2021</title>
          </Head>
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
