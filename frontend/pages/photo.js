import { Box, Button, Heading, Select, VStack, Text } from "@chakra-ui/react";
import { RepeatIcon } from "@chakra-ui/icons";
import { useCallback, useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import Navbar from "../components/Navbar/Navbar";

const initialConstraints = {
  width: 720,
  height: 480,
  deviceId: null,
};

const photo = () => {
  const videoRef = useRef(null);
  const [photo, setPhoto] = useState({ captured: false, src: "" });
  const [videoConstraints, setVideoConstraints] = useState(initialConstraints);
  const [devices, setDevices] = useState({
    devicesList: [],
    selected: 0,
  });
  const [timeLeft, setTimeLeft] = useState(720);

  useEffect(() => {
    navigator.mediaDevices.enumerateDevices().then((devices) => {
      const videoDevices = devices.filter(({ kind }) => kind === "videoinput");
      setDevices({ selected: 0, devicesList: videoDevices });
      console.log(devices);
      setVideoConstraints({ ...videoConstraints, deviceId: videoDevices[0].deviceId });
    });
  }, []);

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

  const handleCapture = useCallback(() => {
    const imageSrc = videoRef.current.getScreenshot();
    setPhoto({ captured: true, src: imageSrc });
  }, [videoRef]);

  return (
    <div>
      <Navbar />
      <VStack>
        {devices.devicesList.map((device, idx) => <Text key={idx}>{device.label}</Text>)}
        <Box pb={4} pt={4}>
          <Button onClick={handleChange}>
            <RepeatIcon />
          </Button>
        </Box>
        <Box mt={12}>
          <Webcam
            height={480}
            ref={videoRef}
            screenshotFormat="image/jpeg"
            width={720}
            videoConstraints={videoConstraints}
          />
        </Box>
        <Button onClick={handleCapture}>Capture</Button>
        <Button onClick={handleList}>List</Button>
        {photo.captured ? (
          <Box>
            <Heading>Preview</Heading>
            <img src={photo.src} />
          </Box>
        ) : null}
      </VStack>
    </div>
  );
};

export default photo;
