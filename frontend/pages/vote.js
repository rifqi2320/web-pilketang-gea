import { useEffect, useState } from "react";

import StepOne from "../components/Vote/StepOne.js";
import StepTwo from "../components/Vote/StepTwo.js";
import Background from "../components/Background/Background.js";
import Navbar from "../components/Navbar/Navbar.js";

const Vote = () => {
  const [selectedCandidates, setSelectedCandidates] = useState(null);
  const [step, setStep] = useState(0);

  const handleSelectedCandidates = (candidates) => {
    setSelectedCandidates(candidates);
  };

  switch (step) {
    case 0:
      return (
        <>
          <Navbar />
          <Background minH="100vh">
            <StepOne onNext={handleSelectedCandidates} changeStep={setStep} />)
          </Background>
        </>
      );
    case 1:
      return (
        <>
          <Navbar />
          <Background minH="100vh">
            <StepTwo />)
          </Background>
        </>
      );
    default:
      return null;
  }

  return (
    <>
      <Navbar />
      <Background minH="100vh">{switchStep}</Background>
    </>
  );
};

export default Vote;
