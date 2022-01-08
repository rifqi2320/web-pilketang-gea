import axios from "axios";

export const getVoteStat = async () => {
  const res = await axios.get("https://backend-pilketang-gea.azurewebsites.net/status");
  return res.data;
};

export const getPaslonData = async () => {
  const res = await fetch("https://pemilugea2021.xyz/data_paslon.json");
  const data = await res.json();
  return data;
};
