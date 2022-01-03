import axios from "axios";

export const getVoteStat = async () => {
  const res = await axios.get("https://backend-piketang-gea.azurewebsites.net/status");
  return res.data;
};

export const getPaslonData = async () => {
  const res = await axios.get("https://backend-piketang-gea.azurewebsites.net/get_paslon");
  return res.data;
};
