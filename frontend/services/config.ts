export const API_URL = "https://ideia-space-4fddfd01c45c.herokuapp.com/";

export const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};
