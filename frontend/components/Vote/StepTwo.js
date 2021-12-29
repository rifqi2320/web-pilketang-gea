import { Flex, Box, Button, Heading, VStack, Text } from "@chakra-ui/react";
import { RepeatIcon } from "@chakra-ui/icons";
import { useCallback, useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import { useRouter } from "next/router";

const initialConstraints = {
  // width: 720,
  // height: 480,
  deviceId: null,
};

const Photo = () => {
  const videoRef = useRef(null);
  const [photo, setPhoto] = useState({ captured: false, src: "" });
  const [videoConstraints, setVideoConstraints] = useState(initialConstraints);
  const [devices, setDevices] = useState({
    devicesList: [],
    selected: 0,
  });
  const [timeLeft, setTimeLeft] = useState(720);

  const loadVideoDevices = () => {
    navigator.mediaDevices.enumerateDevices().then((devices) => {
      const videoDevices = devices.filter(({ kind }) => kind === "videoinput");
      setDevices({ selected: 0, devicesList: videoDevices });
      setVideoConstraints({ ...videoConstraints, deviceId: videoDevices[0].deviceId });
    });
  };

  useEffect(loadVideoDevices, []);

  useEffect(() => {
    const timer = timeLeft > 0 && setInterval(() => setTimeLeft(timeLeft - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleChange = () => {
    let currentIndex = devices.selected;
    currentIndex += 1;
    setDevices({ ...devices, selected: currentIndex });

    const currentVideoDevice =
      devices.devicesList[currentIndex % devices.devicesList.length].deviceId;
    setVideoConstraints({ ...videoConstraints, deviceId: currentVideoDevice });
  };

  const handleList = () => {
    console.log(devices);
    console.log(videoConstraints);
  };

  const handleSubmit = () => {

  }

  const handleCapture = useCallback(() => {
    const imageSrc = videoRef.current.getScreenshot();
    setPhoto({ captured: true, src: imageSrc });
  }, [videoRef]);

  return (
    <Flex w="100vw" minH="100vh" justifyContent="center">
      <Flex
        bg="white"
        boxShadow="lg"
        borderRadius={8}
        borderWidth={1}
        mt={24}
        mb={8}
        w={["90vw", "90vw", "80vw", "70vw"]}
        justifyContent="center"
        flexDir="column"
      >
        <Flex
          w="full"
          flexDir="column"
          textAlign="center"
          borderRadius={8}
          borderColor="#f4f4f4"
          borderWidth={1}
          p={8}
        >
          <Heading w="full">Validasi Voting</Heading>
          <Text mt={2}>Validasi hasil vote Anda dengan bukti foto</Text>
        </Flex>
        <VStack>
          <Box pb={4} pt={4}>
            <Button onClick={handleChange}>
              <Text mr={4}>Ganti Kamera</Text>
              <RepeatIcon />
            </Button>
          </Box>
          <Flex mt={12} boxShadow="md">
            <Webcam
              forceScreenshotSourceSize
              ref={videoRef}
              screenshotFormat="image/jpeg"
              videoConstraints={videoConstraints}
            />
          </Flex>
          <Button onClick={handleCapture}>Capture</Button>
          {photo.captured ? (
            <Flex justifyContent="center" pt={16} alignItems="center" flexDir="column">
              <Heading width="full" textAlign="center">Preview</Heading>
              <img src={photo.src} />
              <Button onCLick={handleSubmit} mt={2} mb={4}>Submit</Button>
            </Flex>
          ) : null}
        </VStack>
      </Flex>
    </Flex>
  );
};

export default Photo;
