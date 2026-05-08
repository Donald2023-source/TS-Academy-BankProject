const { default: axios } = require("axios");

exports.getToken = async () => {
  try {
    const res = await axios.post(
      "https://nibssbyphoenix.onrender.com/api/auth/token",
      {
        apiSecret: process.env.apiSecret,
        apiKey: process.env.apiKey,
      },
    );
    // console.log("Token fetched successfully:", res?.data?.token);
    return { token: res?.data?.token };
  } catch (error) {
    console.error("Error fetching token:", error);
  }
};


