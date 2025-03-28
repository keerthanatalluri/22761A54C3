import React from "react";
import { useQuery } from "react-query";
import apiClient from "../api/apiClient";

const fetchPosts = async () => {
  const response = await apiClient.get("/posts");
  return response.data.posts;
};

function Feed() {
  // Fetch posts with polling every 10 seconds (10000 ms)
  const { data: posts, isLoading, isError, refetch } = useQuery(
    "feedPosts", 
    fetchPosts,
    { 
      refetchInterval: 10000, // Polling every 10 seconds for new posts
      refetchOnWindowFocus: false, // Disable refetch on window focus for better performance
      staleTime: 60000, // Cache data for 1 minute
    }
  );

  if (isLoading) return <p>Loading posts...</p>;
  if (isError) return <p>Error loading posts.</p>;

  return (
    <div className="space-y-4">
      {posts.length === 0 ? (
        <p>No posts available.</p>
      ) : (
        posts.map((post) => (
          <div key={post.id} className="bg-white shadow-md rounded-lg p-4">
            <p className="text-lg">{post.content}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default Feed;