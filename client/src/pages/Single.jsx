import { FaRegEdit, FaRegClock, FaRegCommentAlt, FaUserAlt } from "react-icons/fa";
import { MdDeleteSweep } from "react-icons/md";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import moment from "moment";
import { AuthContext } from "../context/authContext";
import Menu from "../components/Menu";

const Single = () => {
  const [error, setError] = useState(null);
  const [post, setPost] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { id } = useParams();
  const { currentUser } = useContext(AuthContext);

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this post?"
    );
    if (!confirmed) return;
    try {
      const response = await fetch(`http://localhost:8800/api/posts/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        setError("Failed to delete post");
        return;
      }

      navigate("/");
    } catch (error) {
      setError("An error occurred while deleting post");
    }
  };

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetch(`http://localhost:8800/api/posts/${id}`);

        if (!response.ok) {
          setError("Failed to fetch post");
          setIsLoading(false);
          return;
        }

        const data = await response.json();
        setPost(data);
      } catch (error) {
        setError("An error occurred while fetching post");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  return (
    <div className="single">
      <div className="container">
        {error && <div className="error-banner">{error}</div>}
        
        <div className="content-wrapper">
          {isLoading ? (
            <div className="loading">
              <div className="spinner"></div>
              <p>Loading post...</p>
            </div>
          ) : (
            <>
              <div className="content">
                {/* Article Header */}
                <div className="article-header">
                  <div 
                    className="category-badge" 
                    style={{ 
                      backgroundColor: getCategoryColor(post?.category),
                      color: getTextColor(post?.category)
                    }}
                  >
                    {post?.category}
                  </div>
                  <h1 className="title">{post?.title}</h1>

                  <div className="meta-info">
                    <div className="author-info">
                      {post?.userImg ? (
                        <img
                          src={post.userImg}
                          alt={post?.username}
                          className="author-avatar"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.parentNode.innerHTML = '<div class="avatar-fallback"><FaUserAlt /></div>';
                          }}
                        />
                      ) : (
                        <div className="avatar-fallback">
                          <FaUserAlt />
                        </div>
                      )}
                      <div className="author-details">
                        <span className="author-name">{post?.username}</span>
                        <div className="post-meta">
                          <span>
                            <FaRegClock className="icon" />
                            {moment(post?.date).format("MMM D, YYYY")}
                          </span>
                          <span>
                            <FaRegCommentAlt className="icon" />
                            {Math.ceil((post?.description || "").length / 1200)} min read
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Admin Actions */}
                    {currentUser?.username === post?.username && (
                      <div className="actions">
                        <div className="admin-actions">
                          <Link
                            className="edit"
                            to={`/write?edit=1&id=${post.id}`}
                            state={post}
                          >
                            <FaRegEdit />
                            <span>Edit</span>
                          </Link>
                          <button onClick={handleDelete} className="delete">
                            <MdDeleteSweep />
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Featured Image */}
                {post.img && (
                  <div className="featured-image">
                    <img
                      src={post.img}
                      alt={`Featured image for ${post?.title}`}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.parentNode.innerHTML = '<div class="image-error">Image failed to load</div>';
                      }}
                    />
                  </div>
                )}

                {/* Article Content */}
                <div className="article-content">
                  <div 
                    className="post-description" 
                    dangerouslySetInnerHTML={{ __html: post?.description || "" }} 
                  />
                </div>
              </div>

              <Menu category={post.category} />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// Helper functions for category styling
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

const getTextColor = (category) => {
  const darkCategories = ['technology', 'science'];
  return darkCategories.includes(category) ? '#fff' : '#000';
};

export default Single;