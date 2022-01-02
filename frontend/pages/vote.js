import { useState } from "react";

import StepZero from "../components/Vote/StepZero.js";
import StepOne from "../components/Vote/StepOne.js";
import StepTwo from "../components/Vote/StepTwo.js";
import Background from "../components/Background/Background.js";
import Navbar from "../components/Navbar/Navbar.js";
import { useAuthState } from "../contexts/auth.js";
import DoneVote from "../components/Vote/DoneVote.js";
import { Button } from "@chakra-ui/react";

const initialFormData = {
  bph_id: null,
  senator_id: null,
  file: null,
};

const Vote = () => {
  const [selectedBPH, setSelectedBPH] = useState(null);
  const [selectedSenator, setSelectedSenator] = useState(null);
  const [formData, setFormData] = useState(initialFormData);
  const [step, setStep] = useState(0);

  const { isVoted } = useAuthState();

  const handleSelectedBPH = (candidates) => {
    setSelectedBPH(candidates);
    setFormData({ ...formData, bph_id: candidates });
  };

  const handleSelectedSenator = (candidates) => {
    setSelectedSenator(candidates);
    setFormData({ ...formData, senator_id: candidates });
  };

  const handleCapture = (img) => {
    setFormData({ ...formData, file: img });
  };

  const handleState = () => {
    console.log(formData);
  };

  if (typeof window !== undefined) {
    if (isVoted !== "0") {
      return <DoneVote />;
    }
  }

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
            <StepTwo onCapture={handleCapture} />
            <Button height="50vh" onClick={handleState}>State</Button>
          </Background>
        </>
      );
    default:
      return null;
  }
};

export default Vote;
