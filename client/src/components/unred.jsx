import React, { useState, useEffect } from 'react';
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Logout from "./Logout";
import { BsCircleFill } from "react-icons/bs";

function ChatWindow({ socket, currentChat }) {
  const [unreadMessages, setUnreadMessages] = useState(new Map());
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.on(`new message ${currentChat.id}`, (message) => {
      setMessages([...messages, { ...message, isRead: false }]);
      let count = unreadMessages.get(message.from) || 0;
      count++;
      setUnreadMessages(unreadMessages.set(message.from, count));
    });

    return () => {
      socket.off(`new message ${currentChat.id}`);
    };
  }, [messages, unreadMessages, currentChat, socket]);

  const handleMessageRead = (message) => {
    if (!message.isRead) {
      setMessages(
        messages.map((m) => {
          if (m.id === message.id) {
            return { ...m, isRead: true };
          }
          return m;
        })
      );
      let count = unreadMessages.get(message.from) || 0;
      count--;
      setUnreadMessages(unreadMessages.set(message.from, count));
    }
  };

  return (
    <div>
      {[...unreadMessages.entries()].map(([userId, count]) => (
        <div key={userId} className="unread-messages">
          You have {count} unread messages from {userId}
        </div>
      ))}
      {messages.map((message) => (
        <div
          key={message.id}
          className={`message ${message.isRead ? '' : 'unread'}`}
          onClick={() => handleMessageRead(message)}
        >
          {message.text}
        </div>
      ))}
    </div>
  );
}

export default ChatWindow;
