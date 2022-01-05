import axios from "axios";

export const getCount = async (username, token) => {
  let res = {};
  if (username === "admin") {
    res = await axios
      .get("https://backend-pilketang-gea.azurewebsites.net/get_count", {
        headers: { Authorization: "Bearer " + token },
      })
      .catch((err) => {});
  } else {
    res = await axios
      .get("https://backend-pilketang-gea.azurewebsites.net/get_results")
      .catch((err) => {});
  }
  if (res) {
    return res.data;
  } else {
    return res;
  }
};
