import Head from "next/head";

import ServerError from "../components/ServerError/ServerError";

const Error = () => {
  return (
    <>
      <Head>
        <title>Server Error - PEMILU HMTG "GEA" ITB 2021</title>
      </Head>
      <ServerError />
    </>
  );
};

export default Error;
