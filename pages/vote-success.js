import Head from "next/head";

import VoteSuccess from "../components/VoteStatus/VoteSuccess";

const Success = () => {
  return (
    <>
      <Head>
        <title>Vote Success - PEMILU HMTG "GEA" 2021</title>
      </Head>
      <VoteSuccess />
    </>
  );
};

export default Success;
