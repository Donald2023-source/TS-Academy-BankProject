const { default: axios } = require("axios");
const { getToken } = require("./getToken");

require("dotenv").config();

const api = axios.create({
  baseURL: "https://nibssbyphoenix.onrender.com",
});

const setToken = async () => {
  const token = await getToken();
  api.defaults.headers.Authorization = `Bearer ${token?.token}`;
  console.log("Token set successfully:", token?.token);
};

setToken();
setInterval(setToken, 45 * 60 * 1000);

module.exports = api;
