import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import { FaClock } from "react-icons/fa";

const Menu = ({ category }) => {
  const [error, setError] = useState(null);
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetch(
          `http://localhost:8800/api/posts/?cat=${category}`
        );

        if (!response.ok) {
          setError("Failed to fetch posts");
          setIsLoading(false);
          return;
        }

        const data = await response.json();
        setPosts(data);
      } catch (error) {
        setError("An error occurred while fetching posts");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, [category]);

  return (
    <div className="sidebar">
      <div className="sidebar-section">
        <h3>Related Articles</h3>
        
        {isLoading ? (
          <div className="loading-posts">
            <div className="spinner"></div>
            <p>Loading related articles...</p>
          </div>
        ) : error ? (
          <div className="error">{error}</div>
        ) : posts.length === 0 ? (
          <div className="no-posts">No related articles found</div>
        ) : (
          <div className="related-posts">
            {posts.map((post) => (
              <Link to={`/post/${post?.id}`} className="post-card" key={post?.id}>
                <div className="post-image">
                  <img 
                    src={post.img || "/default-image.png"} 
                    alt={post?.title}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.parentNode.innerHTML = '<div class="image-fallback"></div>';
                    }}
                  />
                </div>
                <div className="post-content">
                  <h4 className="post-title">{post?.title}</h4>
                  <div className="post-meta">
                    <FaClock className="icon" />
                    <span>{moment(post?.date).format("MMM D")}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Menu;