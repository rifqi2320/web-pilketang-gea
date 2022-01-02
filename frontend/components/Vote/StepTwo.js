import { Flex, Box, Button, Heading, VStack, Text, Image } from "@chakra-ui/react";
import { RepeatIcon } from "@chakra-ui/icons";
import { useCallback, useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";

const initialConstraints = {
  deviceId: null,
};

const Preview = ({ src }) => {
  return (
    <Flex justifyContent="center" pt={16} alignItems="center" flexDir="column">
      <Heading width="full" textAlign="center">
        Preview
      </Heading>
      <Image src={src} />
    </Flex>
  );
};

const Photo = ({ onCapture, onSubmit }) => {
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

  const handleCapture = () => {
    if (!photo.captured) {
      return shoot();
    }
    setPhoto({ captured: false, src: "" });
  };

  const shoot = useCallback(() => {
    const imageSrc = videoRef.current?.getScreenshot();
    setPhoto({ captured: true, src: imageSrc });
    onCapture(imageSrc);
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
        <VStack mb={4}>
          <Box pb={4} pt={4}>
            <Button onClick={handleChange}>
              <Text mr={4}>Ganti Kamera</Text>
              <RepeatIcon />
            </Button>
          </Box>
          {photo.captured ? (
            <Preview src={photo.src} />
          ) : (
            <Flex mt={12} boxShadow="md">
              <Webcam
                forceScreenshotSourceSize
                ref={videoRef}
                screenshotFormat="image/jpeg"
                videoConstraints={videoConstraints}
              />
            </Flex>
          )}
          <Button onClick={handleCapture}>{photo.captured ? "Capture Ulang" : "Capture"}</Button>
          <Flex mt={16}>
            <Button bg="#FF7315" color="white" _hover={{ bg: "#E25B00" }} onClick={onSubmit}>
              Submit
            </Button>
          </Flex>
        </VStack>
      </Flex>
    </Flex>
  );
};

export default Photo;
