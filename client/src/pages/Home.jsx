// src/pages/Home.jsx
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaCalendarAlt, FaArrowRight, FaSearch } from "react-icons/fa";

const Home = () => {
  const [error, setError] = useState(null);
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const category = useLocation().search;

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetch(
          `http://localhost:8800/api/posts${category}`
        );

        if (!response.ok) {
          setError("Failed to fetch posts");
          setIsLoading(false);
          return;
        }

        const data = await response.json();
        setPosts(data);
        setFilteredPosts(data); // Initialize filtered posts with all posts
      } catch (error) {
        setError("An error occurred while fetching posts");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, [category]);

  // Filter posts based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredPosts(posts);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = posts.filter(post => 
        post.title.toLowerCase().includes(query)
      );
      setFilteredPosts(filtered);
    }
  }, [searchQuery, posts]);

  // Function to get category color
  const getCategoryColor = (category) => {
    const colors = {
      art: "#e76f51",
      science: "#2a9d8f",
      technology: "#264653",
      cinema: "#e9c46a",
      design: "#f4a261",
      food: "#e63946",
    };
    return colors[category] || "#008080";
  };

  const truncateHtml = (html, maxLength) => {
    if (!html) return "";

    // Remove HTML tags for length calculation
    const text = html.replace(/<[^>]*>/g, "");

    if (text.length <= maxLength) return html;

    // Find the last space before maxLength
    const lastSpaceIndex = text.lastIndexOf(" ", maxLength);
    const truncatedText = text.substring(
      0,
      lastSpaceIndex > 0 ? lastSpaceIndex : maxLength
    );

    // Return original HTML content up to the truncated text
    return html.substring(0, html.indexOf(truncatedText) + truncatedText.length) + "...";
  };

  return (
    <div className="home">
      <div className="container">
        <div className="header">
          <h1>Explore Insights</h1>
          <p>Discover the latest articles and perspectives on diverse topics</p>
          
          {/* Search Bar */}
          <div className="search-container">
            <div className="search-box">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search posts by title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="loading">
            <div className="spinner"></div>
            <p>Loading posts...</p>
          </div>
        ) : (
          <div className="posts">
            {error && <div className="error">{error}</div>}

            {/* Search results info */}
            {!error && searchQuery && (
              <div className="search-results-info">
                Found {filteredPosts.length} post{filteredPosts.length !== 1 ? 's' : ''} matching "{searchQuery}"
              </div>
            )}

            {!error && filteredPosts.length === 0 ? (
              <div className="no-posts">
                <div className="no-posts-icon">🔍</div>
                <h3>No posts found</h3>
                <p>
                  {searchQuery
                    ? `No posts match your search for "${searchQuery}"`
                    : "Be the first to create content in this category"}
                </p>
                <Link to="/write" className="write-btn">
                  Write Your First Post
                </Link>
              </div>
            ) : (
              filteredPosts.map((post) => (
                <div className="post" key={post.id}>
                  <div className="img-container">
                    <div className="img">
                      <img
                        src={post.img || "/default-image.png"}
                        alt={`Image for ${post.title}`}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "/default-image.jpg";
                        }}
                      />
                    </div>
                    <div
                      className="category-tag"
                      style={{ backgroundColor: getCategoryColor(post.category) }}
                    >
                      {post.category.charAt(0).toUpperCase() +
                        post.category.slice(1)}
                    </div>
                  </div>

                  <div className="content">
                    <div className="post-meta">
                      <span className="date">
                        <FaCalendarAlt className="icon" />
                        {new Date(post.date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                    <Link className="link" to={`/post/${post.id}`}>
                      <h1>{post.title}</h1>
                      <div
                        className="post-description"
                        dangerouslySetInnerHTML={{
                          __html: truncateHtml(post.description, 100),
                        }}
                      />
                    </Link>
                    <div className="read-more">
                      <Link to={`/post/${post.id}`} className="read-more-btn">
                        Read Full Article <FaArrowRight className="arrow-icon" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;