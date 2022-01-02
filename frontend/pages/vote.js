import { useEffect, useState } from "react";

import StepZero from "../components/Vote/StepZero.js";
import StepOne from "../components/Vote/StepOne.js";
import StepTwo from "../components/Vote/StepTwo.js";
import Background from "../components/Background/Background.js";
import Navbar from "../components/Navbar/Navbar.js";
import { useAuthState } from "../contexts/auth.js";
import DoneVote from "../components/Vote/DoneVote.js";
import axios from "axios";

const initialFormData = {
  bph_id: null,
  senator_id: null,
  img_data: null,
  timeTaken: 0,
};

const Vote = () => {
  const [formData, setFormData] = useState(initialFormData);
  const [step, setStep] = useState(0);

  const { isVoted, token } = useAuthState();

  const API = axios.create({
    baseURL: "http://localhost:5000",
    headers: { Authorization: "Bearer " + token },
  });

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
      console.log(formData);
      const result = await API.post("/vote", formData);
    } catch (error) {
      console.log(`vote error: ${error.message}`);
    }
  };

  // if (typeof window !== undefined) {
  //   if (isVoted !== "0" && isVoted !== undefined) {
  //     return <DoneVote />;
  //   }
  // }

  switch (step) {
    case 0:
      return (
        <>
          <Navbar />
          <Background minH="100vh">
            <StepZero onNext={handleSelectedBPH} changeStep={setStep} />)
          </Background>
        </>
      );
    case 1:
      return (
        <>
          <Navbar />
          <Background minH="100vh">
            <StepOne onNext={handleSelectedSenator} changeStep={setStep} />)
          </Background>
        </>
      );
    case 2:
      return (
        <>
          <Navbar />
          <Background minH="100vh">
            <StepTwo onCapture={handleCapture} onSubmit={handleSubmit} />
          </Background>
        </>
      );
    default:
      return null;
  }
};

export default Vote;
