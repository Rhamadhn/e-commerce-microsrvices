import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL + "/users";

export const fetchUsers = async () => {
  try {
    const res = await axios.get(API_URL);
    return res.data.data || [];
  } catch (err) {
    console.error("Fetch error:", err.message, err.response);
    return [];
  }
};

export const addUser = async (user) => {
  try {
    const res = await axios.post(API_URL, user);
    return { data: res.data.data, errors: null };

  } catch (err) {
    // backend bisa kirim: errors (object) atau message (string)
    const backendErrors = err.response?.data?.errors;
    const backendMessage = err.response?.data?.message;

    let errors = {};

    if (backendErrors) {
      errors = backendErrors;
    } else if (backendMessage) {
      errors = { global: backendMessage };
    } else {
      errors = { global: "Unexpected server error" };
    }

    return {
      data: null,
      errors
    };
  }
};

