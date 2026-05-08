const { default: axios } = require("axios");
const Account = require("../models/account");
const api = require("../utils/axiosInstance");

async function validateBVN(bvn) {
  if (!bvn) return { success: false, message: "BVN is required" };

  try {
    const response = await api.post("/api/validateBVN", { bvn });

    return {
      success: true,
      data: response.data,
      status: response.status,
    };
  } catch (error) {
    const status = error.response?.status;
    const message = error.response?.data?.message || error.message;

    console.error(`BVN Validation Failed [${status}]:`, message);

    return {
      success: false,
      status,
      message: message || "BVN validation failed",
    };
  }
}

async function createBVN(firstName, lastName, dob, phone, bvn) {
  if (!bvn || !firstName || !lastName || !dob || !phone) {
    return {
      success: false,
      message: "All fields are required for BVN creation",
    };
  }

  const payload = { firstName, lastName, dob, phone, bvn };

  try {
    const validateRes = await validateBVN(bvn);

    if (validateRes.success) {
      return {
        success: true,
        message: "BVN already exists and is valid",
        data: validateRes.data,
      };
    }

    if (validateRes.message?.includes("not found")) {
      console.log(`BVN ${bvn} not found. Creating new record...`);

      const insertRes = await api.post("/api/insertBVN", payload);

      return {
        success: true,
        message: "BVN created successfully",
        data: insertRes.data,
      };
    }

    return {
      success: false,
      message: validateRes.message,
    };
  } catch (error) {
    const status = error.response?.status;
    const message = error.response?.data?.message || error.message;

    console.error("createBVN Error:", { status, message });

    return {
      success: false,
      message: message || "Failed to process BVN",
    };
  }
}

async function createNIBBSUser(kycType, kycID, dob) {
  if (!kycType || !kycID || !dob) {
    return { success: false, message: "kycType, kycID and dob are required" };
  }

  try {
    const payload = { kycType, kycID, dob };

    const response = await api.post("/api/account/create", payload);

    return {
      success: true,
      status: response.status,
      data: response.data,
    };
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    console.error("createNIBBSUser Error:", message);

    return {
      success: false,
      message: message || "Failed to create NIBSS user",
    };
  }
}

async function createBankAccountNIBBS(kycType, kycID, dob, userId) {
  if (!kycType || !kycID || !dob) {
    return {
      success: false,
      message: "kycType, kycID and dob are required",
    };
  }
  try {
    const payload = {
      kycType,
      kycID,
      dob,
    };

    const response = await api.post("/api/account/create", payload);

    await Account.create({
      customerId: userId,
      accountNumber: response.data?.account?.accountNumber,
      bankCode: response.data?.account?.bankCode,
      accountName: response?.data?.account?.accountName,
      balance: response?.data?.account?.balance,
    });

    return {
      success: true,
      status: response.status,
      data: response.data,
    };
  } catch (error) {
    const status = error.response?.status;
    const errorData = error.response?.data;

    console.error("=== NIBSS createAccount ERROR ===");
    console.error("Status:", status);
    console.error("Response Data:", errorData);

    return {
      success: false,
      message:
        errorData?.message || error.message || "Failed to create bank account",
      errorDetails: errorData,
      status,
    };
  }
}

async function accountDetails(accountNumber) {
  try {
    const data = await api.get(`/api/account/name-enquiry/${accountNumber}`);
    return { success: true, data: data?.data };
  } catch (err) {
    console.error("Error fetching account details:", err);
    return { success: false, message: "Failed to fetch account details" };
  }
}

module.exports = {
  validateBVN,
  createBVN,
  createNIBBSUser,
  createBankAccountNIBBS,
  accountDetails,
};
