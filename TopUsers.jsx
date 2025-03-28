import { useState, useEffect } from "react";
import apiClient from "../api/apiClient";

function TopUsers() {
  const [topUsers, setTopUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopUsers = async () => {
      try {
        // Step 1: Get the list of users
        const usersResponse = await apiClient.get("/users");
        const users = usersResponse.data.users;

        // Step 2: Get post counts for each user
        const postCounts = await Promise.all(
          Object.keys(users).map(async (userId) => {
            const postsResponse = await apiClient.get(`/users/${userId}/posts`); // ✅ FIXED TEMPLATE LITERAL
            return { userId, userName: users[userId].name, postCount: postsResponse.data.posts.length };
          })
        );

        // Step 3: Sort by post count in descending order and get top 5
        const sortedUsers = postCounts.sort((a, b) => b.postCount - a.postCount).slice(0, 5);

        setTopUsers(sortedUsers);
      } catch (error) {
        console.error("Error fetching users or posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTopUsers();
  }, []);

  if (loading) return <p>Loading Top Users...</p>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">🏆 Top 5 Users</h1>
      <ul className="space-y-4">
        {topUsers.map((user) => (
          <li
            key={user.userId}
            className="bg-white shadow-lg rounded-xl p-4 flex justify-between items-center"
          >
            <span className="text-lg font-semibold">{user.userName}</span>
            <span className="text-gray-500">{user.postCount} Posts</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TopUsers;
