import axios from "axios";

export const getCount = async () => {
  const res = await axios.get("https://backend-piketang-gea.azurewebsites.net/get_count");
  return res.data;
};
