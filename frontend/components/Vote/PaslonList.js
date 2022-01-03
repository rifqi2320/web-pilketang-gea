import { Flex, Image, Heading, Stack} from "@chakra-ui/react"

const Paslon = ({ data }) => {
  return (
    <Flex flexDir="column" borderRadius={8} borderWidth={1} borderColor="#dddddd" justifyContent="center" alignItems="center" >
      <Image src={data.photo} boxSize="400px" p={4} borderRadius={16} alt={ data.name } />
      <Heading textAlign="center" fontSize="lg" mb={2}>
        {data.nim} - {data.name}
      </Heading>
    </Flex>
  )
}

const PaslonList = ({ profileList, ...props }) => {
  return (
    <Stack w="full" {...props} direction={["column", "column", "row", "row"]}>
      {profileList.map((profile) => <Paslon data={profile}/>)}
    </Stack>
  )
}

export default PaslonList;