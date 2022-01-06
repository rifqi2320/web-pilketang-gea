import Head from "next/head";

import Count from "../components/Count/Count";
import Navbar from "../components/Navbar/Navbar";

const count = () => {
  return (
    <>
      <Head>
        <title>Hasil Vote Calon BPH - PEMILU HMTG "GEA" 2021</title>
      </Head>
      <Navbar />
      <Count mode={"Ketua BPH"} />
    </>
  );
};

export default count;
