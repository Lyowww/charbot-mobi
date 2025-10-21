"use client";
import { useState, KeyboardEvent } from 'react';

interface Message {
  sender: 'user' | 'bot';
  text: string;
}

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState('');

  const toggleChat = () => {
    setIsOpen(prev => !prev);
  };

  const handleUserInput = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && userInput.trim()) {
      setMessages([...messages, { sender: 'user', text: userInput }]);
      setUserInput('');
      setTimeout(() => {
        setMessages(prevMessages => [
          ...prevMessages,
          { sender: 'bot', text: 'How can I help you today?' },
        ]);
      }, 1000);
    }
  };

  return (
    <>
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            bottom: 20,
            right: 20,
            width: 300,
            height: 400,
            backgroundColor: '#f4f4f4',
            borderRadius: 8,
            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div
            style={{
              backgroundColor: '#333',
              color: 'white',
              padding: '10px',
              borderRadius: '8px 8px 0 0',
              cursor: 'pointer',
            }}
            onClick={toggleChat}
          >
            Chatbot
          </div>
          <div
            style={{
              flex: 1,
              padding: '10px',
              overflowY: 'auto',
              backgroundColor: '#fff',
              borderBottom: '1px solid #ccc',
            }}
          >
            {messages.map((msg, idx) => (
              <div key={idx} style={{ textAlign: msg.sender === 'bot' ? 'left' : 'right' }}>
                <span
                  style={{
                    backgroundColor: msg.sender === 'bot' ? '#e0e0e0' : '#007bff',
                    color: msg.sender === 'bot' ? '#333' : '#fff',
                    padding: '8px',
                    borderRadius: '4px',
                    display: 'inline-block',
                    marginBottom: '10px',
                  }}
                >
                  {msg.text}
                </span>
              </div>
            ))}
          </div>
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={handleUserInput}
            placeholder="Type a message..."
            style={{
              padding: '10px',
              border: 'none',
              borderTop: '1px solid #ccc',
              width: '100%',
              boxSizing: 'border-box',
            }}
          />
        </div>
      )}

      {!isOpen && (
        <div
          style={{
            position: 'fixed',
            bottom: 20,
            right: 20,
            backgroundColor: '#007bff',
            color: 'white',
            padding: '10px',
            borderRadius: '50%',
            cursor: 'pointer',
            fontSize: '20px',
          }}
          onClick={toggleChat}
        >
          💬
        </div>
      )}
    </>
  );
};

export default Chatbot;
