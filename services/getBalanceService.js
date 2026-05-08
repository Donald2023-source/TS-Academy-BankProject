const api = require("../utils/axiosInstance"); 
async function getBalanceService(accountNumber) {
  try {
    const data = await api.get(`/api/account/balance/${accountNumber}`);
    return data?.data?.balance;
  } catch (err) {
    console.error("Error fetching account balance:", err);
    throw err;
  }
}

module.exports = { getBalanceService };
