import { useQuery } from "react-query";
import { useParams } from "react-router-dom"; // ✅ Added missing import
import apiClient from "../api/apiClient";

// Fetch user details
const fetchUser = async (userId) => {
  const response = await apiClient.get(`/users`); // ✅ Fixed backticks
  const users = response.data?.users || []; // ✅ Added optional chaining
  return users.find((user) => user.id === userId); // ✅ Ensures correct user fetching
};

// Fetch user posts
const fetchPosts = async (userId) => {
  const response = await apiClient.get(`/users/${userId}/posts`); // ✅ Fixed backticks
  return response.data?.posts || []; // ✅ Added optional chaining
};

function UserProfile() {
  const { userId } = useParams(); // ✅ Correctly fetching userId from URL

  const { data: user, isLoading: userLoading } = useQuery(
    ["user", userId],
    () => fetchUser(userId),
    { cacheTime: 1000 * 60 * 5 }
  );

  const { data: posts, isLoading: postsLoading } = useQuery(
    ["posts", userId],
    () => fetchPosts(userId),
    { cacheTime: 1000 * 60 * 5 }
  );

  if (userLoading || postsLoading) return <p>Loading...</p>;

  return (
    <div>
      {user ? (
        <>
          <h1 className="text-3xl font-bold mb-4">👤 {user.name}</h1> {/* ✅ Fixed user name */}
          <h2 className="text-2xl mb-4">📝 Posts:</h2>
          {posts.length === 0 ? (
            <p>No posts by this user.</p>
          ) : (
            <div className="space-y-4">
              {posts.map((post) => (
                <div key={post.id} className="bg-white shadow-md rounded-lg p-4">
                  <p className="text-lg">{post.content}</p>
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        <p>User not found.</p>
      )}
    </div>
  );
}

export default UserProfile;
