import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../shared";
import "./ChatWidget.css";

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput("");

    // Add user message to chat
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setLoading(true);

    try {
      console.log("Sending message to:", `${API_URL}/api/chat`);
      console.log("Message payload:", { prompt: userMessage });
      
      const response = await axios.post(
        `${API_URL}/api/chat`,
        { prompt: userMessage },
        { 
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      console.log("Response received:", response.data);

      // Add AI response to chat
      const aiMessage = response.data.answer || "I received your message but couldn't generate a response.";
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: aiMessage, id: response.data.id },
      ]);
    } catch (error) {
      console.error("Chat error details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        url: `${API_URL}/api/chat`
      });
      
      let errorMessage = "Sorry, there was an error connecting to the chat service. Please try again.";
      
      if (error.response) {
        // Server responded with error status
        if (error.response.status === 404) {
          errorMessage = "Chat service endpoint not found. Please check if the backend is running.";
        } else if (error.response.status === 500) {
          errorMessage = "Server error. Please try again in a moment.";
        } else if (error.response.status === 401 || error.response.status === 403) {
          errorMessage = "Authentication required. Please log in first.";
        } else if (error.response.data?.error) {
          errorMessage = `Error: ${error.response.data.error}`;
        }
      } else if (error.request) {
        // Request made but no response
        errorMessage = `Cannot connect to chat service at ${API_URL}. Is the backend running?`;
      }
      
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: errorMessage,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="chat-widget">
      {/* Chat Window */}
      {isOpen && (
        <div className="chat-window">
          <div className="chat-header">
            <h3>💬 Campus Compass Chat</h3>
            <button className="close-btn" onClick={toggleChat}>
              ✕
            </button>
          </div>

          <div className="chat-messages">
            {messages.length === 0 && (
              <div className="welcome-message">
                <p>
                  👋 Hi! I'm MoneyMate—happy to help with questions about
                  college finances, budgeting, aid, and more. What can I help
                  you with today?
                </p>
                <p className="disclaimer">
                  <small>
                    Disclaimer: Educational guidance only. Please consult a
                    licensed advisor for personalized advice.
                  </small>
                </p>
              </div>
            )}

            {messages.map((msg, index) => (
              <div
                key={index}
                className={`message ${
                  msg.role === "user" ? "user-message" : "ai-message"
                }`}
              >
                <div className="message-content">{msg.content}</div>
              </div>
            ))}

            {loading && (
              <div className="message ai-message">
                <div className="message-content typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <form className="chat-input-form" onSubmit={handleSubmit}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about budgeting, loans, savings..."
              disabled={loading}
              className="chat-input"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="send-btn"
            >
              {loading ? "..." : "→"}
            </button>
          </form>
        </div>
      )}

      {/* Floating Button */}
      <button
        className={`chat-toggle-btn ${isOpen ? "open" : ""}`}
        onClick={toggleChat}
        aria-label="Toggle chat"
      >
        {isOpen ? "✕" : "💬"}
      </button>
    </div>
  );
};

export default ChatWidget;
