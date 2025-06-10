import { useState, useRef, useEffect } from "react";
import { FaTimes, FaPaperPlane, FaRobot, FaUser } from "react-icons/fa";
import axios from "axios";

const GeminiChatBox = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      text: "Xin chào! Tôi là trợ lý ảo Gemini. Tôi có thể giúp gì cho bạn về việc tìm kiếm phòng trọ?",
      sender: "bot",
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleInputChange = (e) => {
    setInputMessage(e.target.value);
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = { text: inputMessage, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      const response = await axios.post("http://localhost:5000/api/chatbox/gene", {
        message: inputMessage,
      });

      if (response.data && response.data.reply) {
        setMessages((prev) => [
          ...prev,
          { text: response.data.reply, sender: "bot" },
        ]);
      } else {
        console.error("Unexpected response format:", response.data);
        setMessages((prev) => [
          ...prev,
          {
            text: "Có lỗi xảy ra khi xử lý phản hồi.",
            sender: "bot",
          },
        ]);
      }
    } catch (error) {
      console.error("Error sending message to Gemini:", error);
      setMessages((prev) => [
        ...prev,
        {
          text: "Rất tiếc, đã xảy ra lỗi khi xử lý yêu cầu của bạn. Vui lòng thử lại sau.",
          sender: "bot",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      <button
        onClick={toggleChat}
        className={`fixed bottom-4 right-4 z-50 p-4 rounded-full shadow-lg ${isOpen ? "bg-red-500" : "bg-blue-600"
          } text-white transition-all duration-300 hover:scale-110`}
        aria-label={isOpen ? "Close Chat" : "Open Chat"}
      >
        {isOpen ? <FaTimes size={20} /> : <FaRobot size={20} />}
      </button>

      {isOpen && (
        <div className="fixed bottom-20 right-4 z-50 w-80 sm:w-96 h-[500px] bg-white rounded-xl shadow-2xl flex flex-col overflow-hidden border border-gray-200">
          {/* Header */}
          <div className="bg-blue-600 text-white p-4 flex justify-between items-center">
            <div className="flex items-center">
              <FaRobot className="mr-2" size={20} />
              <h3 className="font-bold">Gemini Assistant</h3>
            </div>
            <button
              onClick={toggleChat}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <FaTimes size={18} />
            </button>
          </div>

          {/* Messages Container */}
          <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
            <div className="space-y-4">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"
                    }`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${msg.sender === "user"
                        ? "bg-blue-600 text-white rounded-tr-none"
                        : "bg-gray-200 text-gray-800 rounded-tl-none"
                      }`}
                  >
                    <div className="flex items-center mb-1">
                      {msg.sender === "user" ? (
                        <>
                          <span className="font-medium mr-1">Bạn</span>
                          <FaUser size={12} />
                        </>
                      ) : (
                        <>
                          <span className="font-medium mr-1">Gemini</span>
                          <FaRobot size={12} />
                        </>
                      )}
                    </div>
                    <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-200 text-gray-800 p-3 rounded-lg rounded-tl-none max-w-[80%]">
                    <div className="flex items-center mb-1">
                      <span className="font-medium mr-1">Gemini</span>
                      <FaRobot size={12} />
                    </div>
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "0s" }}></div>
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input Area */}
          <div className="p-3 border-t border-gray-200 bg-white">
            <div className="flex items-center">
              <textarea
                ref={inputRef}
                value={inputMessage}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                placeholder="Nhập tin nhắn..."
                className="flex-1 p-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 max-h-20"
                rows="1"
                disabled={isLoading}
              />
              <button
                onClick={handleSendMessage}
                disabled={isLoading || !inputMessage.trim()}
                className={`ml-2 p-2 rounded-full ${isLoading || !inputMessage.trim()
                    ? "bg-gray-300 text-gray-500"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                  } transition-colors`}
              >
                <FaPaperPlane size={16} />
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1 text-center">
              Được hỗ trợ bởi Gemini AI
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default GeminiChatBox;