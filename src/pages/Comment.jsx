import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEdit,
  faTrash,
  faReply,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import {
  createComment,
  deleteComment,
  getCommentByPostId,
  updateComment,
} from "../api/comments";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const Comments = ({ listingId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editContent, setEditContent] = useState("");
  const { id } = useParams();
  const { user } = useAuth();
  const [houseInfo, setHouseInfo] = useState(null);

  useEffect(() => {
    const loadComments = async () => {
      try {
        const fetchedComments = await getCommentByPostId(id);
        if (Array.isArray(fetchedComments.data)) {
          const formattedComments = fetchedComments.data.map((comment) => ({
            id: comment._id,
            comment: comment.comment,
            username: comment.user.username,
            rating: comment.rating,
            createdAt: comment.createdAt,
            updatedAt: comment.updatedAt,
            house: comment.house._id,
          }));
          setComments(formattedComments);
          if (fetchedComments.data.length > 0) {
            const house = fetchedComments.data[0].house;
            setHouseInfo(house);
          }
        } else {
          setComments([]);
        }
      } catch (error) {
        console.error("Error fetching comments:", error);
        setComments([]);
      }
    };
    loadComments();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newComment.trim() && houseInfo && houseInfo._id && user && user.id) {
      try {
        const newCommentData = {
          id: Math.random().toString(36).substring(7),
          comment: newComment,
          username: user.username,
          rating: 5,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        setComments((prevComments) => [...prevComments, newCommentData]);

        const addedComment = await createComment({
          user: user.id,
          house: houseInfo._id,
          comment: newComment,
          rating: 5,
        });

        // Nếu muốn đồng bộ hóa dữ liệu từ server (cập nhật lại bình luận đã gửi)
        setComments((prevComments) =>
          prevComments.map((comment) =>
            comment.id === newCommentData.id
              ? { ...comment, id: addedComment._id }
              : comment
          )
        );

        setNewComment("");
      } catch (error) {
        console.error("Error adding comment:", error);
      }
    } else {
      console.log("houseInfo, user, or required properties are undefined");
      console.log("House Info:", houseInfo);
      console.log("User:", user);
    }
  };

  const handleEdit = (id, content) => {
    setEditingId(id);
    setEditContent(content);
  };

  const handleUpdate = async (id) => {
    try {
      const updatedData = {
        user: user.id,
        house: houseInfo._id,
        rating: 5,
        comment: editContent,
      };

      const response = await updateComment(id, updatedData);

      setComments((prevComments) =>
        prevComments.map((comment) =>
          comment.id === id ? { ...comment, comment: editContent } : comment
        )
      );

      setEditingId(null);
      setEditContent("");
    } catch (error) {
      console.error("Error updating comment:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const result = await deleteComment(id);

      if (result) {
        setComments((prevComments) =>
          prevComments.filter((comment) => comment.id !== id)
        );
        alert("Bình luận đã được xóa thành công");
      } else {
        alert("Không thể xóa bình luận");
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
      alert("Đã xảy ra lỗi khi xóa bình luận");
    }
  };

  return (
    <div className="comments-section">
      <h3 className="comments-title">Bình luận</h3>
      <form onSubmit={handleSubmit} className="comment-form">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Thêm bình luận của bạn..."
          className="comment-input"
        />
        <button type="submit" className="submit-button">
          Gửi
        </button>
      </form>
      <div className="comments-list">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div
              key={`${comment._id}-${comment.createdAt}`}
              className="comment"
            >
              <div className="comment-header">
                <FontAwesomeIcon icon={faUser} className="user-icon" />
                <span className="username">{comment.username}</span>
                <span className="comment-date">
                  {new Date(comment.createdAt).toLocaleString("vi-VN")}
                </span>
              </div>
              {editingId === comment.id ? (
                <div className="edit-form">
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="edit-input"
                  />
                  <button
                    onClick={() => handleUpdate(comment.id)}
                    className="update-button"
                  >
                    Cập nhật
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="cancel-button"
                  >
                    Hủy
                  </button>
                </div>
              ) : (
                <p className="comment-content">{comment.comment}</p>
              )}
              <div className="comment-actions">
                <button
                  onClick={() => handleEdit(comment.id, comment.comment)}
                  className="action-button"
                >
                  <FontAwesomeIcon icon={faEdit} /> Sửa
                </button>
                <button
                  onClick={() => handleDelete(comment.id)}
                  className="action-button delete"
                >
                  <FontAwesomeIcon icon={faTrash} /> Xóa
                </button>
                <button className="action-button">
                  <FontAwesomeIcon icon={faReply} /> Trả lời
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>Chưa có bình luận nào.</p>
        )}
      </div>
      <style>{`
        .comments-section {
          margin-top: 30px;
          background-color: #f8f9fa;
          border-radius: 8px;
          padding: 20px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .comments-title {
          font-size: 24px;
          color: #333;
          margin-bottom: 20px;
          border-bottom: 2px solid #e9ecef;
          padding-bottom: 10px;
        }
        .comment-form {
          margin-bottom: 20px;
        }
        .comment-input {
          width: 100%;
          padding: 10px;
          border: 1px solid #ced4da;
          border-radius: 4px;
          resize: vertical;
          min-height: 100px;
          margin-bottom: 10px;
        }
        .submit-button {
          background-color: #007bff;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 4px;
          cursor: pointer;
          transition: background-color 0.3s;
        }
        .submit-button:hover {
          background-color: #0056b3;
        }
        .comments-list {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .comment {
          background-color: white;
          border-radius: 8px;
          padding: 15px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }
        .comment-header {
          display: flex;
          align-items: center;
          margin-bottom: 10px;
        }
        .user-icon {
          margin-right: 10px;
          color: #6c757d;
        }
        .username {
          font-weight: bold;
          margin-right: 10px;
        }
        .comment-date {
          font-size: 0.8em;
          color: #6c757d;
        }
        .comment-content {
          margin-bottom: 10px;
          line-height: 1.5;
        }
        .comment-actions {
          display: flex;
          gap: 10px;
        }
        .action-button {
          background: none;
          border: none;
          color: #6c757d;
          cursor: pointer;
          font-size: 0.9em;
          display: flex;
          align-items: center;
          gap: 5px;
        }
        .action-button:hover {
          color: #007bff;
        }
        .action-button.delete:hover {
          color: #dc3545;
        }
        .edit-form {
          margin-top: 10px;
        }
        .edit-input {
          width: 100%;
          padding: 10px;
          border: 1px solid #ced4da;
          border-radius: 4px;
          resize: vertical;
          min-height: 80px;
          margin-bottom: 10px;
        }
        .update-button,
        .cancel-button {
          padding: 5px 10px;
          margin-right: 10px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
        .update-button {
          background-color: #28a745;
          color: white;
        }
        .cancel-button {
          background-color: #dc3545;
          color: white;
        }
        .update-button:hover {
          background-color: #218838;
        }
        .cancel-button:hover {
          background-color: #c82333;
        }
      `}</style>
    </div>
  );
};

export default Comments;
