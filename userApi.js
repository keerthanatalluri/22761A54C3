import apiClient from "./apiClient";

export const fetchTopUsers = async () => {
  const response = await apiClient.get("/users/top-users");
  return response.data.topUsers;
};
