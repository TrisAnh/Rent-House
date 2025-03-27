import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../hooks/useAuth";

const MOCK_CONVERSATIONS = [
  {
    id: "1",
    name: "Nguyễn Văn A",
    lastMessage: "Xin chào, tôi quan tâm đến phòng trọ của bạn",
    unread: 2,
    avatar: null,
  },
  {
    id: "2",
    name: "Trần Thị B",
    lastMessage: "Phòng còn trống không?",
    unread: 0,
    avatar: null,
  },
  {
    id: "3",
    name: "Lê Văn C",
    lastMessage: "Cảm ơn bạn đã trả lời",
    unread: 1,
    avatar: null,
  },
];

const MOCK_MESSAGES = {
  1: [
    {
      id: "m1",
      text: "Xin chào, tôi quan tâm đến phòng trọ của bạn",
      sender: "them",
      timestamp: new Date(Date.now() - 3600000),
    },
    {
      id: "m2",
      text: "Phòng có sẵn để xem không?",
      sender: "them",
      timestamp: new Date(Date.now() - 3500000),
    },
    {
      id: "m3",
      text: "Vâng, bạn có thể đến xem vào ngày mai",
      sender: "me",
      timestamp: new Date(Date.now() - 3400000),
    },
  ],
  2: [
    {
      id: "m1",
      text: "Phòng còn trống không?",
      sender: "them",
      timestamp: new Date(Date.now() - 86400000),
    },
  ],
  3: [
    {
      id: "m1",
      text: "Tôi muốn hỏi về giá cả",
      sender: "them",
      timestamp: new Date(Date.now() - 172800000),
    },
    {
      id: "m2",
      text: "Giá phòng là 3 triệu/tháng, đã bao gồm điện nước",
      sender: "me",
      timestamp: new Date(Date.now() - 172700000),
    },
    {
      id: "m3",
      text: "Cảm ơn bạn đã trả lời",
      sender: "them",
      timestamp: new Date(Date.now() - 172600000),
    },
  ],
};

const ChatMessenger = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [conversations, setConversations] = useState(MOCK_CONVERSATIONS);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  useEffect(() => {
    const handleToggleChat = () => {
      setIsOpen((prev) => !prev);
    };

    window.addEventListener("toggleChat", handleToggleChat);
    return () => window.removeEventListener("toggleChat", handleToggleChat);
  }, []);

  useEffect(() => {
    if (activeConversation) {
      setMessages(MOCK_MESSAGES[activeConversation.id] || []);
    }
  }, [activeConversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = () => {
    if (newMessage.trim() === "" || !activeConversation) return;

    const newMsg = {
      id: `m${Date.now()}`,
      text: newMessage,
      sender: "me",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newMsg]);

    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === activeConversation.id
          ? { ...conv, lastMessage: newMessage, unread: 0 }
          : conv
      )
    );

    setNewMessage("");
  };

  const formatTime = (date) => {
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
          {activeConversation ? activeConversation.name : "Tin nhắn"}
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
                  key={conversation.id}
                  style={{
                    ...styles.conversationItem,
                    backgroundColor:
                      activeConversation?.id === conversation.id
                        ? "#e6f2ff"
                        : "transparent",
                  }}
                  onClick={() => setActiveConversation(conversation)}
                >
                  <div style={styles.avatar}>
                    <span>{conversation.name.charAt(0)}</span>
                  </div>
                  <div style={styles.conversationInfo}>
                    <div style={styles.conversationName}>
                      {conversation.name}
                    </div>
                    <div style={styles.conversationLastMessage}>
                      {conversation.lastMessage}
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
            <div style={styles.messagesContainer}>
              <div style={styles.messagesList}>
                {messages.map((message) => (
                  <div
                    key={message.id}
                    style={{
                      ...styles.messageContainer,
                      alignSelf:
                        message.sender === "me" ? "flex-end" : "flex-start",
                    }}
                  >
                    <div
                      style={{
                        ...styles.messageBubble,
                        ...(message.sender === "me"
                          ? styles.myBubble
                          : styles.theirBubble),
                      }}
                    >
                      {message.text}
                    </div>
                    <div style={styles.messageTime}>
                      {formatTime(message.timestamp)}
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
      )}
    </div>
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
    flexDirection: "column",
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
