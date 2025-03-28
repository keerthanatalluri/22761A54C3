import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Feed from "./pages/Feed";
import TopUsers from "./pages/TopUsers";
import TrendingPosts from "./pages/TrendingPosts";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100 p-4">
        <nav className="flex gap-6 mb-6">
          <Link to="/">Feed</Link>
          <Link to="/top-users">Top Users</Link>
          <Link to="/trending-posts">Trending Posts</Link>
        </nav>

        <Routes>
          <Route path="/" element={<Feed />} />
          <Route path="/top-users" element={<TopUsers />} />
          <Route path="/trending-posts" element={<TrendingPosts />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;