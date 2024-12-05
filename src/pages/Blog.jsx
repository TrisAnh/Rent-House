import React, { useState, useEffect } from "react";
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Box,
  Pagination,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Blog = () => {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [blogsPerPage] = useState(6);
  const indexOfLastBlog = page * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = blogs.slice(indexOfFirstBlog, indexOfLastBlog);
  const pageCount = Math.ceil(blogs.length / blogsPerPage);

  const handleBlogClick = (blogId) => {
    navigate(`/blog/${blogId}`);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

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

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="80vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="80vh"
      >
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4 }}>
        Tin tức thị trường, chia sẻ kinh nghiệm Bất động sản
      </Typography>

      <Grid container spacing={4}>
        {currentBlogs.map((blog) => (
          <Grid item xs={12} md={6} key={blog._id}>
            <Card
              onClick={() => handleBlogClick(blog._id)}
              sx={{
                cursor: "pointer",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                transition: "0.3s",
                "&:hover": {
                  transform: "translateY(-5px)",
                  boxShadow: 3,
                },
              }}
            >
              <CardContent>
                <Typography
                  variant="h6"
                  component="h2"
                  gutterBottom
                  sx={{ fontWeight: "bold" }}
                >
                  {blog.title}
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 2 }}
                >
                  {blog.content.length > 200
                    ? `${blog.content.substring(0, 200)}...`
                    : blog.content}
                </Typography>

                <Typography variant="caption" color="text.secondary">
                  {new Date(blog.createdAt).toLocaleDateString("vi-VN", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <Pagination
          count={pageCount}
          page={page}
          onChange={handlePageChange}
          color="primary"
          size="large"
        />
      </Box>
    </Container>
  );
};

export default Blog;
