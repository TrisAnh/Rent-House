import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../hooks/useAuth";
import axios from "axios";
import { io } from "socket.io-client";

const ChatMessenger = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [socket, setSocket] = useState(null);
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  // Kết nối Socket.io khi component mount
  useEffect(() => {
    const newSocket = io("http://localhost:5000", {
      withCredentials: true,
      transports: ["websocket"],
    });
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  // Xác thực người dùng với Socket.io
  useEffect(() => {
    if (socket && user) {
      socket.emit("authenticate", user.id);
    }
  }, [socket, user]);

  // Lấy danh sách đoạn chat
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/chat/user/${user.id}`);
        setConversations(response.data);
      } catch (error) {
        console.error("Error fetching conversations:", error);
      }
    };

    if (user && isOpen) fetchConversations();
  }, [user, isOpen]);

  // Lấy tin nhắn và thiết lập real-time khi chọn đoạn chat
  useEffect(() => {
    if (!socket || !activeConversation) return;

    const fetchMessages = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/messages/chat/${activeConversation._id}`,
          { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
        );
        setMessages(response.data.messages);
        scrollToBottom();
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();

    // Tham gia phòng chat
    socket.emit("joinChat", activeConversation._id);

    // Lắng nghe tin nhắn mới
    socket.on("receiveMessage", (message) => {
      setMessages((prev) => [...prev, message]);
      scrollToBottom();
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, [socket, activeConversation]);

  // Gửi tin nhắn
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !activeConversation || !socket) return;

    const tempMessage = {
      _id: `temp-${Date.now()}`,
      chatId: activeConversation._id,
      sender: user,
      content: newMessage,
      createdAt: new Date().toISOString(),
    };

    // Optimistic update
    setMessages((prev) => [...prev, tempMessage]);
    setNewMessage("");

    try {
      const response = await axios.post(
        "http://localhost:5000/api/messages/create",
        {
          chatId: activeConversation._id,
          content: newMessage,
          receiverId: getOtherMember(activeConversation)?._id,
        },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );

      // Gửi tin nhắn qua Socket.io
      socket.emit("sendMessage", {
        chatId: activeConversation._id,
        message: response.data.message,
      });
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prev) => prev.filter((msg) => msg._id !== tempMessage._id));
    }
  };

  const getChatName = (chat) => {
    if (!chat?.members || !user) return "Unknown User";
    const otherMember = chat.members.find(member => member._id !== user.id);
    return otherMember?.username || "Unknown User";
  };

  const getOtherMemberAvatar = (chat) => {
    if (!chat?.members || !user) return null;

    const otherMember = chat.members.find(member => member._id !== user.id);

    return otherMember?.avatar?.url || null;
  };

  const getOtherMember = (chat) => {
    if (!chat?.members || !user) return null;
    return chat.members.find((member) => member._id !== user.id);
  };

  const getSenderAvatar = (message) => {
    return message.sender?.avatar?.url || null;
  };

  useEffect(() => {
    const handleToggleChat = () => {
      setIsOpen((prev) => !prev);
    };

    window.addEventListener("toggleChat", handleToggleChat);
    return () => window.removeEventListener("toggleChat", handleToggleChat);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const formatTime = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div
      style={{
        ...styles.chatMessenger,
        transform: isOpen ? "translateX(0)" : "translateX(100%)",
        height: isMinimized ? "50px" : "400px",
      }}
      ref={chatContainerRef}
    >
      {/* Chat Header */}
      <div style={styles.chatHeader}>
        <div style={styles.chatHeaderTitle}>
          {activeConversation ? getChatName(activeConversation) : "Tin nhắn"}
        </div>
        <div style={styles.chatHeaderActions}>
          {activeConversation && (
            <button
              style={styles.headerButton}
              onClick={() => setActiveConversation(null)}
            >
              ←
            </button>
          )}
          <button
            style={styles.headerButton}
            onClick={() => setIsMinimized(!isMinimized)}
          >
            {isMinimized ? "□" : "−"}
          </button>
          <button style={styles.headerButton} onClick={() => setIsOpen(false)}>
            ×
          </button>
        </div>
      </div>

      {/* Chat Body */}
      {!isMinimized && (
        <div style={styles.chatBody}>
          {!activeConversation ? (
            // Conversations List
            <div style={styles.conversationsList}>
              {conversations.map((conversation) => (
                <div
                  key={conversation._id}
                  style={{
                    ...styles.conversationItem,
                    backgroundColor:
                      activeConversation?._id === conversation._id
                        ? "#e6f2ff"
                        : "transparent",
                  }}
                  onClick={() => setActiveConversation(conversation)}
                >
                  <div style={styles.avatar}>
                    {getOtherMemberAvatar(conversation) ? (
                      <img
                        src={getOtherMemberAvatar(conversation)}
                        alt="avatar"
                        style={{
                          width: '100%',
                          height: '100%',
                          borderRadius: '50%',
                          objectFit: 'cover'
                        }}
                      />
                    ) : (
                      <span>{getChatName(conversation)?.charAt(0) || 'U'}</span>
                    )}
                  </div>
                  <div style={styles.conversationInfo}>
                    <div style={styles.conversationName}>
                      {getChatName(conversation)}
                    </div>
                    <div style={styles.conversationLastMessage}>
                      {conversation.lastMessage.content}
                    </div>
                  </div>
                  {conversation.unread > 0 && (
                    <div style={styles.unreadBadge}>
                      <span>{conversation.unread}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            // Messages View
            // Messages View
            // Messages View
            <div style={styles.messagesContainer}>
              <div style={styles.messagesList}>
                {messages.map((message) => (
                  <div
                    key={message._id}
                    style={{
                      ...styles.messageContainer,
                      flexDirection: message.sender._id === user.id ? "row-reverse" : "row",
                      alignSelf: message.sender._id === user.id ? "flex-end" : "flex-start",
                    }}
                  >
                    {/* Avatar (chỉ hiển thị với tin nhắn từ người khác) */}
                    {message.sender._id !== user.id && (
                      <div style={styles.smallAvatar}>
                        {message.sender.avatar?.url ? (
                          <img
                            src={message.sender.avatar.url}
                            alt="avatar"
                            style={styles.avatarImage}
                          />
                        ) : (
                          <span>{message.sender.username?.charAt(0) || 'U'}</span>
                        )}
                      </div>
                    )}

                    {/* Nội dung tin nhắn */}
                    <div
                      style={{
                        ...styles.messageBubble,
                        ...(message.sender._id === user.id ? styles.myBubble : styles.theirBubble),
                      }}
                    >
                      {message.content}
                      <div style={styles.messageTime}>
                        {formatTime(message.createdAt)}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
              <div style={styles.inputContainer}>
                <textarea
                  style={styles.messageInput}
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Nhập tin nhắn..."
                  onKeyPress={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                />
                <button style={styles.sendButton} onClick={handleSendMessage}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="22" y1="2" x2="11" y2="13"></line>
                    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>
      )
      }
    </div >
  );
};

// Inline styles
const styles = {
  chatMessenger: {
    position: "fixed",
    bottom: "20px",
    right: "20px",
    width: "320px",
    height: "400px",
    backgroundColor: "#fff",
    borderRadius: "10px",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.2)",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    zIndex: 1000,
    transition: "transform 0.3s ease, height 0.3s ease",
  },
  chatHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#0056b3",
    color: "white",
    padding: "12px 16px",
  },
  chatHeaderTitle: {
    fontWeight: "bold",
    fontSize: "16px",
  },
  chatHeaderActions: {
    display: "flex",
    gap: "10px",
  },
  headerButton: {
    background: "none",
    border: "none",
    color: "white",
    cursor: "pointer",
    fontSize: "16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 0,
    width: "20px",
    height: "20px",
  },
  chatBody: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  },
  conversationsList: {
    flex: 1,
    overflowY: "auto",
    padding: "10px",
  },
  conversationItem: {
    display: "flex",
    alignItems: "center",
    padding: "10px",
    borderRadius: "8px",
    marginBottom: "5px",
    cursor: "pointer",
    transition: "background-color 0.2s",
  },
  avatar: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    backgroundColor: "#0056b3",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
    fontWeight: "bold",
    marginRight: "10px",
    overflow: "hidden",
  },
  conversationInfo: {
    flex: 1,
    overflow: "hidden",
  },
  conversationName: {
    fontWeight: "bold",
    fontSize: "14px",
    marginBottom: "2px",
  },
  conversationLastMessage: {
    fontSize: "12px",
    color: "#666",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  unreadBadge: {
    backgroundColor: "#e63946",
    width: "20px",
    height: "20px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
    fontSize: "12px",
    fontWeight: "bold",
  },
  messagesContainer: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
  },
  messagesList: {
    flex: 1,
    overflowY: "auto",
    padding: "10px",
    backgroundColor: "#f5f5f5",
    display: "flex",
    flexDirection: "column",
  },
  messageContainer: {
    marginBottom: "10px",
    maxWidth: "80%",
    display: "flex",
    alignItems: "flex-end", // Căn avatar và tin nhắn dưới cùng
    gap: "8px",
  },
  smallAvatar: {
    width: "28px", // Nhỏ hơn avatar trong danh sách chat
    height: "28px",
    borderRadius: "50%",
    backgroundColor: "#e5e5e5",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#333",
    fontWeight: "bold",
    fontSize: "12px",
    flexShrink: 0, // Không bị co lại khi thiếu space
    overflow: "hidden",
  },

  avatarImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },

  messageBubble: {
    padding: "10px",
    borderRadius: "16px",
    maxWidth: "calc(100% - 36px)", // Trừ đi kích thước avatar
    wordWrap: "break-word",
    position: "relative", // Để thời gian có thể absolute
  },

  messageTime: {
    fontSize: "10px",
    color: "#999",
    marginTop: "4px",
    textAlign: "right",
  },

  messageBubble: {
    padding: "10px",
    borderRadius: "16px",
    marginBottom: "2px",
    wordWrap: "break-word",
  },
  myBubble: {
    backgroundColor: "#0056b3",
    color: "white",
    borderBottomRightRadius: "4px",
  },
  theirBubble: {
    backgroundColor: "#e5e5e5",
    color: "#333",
    borderBottomLeftRadius: "4px",
  },
  messageTime: {
    fontSize: "10px",
    color: "#999",
    alignSelf: "flex-end",
  },
  inputContainer: {
    display: "flex",
    alignItems: "center",
    padding: "10px",
    backgroundColor: "white",
    borderTop: "1px solid #eee",
  },
  messageInput: {
    flex: 1,
    border: "1px solid #ddd",
    borderRadius: "20px",
    padding: "8px 12px",
    resize: "none",
    maxHeight: "100px",
    minHeight: "36px",
    fontFamily: "inherit",
    fontSize: "14px",
  },
  sendButton: {
    marginLeft: "10px",
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    backgroundColor: "#f0f0f0",
    border: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    color: "#0056b3",
  },
};

export default ChatMessenger;