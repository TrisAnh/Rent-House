import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { FaUserCircle, FaClock, FaCalendarAlt, FaTags } from "react-icons/fa";

const BlogDetail = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlogDetail = async () => {
      try {
        const response = await axios.get(
          `https://be-android-project.onrender.com/api/blog/${id}`
        );
        setBlog(response.data);
        setLoading(false);
      } catch (err) {
        setError("Không thể tải bài viết. Vui lòng thử lại sau.");
        setLoading(false);
      }
    };

    fetchBlogDetail();
  }, [id]);

  const estimateReadingTime = (content) => {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / wordsPerMinute);
    return readingTime;
  };

  const styles = {
    container: {
      maxWidth: "800px",
      margin: "0 auto",
      padding: "40px 20px",
      fontFamily: "Arial, sans-serif",
    },
    header: {
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      color: "white",
      padding: "40px 20px",
      borderRadius: "10px",
      marginBottom: "30px",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    },
    title: {
      fontSize: "2.5rem",
      fontWeight: "bold",
      marginBottom: "20px",
      lineHeight: 1.2,
    },
    meta: {
      display: "flex",
      flexWrap: "wrap",
      gap: "20px",
      fontSize: "0.9rem",
      color: "rgba(255, 255, 255, 0.8)",
    },
    metaItem: {
      display: "flex",
      alignItems: "center",
    },
    icon: {
      marginRight: "5px",
    },
    content: {
      fontSize: "1.1rem",
      lineHeight: 1.8,
      color: "#333",
    },
    tags: {
      display: "flex",
      flexWrap: "wrap",
      gap: "10px",
      marginTop: "30px",
    },
    tag: {
      background: "#e0e0e0",
      padding: "5px 10px",
      borderRadius: "20px",
      fontSize: "0.9rem",
      color: "#333",
    },
    loading: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "50vh",
      fontSize: "1.2rem",
      color: "#666",
    },
    error: {
      color: "red",
      textAlign: "center",
      fontSize: "1.2rem",
      marginTop: "50px",
    },
  };

  if (loading) {
    return <div style={styles.loading}>Đang tải bài viết...</div>;
  }

  if (error) {
    return <div style={styles.error}>{error}</div>;
  }

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>{blog?.title}</h1>
        <div style={styles.meta}>
          <div style={styles.metaItem}>
            <FaUserCircle style={styles.icon} />
            <span>{blog?.author || "Anonymous"}</span>
          </div>
          <div style={styles.metaItem}>
            <FaCalendarAlt style={styles.icon} />
            <span>
              {new Date(blog?.createdAt).toLocaleDateString("vi-VN", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
          <div style={styles.metaItem}>
            <FaClock style={styles.icon} />
            <span>{estimateReadingTime(blog?.content)} phút đọc</span>
          </div>
        </div>
      </header>

      <article style={styles.content}>
        {blog?.content.split("\n").map((paragraph, index) => (
          <p key={index} style={{ marginBottom: "20px" }}>
            {paragraph}
          </p>
        ))}
      </article>

      {blog?.tags && blog.tags.length > 0 && (
        <div style={styles.tags}>
          <FaTags style={{ ...styles.icon, marginRight: "10px" }} />
          {blog.tags.map((tag, index) => (
            <span key={index} style={styles.tag}>
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default BlogDetail;
