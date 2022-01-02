import axios from "axios";

export const getCount = async () => {
  const res = await axios.get("http://localhost:5000/get_count");
  return res.data;
};
