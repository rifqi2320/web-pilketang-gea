import Head from "next/head";
import Dashboard from "../components/Dashboard/Dashboard";
import Navbar from "../components/Navbar/Navbar";

const dashboard = () => {
  return (
    <>
    <Head>
      <title>Dashboard - PEMILU HMTG "GEA" ITB 2021</title>
    </Head>
      <Navbar />
      <Dashboard />
    </>
  );
};

export default dashboard;
