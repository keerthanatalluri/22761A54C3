import { useState, useEffect } from "react";
import apiClient from "../api/apiClient";

function RealTimeFeed() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeed = async () => {
      try {
        console.log("Fetching users...");

        // Step 1: Fetch all users
        const usersResponse = await apiClient.get("/users");
        console.log("Users Response:", usersResponse.data);

        const users = usersResponse.data?.users || []; // Ensure users is an array

        if (!Array.isArray(users)) {
          console.error("Invalid users data format:", users);
          return;
        }

        // Step 2: Fetch posts from each user
        let allPosts = [];
        for (const user of users) {
          console.log(`Fetching posts for user ${user.id}...`);
          try {
            const postsResponse = await apiClient.get(`/users/${user.id}/posts`);
            console.log(`Posts for user ${user.id}:`, postsResponse.data);

            if (postsResponse.data?.posts) {
              allPosts = allPosts.concat(postsResponse.data.posts);
            } else {
              console.warn(`No posts found for user ${user.id}`);
            }
          } catch (error) {
            console.error(`Error fetching posts for user ${user.id}:`, error);
          }
        }

        // Step 3: Sort posts by creation time (most recent first)
        allPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        setPosts(allPosts);
      } catch (error) {
        console.error("Error fetching real-time feed:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeed();
    const interval = setInterval(fetchFeed, 10000); // Refresh feed every 10 seconds

    return () => clearInterval(interval);
  }, []);

  if (loading) return <p>Loading Real-Time Feed...</p>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">📢 Real-Time Feed</h1>
      {posts.length === 0 ? (
        <p>No posts available.</p>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <div key={post.id} className="bg-white shadow-lg rounded-xl p-4">
              <p className="text-lg font-semibold">{post.content}</p>
              <p className="text-gray-500">
                Posted at: {new Date(post.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default RealTimeFeed;
