import axios from "axios";

export const getVoteStat = async () => {
  const res = await axios.get("http://localhost:5000/status");
  return res.data;
};
