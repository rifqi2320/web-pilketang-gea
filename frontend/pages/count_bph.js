import Count from "../components/Count/Count";
import Navbar from "../components/Navbar/Navbar";

const count = () => {
  return (
    <>
      <Navbar />
      <Count mode={"Ketua BPH"} />
    </>
  );
};

export default count;
