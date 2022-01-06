import {
  Flex,
  Box,
  Button,
  Heading,
  VStack,
  Text,
  Image,
  Spinner,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import { RepeatIcon } from "@chakra-ui/icons";
import { useCallback, useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";

const initialConstraints = {
  deviceId: null,
};

const Preview = ({ src }) => {
  return (
    <Flex justifyContent="center" alignItems="center" flexDir="column">
      <Heading width="full" textAlign="center">
        Preview
      </Heading>
      <Image src={src} />
    </Flex>
  );
};

const Photo = ({ timeLeft, onCapture, onSubmit }) => {
  const videoRef = useRef(null);
  const [photo, setPhoto] = useState({ captured: false, src: "" });
  const [videoConstraints, setVideoConstraints] = useState(initialConstraints);
  const [loading, setLoading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [devices, setDevices] = useState({
    devicesList: [],
    selected: 0,
  });

  const loadVideoDevices = () => {
    navigator.mediaDevices.enumerateDevices().then((devices) => {
      const videoDevices = devices.filter(({ kind }) => kind === "videoinput");
      setDevices({ selected: 0, devicesList: videoDevices });
      setVideoConstraints({ ...videoConstraints, deviceId: videoDevices[0].deviceId });
    });
  };

  useEffect(loadVideoDevices, []);

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

  const handleSubmit = () => {
    onSubmit();
    setLoading(true);
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent m={4}>
          <ModalHeader>Konfirmasi Submit</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>
              Pastikan data vote dan bukti foto yang Anda berikan sudah valid. Dengan mengklik
              tombol submit, pilihan vote dan bukti foto Anda akan tercatat secara permanen.
            </Text>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={4} onClick={onClose}>
              Cancel
            </Button>
            <Button color="#FF7315" disabled={loading} onClick={handleSubmit}>
              {loading ? <Spinner /> : "Submit"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Flex w="100vw" minH="100vh" justifyContent="center">
        <Flex
          bg="white"
          boxShadow="lg"
          borderRadius={8}
          borderWidth={1}
          m={2}
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
            alignItems="center"
            borderRadius={8}
            borderColor="#f4f4f4"
            borderWidth={1}
            p={8}
          >
            <Heading w="full">Pengambilan Foto</Heading>
            <Text mt={4} w={["90%", "90%", "70%", "70%"]}>
              Pengambilan foto dilakukan untuk memvalidasi hasil vote Anda dengan foto wajah dan
              kartu identitas terlihat jelas dan dalam satu frame
            </Text>
            <Flex mt={4}>{timeLeft}</Flex>
          </Flex>
          <VStack mb={4}>
            {photo.captured ? null : (
              <Box pb={4} pt={4}>
                <Button onClick={handleChange}>
                  <Text mr={4}>Ganti Kamera</Text>
                  <RepeatIcon />
                </Button>
              </Box>
            )}
            {photo.captured ? (
              <Preview src={photo.src} />
            ) : (
              <>
                <Flex mt={12} boxShadow="md">
                  <Webcam
                    forceScreenshotSourceSize
                    ref={videoRef}
                    screenshotFormat="image/jpeg"
                    videoConstraints={videoConstraints}
                  />
                </Flex>
              </>
            )}
            <Button onClick={handleCapture}>{photo.captured ? "Capture Ulang" : "Capture"}</Button>
            {!photo.captured ? null : (
              <Flex pt={16} flexDir="column" maxW="400px" alignItems="center">
                <Text color="red" textAlign="center">
                  Periksa kembali bukti foto Anda sebelum melakukan submit
                </Text>
                <Button
                  mt={2}
                  bg="#FF7315"
                  minW="150px"
                  maxW="250px"
                  color="white"
                  _hover={{ bg: "#E25B00" }}
                  onClick={onOpen}
                >
                  Submit
                </Button>
              </Flex>
            )}
          </VStack>
        </Flex>
      </Flex>
    </>
  );
};

export default Photo;
