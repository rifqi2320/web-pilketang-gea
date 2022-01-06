import Head from "next/head";

import VoteSubmitted from "../components/VoteStatus/VoteSubmitted";

const Success = () => {
  return (
    <>
      <Head>
        <title>Vote Submitted - PEMILU HMTG "GEA" 2021</title>
      </Head>
      <VoteSubmitted />
    </>
  );
};

export default Success;
