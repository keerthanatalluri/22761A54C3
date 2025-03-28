import { useState, useEffect } from "react";
import apiClient from "../api/apiClient";

function TrendingPosts() {
  const [trendingPosts, setTrendingPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrendingPosts = async () => {
      try {
        // Step 1: Fetch all users
        const usersResponse = await apiClient.get("/users");
        const users = usersResponse.data.users;

        // Step 2: Fetch all posts for each user
        let allPosts = [];
        for (const userId of Object.keys(users)) {
          const postsResponse = await apiClient.get(`/users/${userId}/posts`); // ✅ FIXED TEMPLATE LITERAL
          allPosts = allPosts.concat(postsResponse.data.posts);
        }

        // Step 3: Fetch comment counts for each post
        const postCommentCounts = await Promise.all(
          allPosts.map(async (post) => {
            const commentsResponse = await apiClient.get(`/posts/${post.id}/comments`); // ✅ FIXED TEMPLATE LITERAL
            return { ...post, commentCount: commentsResponse.data.comments.length };
          })
        );

        // Step 4: Find the post(s) with the most comments
        const maxCommentCount = Math.max(...postCommentCounts.map((p) => p.commentCount), 0);
        const trending = postCommentCounts.filter((p) => p.commentCount === maxCommentCount);

        setTrendingPosts(trending);
      } catch (error) {
        console.error("Error fetching trending posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingPosts();
  }, []);

  if (loading) return <p>Loading Trending Posts...</p>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">🔥 Trending Posts</h1>
      {trendingPosts.length === 0 ? (
        <p>No trending posts found.</p>
      ) : (
        <div className="space-y-4">
          {trendingPosts.map((post) => (
            <div key={post.id} className="bg-white shadow-lg rounded-xl p-4">
              <p className="text-lg font-semibold">{post.content}</p>
              <p className="text-gray-500">Comments: {post.commentCount}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default TrendingPosts;
