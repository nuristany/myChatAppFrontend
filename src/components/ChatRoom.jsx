

import React, { useState, useEffect, useRef } from "react";

const ChatRoom = ({ token, username }) => {
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [typingUser, setTypingUser] = useState("");
  const wsRef = useRef(null);
  const chatLogRef = useRef(null);
  const typingTimeoutRef = useRef(null); // useRef for typingTimeout

  useEffect(() => {
    const fetchUUIDAndConnect = async () => {
      if (
        wsRef.current &&
        (wsRef.current.readyState === WebSocket.OPEN ||
          wsRef.current.readyState === WebSocket.CONNECTING)
      ) {
        return;
      }

      try {
        const response = await fetch(
          "https://web-production-1cf3.up.railway.app/auth_for_ws_connection/",
          // "http://127.0.0.1:8000/auth_for_ws_connection/",
          {
            method: "GET",
            headers: {
              Authorization: `JWT ${token}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          const ticketUUID = data.uuid;
          // const wsUrl = `ws://localhost:8000/ws/chat/general/?uuid=${ticketUUID}`;
       
          const wsUrl = `wss://web-production-1cf3.up.railway.app/ws/chat/general/?uuid=${ticketUUID}`;


          const chatSocket = new WebSocket(wsUrl);
          wsRef.current = chatSocket;

          chatSocket.onopen = () => {
            console.log("WebSocket connection established");
          };

          chatSocket.onmessage = (e) => {
            const data = JSON.parse(e.data);
            if (data.message) {
              // Avoid adding the same message multiple times
              setMessages((prevMessages) => {
                if (!prevMessages.includes(data.message)) {
                  return [...prevMessages, data.message];
                }
                return prevMessages;
              });

              // Auto-scroll to the bottom
              if (chatLogRef.current) {
                chatLogRef.current.scrollTop =
                  chatLogRef.current.scrollHeight;
              }
            } else if (data.user_typing && data.user_typing !== username) {
              setTypingUser(`${data.user_typing} is typing...`);
              clearTimeout(typingTimeoutRef.current);
              typingTimeoutRef.current = setTimeout(() => setTypingUser(""), 3000); // Adjusted timeout duration
            }
          };

          chatSocket.onclose = (e) => {
            console.log("WebSocket connection closed:", e);
            wsRef.current = null;
            setTimeout(fetchUUIDAndConnect, 2000);
          };

          chatSocket.onerror = (e) => {
            console.error("WebSocket error observed:", e);
          };
        } else {
          console.error(
            "Failed to fetch UUID:",
            response.status,
            await response.text()
          );
        }
      } catch (error) {
        console.error("Error fetching UUID or connecting to WebSocket:", error);
      }
    };

    fetchUUIDAndConnect();

    // Clean up WebSocket connection on component unmount
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
      clearTimeout(typingTimeoutRef.current); // Clean up the timeout on unmount
    };
  }, [token, username]);

  const handleSendMessage = () => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ message: messageInput }));
      setMessageInput("");
    } else {
      console.error(
        "WebSocket is not open. Current state:",
        wsRef.current?.readyState
      );
    }
  };

  const handleMessageInputChange = (e) => {
    setMessageInput(e.target.value);
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ typing: username }));
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <div className="chat-container">
      <div id="chat-log" ref={chatLogRef} className="chat-log">
        {messages.map((msg, index) => (
          <div key={index} className="chat-message">
            {msg}
          </div>
        ))}
        {typingUser && <div className="typing-indicator">{typingUser}</div>}
      </div>
      <div className="chat-input-container">
        <input
          id="chat-message-input"
          type="text"
          placeholder="Type your message..."
          value={messageInput}
          onChange={handleMessageInputChange}
          onKeyDown={handleKeyPress}
          disabled={
            !wsRef.current || wsRef.current.readyState !== WebSocket.OPEN
          }
          className="chat-input"
        />
        <button
          id="chat-message-submit"
          onClick={handleSendMessage}
          disabled={
            !wsRef.current || wsRef.current.readyState !== WebSocket.OPEN
          }
          className="send-button"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatRoom;

