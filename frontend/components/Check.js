import { Button } from "@chakra-ui/react";
import { useAuthState } from "../contexts/auth";

const Check = () => {
  const state = useAuthState();

  const handleClick = () => {
    console.log(state);
  }

  return (
    <Button onClick={handleClick}>state</Button>
  )
}

export default Check
