import { Flex, Text, Select } from "@chakra-ui/react";
import { useEffect, useState } from "react";

const SelectCandidate = ({ allCandidatesList, selectedCandidates, func, num, ...props }) => {
  const [notSelected, setNotSelected] = useState([]);

  useEffect(() => {
    const newArray = allCandidatesList.filter(
      (x) => !selectedCandidates.slice(0, num).includes(parse(x.id))
    );
    setNotSelected([...newArray]);
  }, [selectedCandidates]);

  const handleChange = (e) => {
    func(parse(e.target.value), num);
  };

  const parse = (num) => {
    if (num === "") {
      return -1;
    } else {
      return parseInt(num);
    }
  };

  return (
    <>
      {num > 0 &&
      (selectedCandidates.slice(0, num).some((result) => result === -1) ||
        selectedCandidates.length === 0) ? null : (
        <Flex p={4} flexDir="column" {...props}>
          <Text fontWeight="bold">Pilih Calon untuk Prioritas {num + 1}</Text>
          <Flex pb={4} pt={2}>
            <Select
              placeholder={num === 0 ? "Pilih calon" : "Tidak memilih"}
              onChange={handleChange}
            >
              {notSelected.map((profile, id) => (
                <option key={id} value={profile.id}>
                  {profile.nim} - {profile.name}
                </option>
              ))}
            </Select>
          </Flex>
        </Flex>
      )}
    </>
  );
};

export default SelectCandidate;