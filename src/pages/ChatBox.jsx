import React, { useState, useRef, useEffect } from "react";
import { MessageCircle, Send, X } from "lucide-react";
import { createChat } from "../api/chat";
import { useAuth } from "../hooks/useAuth";
import { getPostById } from "../api/post";
import { useParams } from "react-router-dom";
import { createMessage } from "../api/message";
import { getMessagesByChatId } from "../api/message";
import { io } from "socket.io-client";

const buttonStyle = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "0.375rem",
  fontSize: "0.875rem",
  fontWeight: "500",
  height: "2.5rem",
  paddingLeft: "1rem",
  paddingRight: "1rem",
  backgroundColor: "#3b82f6",
  color: "white",
  border: "none",
  cursor: "pointer",
};

const iconButtonStyle = {
  ...buttonStyle,
  padding: "0.5rem",
  borderRadius: "9999px",
};

const textareaStyle = {
  width: "100%",
  padding: "0.5rem",
  borderRadius: "0.375rem",
  border: "1px solid #d1d5db",
  marginBottom: "0.5rem",
};

const socket = io("https://be-android-project.onrender.com");
export default function ChatBox() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const messagesEndRef = useRef(null);
  const { id } = useParams();
  const toggleChat = () => setIsOpen(!isOpen);
  const [landlord, setLandlord] = useState(null);
  const { user } = useAuth(); // Lấy thông tin người dùng từ hook
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [chatId, setChatId] = useState(null);

  useEffect(() => {
    if (chatId) {
      socket.emit("joinChat", chatId);
    }
  }, [chatId]);

  useEffect(() => {
    socket.on("receiveMessage", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, []);

  const fetchMessages = async (chatId) => {
    try {
      const response = await getMessagesByChatId(chatId);
      setMessages(response.data);
      console.log("Tất cả tin nhắn", response.data);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  useEffect(() => {
    const fetchPostDetails = async () => {
      try {
        const response = await getPostById(id);
        setLandlord(response.data.landlord);
      } catch (err) {
        setError("Không thể tải thông tin bài đăng.");
      } finally {
        setLoading(false);
      }
    };

    fetchPostDetails();
  }, [id]);

  useEffect(() => {
    if (landlord) {
      const requestData = {
        firstUserId : user?.id, // Kiểm tra nếu user tồn tại
        secondUserId: landlord,
      };
      createChat(requestData).then((chatResponse) => {
        const chatId = chatResponse.data._id;
        console.log("Chat Id: ", chatResponse.data._id);
        setChatId(chatId);
        fetchMessages(chatId);
      });
    }
  }, [landlord]);

  const handleSendMessage = async () => {
    if (inputMessage.trim()) {
      const newMessage = { text: inputMessage, isUser: true };
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setInputMessage("");

      const messageData = {
        chatId: chatId,
        sender: user?.id, // Kiểm tra nếu user tồn tại
        content: inputMessage,
      };

      try {
        const response = await createMessage(messageData);
        console.log("Tin nhắn đã gửi", response);
      } catch (error) {
        console.error("Có lỗi xảy ra khi gửi tin nhắn:", error);
      }
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Nếu chưa đăng nhập, không hiển thị chat box
  if (!user) {
    return null;
  }
  return (
    <div
      style={{ position: "fixed", bottom: "1rem", right: "1rem", zIndex: 50 }}
    >
      {isOpen ? (
        <div
          style={{
            backgroundColor: "white",
            border: "1px solid #e5e7eb",
            borderRadius: "0.5rem",
            boxShadow:
              "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
            width: "20rem",
            maxWidth: "100%",
            transition: "all 0.3s ease-in-out",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "1rem",
              borderBottom: "1px solid #e5e7eb",
            }}
          >
            <h2 style={{ fontSize: "1.125rem", fontWeight: "600" }}>
              Chat with us
            </h2>
            <button
              onClick={toggleChat}
              style={{
                ...iconButtonStyle,
                backgroundColor: "transparent",
                color: "#4b5563",
              }}
            >
              <X size={24} />
            </button>
          </div>
          <div style={{ height: "20rem", overflowY: "auto", padding: "1rem" }}>
            {messages.length === 0 ? (
              <div>Không có tin nhắn nào.</div>
            ) : (
              messages.map((msg, index) => {
                const isCurrentUser = msg.sender === user.id;

                return (
                  <div
                    key={index}
                    style={{
                      display: "flex",
                      justifyContent: isCurrentUser ? "flex-end" : "flex-start",
                      marginBottom: "1rem",
                    }}
                  >
                    <div
                      style={{
                        padding: "0.5rem 1rem",
                        borderRadius: "1rem",
                        backgroundColor: isCurrentUser ? "#3b82f6" : "#e5e7eb",
                        color: isCurrentUser ? "white" : "black",
                        maxWidth: "70%",
                        wordWrap: "break-word",
                      }}
                    >
                      {msg.content}
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          <div style={{ padding: "1rem", borderTop: "1px solid #e5e7eb" }}>
            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Type your message..."
              style={textareaStyle}
            />
            <button
              onClick={handleSendMessage}
              style={{ ...buttonStyle, width: "100%" }}
            >
              <Send size={16} style={{ marginRight: "0.5rem" }} /> Gửi
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={toggleChat}
          style={{
            ...iconButtonStyle,
            width: "3rem",
            height: "3rem",
            boxShadow:
              "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
          }}
        >
          <MessageCircle size={24} />
        </button>
      )}
    </div>
  );
}
