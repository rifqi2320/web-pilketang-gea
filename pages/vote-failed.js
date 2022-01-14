import Head from "next/head";

import VoteFailed from "../components/VoteStatus/VoteFailed";

const Failed = () => {
  return (
    <>
      <Head>
        <title>Vote Failed - PEMILU HMTG "GEA" ITB 2021</title>
      </Head>
      <VoteFailed />
    </>
  );
};

export default Failed;
