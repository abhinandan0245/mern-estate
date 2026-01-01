// src/services/statsService.js
import axios from "axios";

export const fetchAdminStats = async () => {
  // backend endpoint you will create later
  const res = await axios.get("/api/admin/stats");
  return res.data; // expected: { totalUsers, totalListings, pendingListings, approvedListings }
};

export const fetchUserStats = async (userId) => {
  const res = await axios.get(`/api/users/${userId}/stats`);
  return res.data; // expected: { myListings, favoritesCount, messagesCount }
};
