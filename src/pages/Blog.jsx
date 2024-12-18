import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FaRegClock,
  FaUserCircle,
  FaRegBookmark,
  FaChevronRight,
  FaRegCommentDots,
} from "react-icons/fa";

const Blog = () => {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [blogsPerPage] = useState(6);
  const [hoveredCard, setHoveredCard] = useState(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get(
          "https://be-android-project.onrender.com/api/blog/getAll"
        );
        setBlogs(response.data);
        setLoading(false);
      } catch (err) {
        setError("Không thể tải bài viết. Vui lòng thử lại sau.");
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const indexOfLastBlog = page * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = blogs.slice(indexOfFirstBlog, indexOfLastBlog);
  const pageCount = Math.ceil(blogs.length / blogsPerPage);

  const handleBlogClick = (blogId) => {
    navigate(`/blog/${blogId}`);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Generate a gradient background when no image is available
  const getGradientBackground = (index) => {
    const gradients = [
      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      "linear-gradient(135deg, #2980b9 0%, #6dd5fa 100%)",
      "linear-gradient(135deg, #f6d365 0%, #fda085 100%)",
      "linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)",
      "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
      "linear-gradient(135deg, #d299c2 0%, #fef9d7 100%)",
    ];
    return gradients[index % gradients.length];
  };

  const styles = {
    container: {
      maxWidth: "1200px",
      margin: "0 auto",
      padding: "40px 20px",
      backgroundColor: "#f8fafc",
      minHeight: "100vh",
    },
    header: {
      textAlign: "center",
      marginBottom: "50px",
      color: "#1e3a8a",
      fontSize: "2.5rem",
      fontWeight: "800",
      lineHeight: "1.2",
      padding: "0 20px",
    },
    headerHighlight: {
      color: "#3b82f6",
    },
    grid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
      gap: "30px",
      padding: "0 10px",
    },
    card: (isHovered) => ({
      backgroundColor: "#ffffff",
      borderRadius: "16px",
      overflow: "hidden",
      boxShadow: isHovered
        ? "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
        : "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
      transition: "all 0.3s ease",
      cursor: "pointer",
      transform: isHovered ? "translateY(-5px)" : "none",
      border: "1px solid #e5e7eb",
    }),
    cardHeader: (index) => ({
      height: "200px",
      background: getGradientBackground(index),
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px",
      color: "#ffffff",
      fontSize: "1.5rem",
      fontWeight: "600",
      textAlign: "center",
      textShadow: "0 2px 4px rgba(0,0,0,0.1)",
    }),
    cardBody: {
      padding: "24px",
    },
    cardTitle: {
      fontSize: "1.25rem",
      fontWeight: "700",
      color: "#1e293b",
      marginBottom: "12px",
      lineHeight: "1.4",
    },
    cardExcerpt: {
      fontSize: "0.975rem",
      color: "#64748b",
      lineHeight: "1.6",
      marginBottom: "20px",
      display: "-webkit-box",
      WebkitLineClamp: "3",
      WebkitBoxOrient: "vertical",
      overflow: "hidden",
    },
    cardMeta: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "16px 24px",
      borderTop: "1px solid #e5e7eb",
      backgroundColor: "#f8fafc",
    },
    metaItem: {
      display: "flex",
      alignItems: "center",
      color: "#64748b",
      fontSize: "0.875rem",
    },
    icon: {
      marginRight: "6px",
      fontSize: "1rem",
    },
    pagination: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      marginTop: "50px",
      gap: "8px",
    },
    pageButton: (isActive) => ({
      padding: "8px 16px",
      border: "none",
      borderRadius: "8px",
      backgroundColor: isActive ? "#3b82f6" : "#e2e8f0",
      color: isActive ? "#ffffff" : "#1e293b",
      cursor: "pointer",
      transition: "all 0.2s ease",
      fontWeight: isActive ? "600" : "500",
      ":hover": {
        backgroundColor: isActive ? "#2563eb" : "#cbd5e1",
      },
    }),
    loadingOrError: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "60vh",
      fontSize: "1.25rem",
      color: "#64748b",
    },
  };

  if (loading) {
    return <div style={styles.loadingOrError}>Đang tải bài viết...</div>;
  }

  if (error) {
    return <div style={styles.loadingOrError}>{error}</div>;
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>
        Tin tức thị trường &
        <span style={styles.headerHighlight}> Chia sẻ kinh nghiệm </span>
        Bất động sản
      </h1>

      <div style={styles.grid}>
        {currentBlogs.map((blog, index) => (
          <div
            key={blog._id}
            style={styles.card(hoveredCard === blog._id)}
            onClick={() => handleBlogClick(blog._id)}
            onMouseEnter={() => setHoveredCard(blog._id)}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div style={styles.cardHeader(index)}>
              <FaRegBookmark size={30} />
            </div>

            <div style={styles.cardBody}>
              <h2 style={styles.cardTitle}>{blog.title}</h2>
              <p style={styles.cardExcerpt}>
                {blog.content.length > 150
                  ? `${blog.content.substring(0, 150)}...`
                  : blog.content}
              </p>
            </div>

            <div style={styles.cardMeta}>
              <div style={styles.metaItem}>
                <FaUserCircle style={styles.icon} />
                <span>Anonymous</span>
              </div>
              <div style={styles.metaItem}>
                <FaRegClock style={styles.icon} />
                <span>
                  {new Date(blog.createdAt).toLocaleDateString("vi-VN", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
              <div style={styles.metaItem}>
                <FaRegCommentDots style={styles.icon} />
                <span>0</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={styles.pagination}>
        {Array.from({ length: pageCount }, (_, i) => i + 1).map((pageNum) => (
          <button
            key={pageNum}
            onClick={() => handlePageChange(pageNum)}
            style={styles.pageButton(page === pageNum)}
          >
            {pageNum}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Blog;
