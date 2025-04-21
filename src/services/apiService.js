import axios from "axios";

// Create an Axios instance
const apiClient = axios.create({
  baseURL: "http://localhost:8080", // Replace with your API base URL
  timeout: 10000, // Request timeout in milliseconds
});

// Define API methods
const api = {
  health: async () => {
    try {
      const response = await apiClient.get("/health");
      return response.data;
    } catch (error) {
      console.error("API health check failed:", error);
      throw error;
    }
  },
  createBoard: async (body) => {
    return await apiClient.post("/api/v1/board", body);
  },
};

export default api;
