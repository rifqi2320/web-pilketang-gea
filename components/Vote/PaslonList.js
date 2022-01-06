import { Flex, Image, Heading, Stack} from "@chakra-ui/react"

const Paslon = ({ data }) => {
  return (
    <Flex flexDir="column" borderRadius={8} borderWidth={1} borderColor="#dddddd" justifyContent="center" alignItems="center" >
      <Image src={data.photo} boxSize={["300px", "400px", "300px", "400px"]} p={4} borderRadius="20px" alt={ data.name } />
      <Heading textAlign="center" fontSize="lg" p={2} pt={0}>
        {data.nim} - {data.name}
      </Heading>
    </Flex>
  )
}

const PaslonList = ({ profileList, ...props }) => {
  return (
    <Stack w="full" {...props} direction={["column", "column", "row", "row"]} justifyContent="center">
      {profileList.map((profile, id) => <Paslon key={id} data={profile}/>)}
    </Stack>
  )
}

export default PaslonList;