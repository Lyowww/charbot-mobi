(function() {
  'use strict';

  // Configuration
  const CONFIG = {
    position: 'bottom-right',
    theme: 'light',
    primaryColor: '#007bff',
    textColor: '#333',
    backgroundColor: '#fff',
    borderRadius: '8px',
    width: '300px',
    height: '400px',
    zIndex: 9999
  };

  // Widget state
  let isOpen = false;
  let messages = [];
  let widgetContainer = null;
  let chatContainer = null;
  let inputElement = null;

  // Create widget HTML structure
  function createWidgetHTML() {
    return `
      <div id="chatbot-widget-container" style="
        position: fixed;
        ${CONFIG.position.includes('bottom') ? 'bottom: 20px;' : 'top: 20px;'}
        ${CONFIG.position.includes('right') ? 'right: 20px;' : 'left: 20px;'}
        z-index: ${CONFIG.zIndex};
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        font-size: 14px;
        line-height: 1.4;
      ">
        <!-- Chat Window -->
        <div id="chatbot-window" style="
          width: ${CONFIG.width};
          height: ${CONFIG.height};
          background-color: ${CONFIG.backgroundColor};
          border-radius: ${CONFIG.borderRadius};
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
          display: none;
          flex-direction: column;
          overflow: hidden;
        ">
          <!-- Header -->
          <div style="
            background-color: ${CONFIG.primaryColor};
            color: white;
            padding: 12px 16px;
            font-weight: 600;
            cursor: pointer;
            display: flex;
            justify-content: space-between;
            align-items: center;
          ">
            <span>Chat Assistant</span>
            <span id="chatbot-close" style="font-size: 18px; cursor: pointer;">×</span>
          </div>
          
          <!-- Messages Area -->
          <div id="chatbot-messages" style="
            flex: 1;
            padding: 16px;
            overflow-y: auto;
            background-color: #f8f9fa;
            display: flex;
            flex-direction: column;
            gap: 8px;
          ">
            <div style="
              background-color: ${CONFIG.backgroundColor};
              padding: 8px 12px;
              border-radius: 12px;
              border: 1px solid #e9ecef;
              max-width: 80%;
              align-self: flex-start;
            ">
              Hello! How can I help you today?
            </div>
          </div>
          
          <!-- Input Area -->
          <div style="
            padding: 16px;
            background-color: ${CONFIG.backgroundColor};
            border-top: 1px solid #e9ecef;
          ">
            <div style="display: flex; gap: 8px;">
              <input 
                id="chatbot-input" 
                type="text" 
                placeholder="Type your message..." 
                style="
                  flex: 1;
                  padding: 8px 12px;
                  border: 1px solid #e9ecef;
                  border-radius: 20px;
                  outline: none;
                  font-size: 14px;
                "
              />
              <button 
                id="chatbot-send" 
                style="
                  background-color: ${CONFIG.primaryColor};
                  color: white;
                  border: none;
                  border-radius: 20px;
                  padding: 8px 16px;
                  cursor: pointer;
                  font-size: 14px;
                "
              >
                Send
              </button>
            </div>
          </div>
        </div>
        
        <!-- Toggle Button -->
        <div id="chatbot-toggle" style="
          width: 60px;
          height: 60px;
          background-color: ${CONFIG.primaryColor};
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
          font-size: 24px;
          transition: transform 0.2s ease;
        ">
          💬
        </div>
      </div>
    `;
  }

  // Add message to chat
  function addMessage(text, sender = 'bot') {
    const messagesContainer = document.getElementById('chatbot-messages');
    if (!messagesContainer) return;

    const messageDiv = document.createElement('div');
    messageDiv.style.cssText = `
      background-color: ${sender === 'bot' ? CONFIG.backgroundColor : CONFIG.primaryColor};
      color: ${sender === 'bot' ? CONFIG.textColor : 'white'};
      padding: 8px 12px;
      border-radius: 12px;
      max-width: 80%;
      align-self: ${sender === 'bot' ? 'flex-start' : 'flex-end'};
      border: ${sender === 'bot' ? '1px solid #e9ecef' : 'none'};
      word-wrap: break-word;
    `;
    messageDiv.textContent = text;
    
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    
    messages.push({ text, sender });
  }

  // Handle user input
  function handleUserInput() {
    const input = document.getElementById('chatbot-input');
    if (!input || !input.value.trim()) return;

    const userMessage = input.value.trim();
    addMessage(userMessage, 'user');
    input.value = '';

    // Simulate bot response
    setTimeout(() => {
      const responses = [
        "That's interesting! Can you tell me more?",
        "I understand. How can I help you with that?",
        "Thanks for sharing that with me. What else would you like to know?",
        "I'm here to help! Is there anything specific you'd like assistance with?",
        "That sounds great! Do you have any questions about it?"
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      addMessage(randomResponse, 'bot');
    }, 1000);
  }

  // Toggle chat visibility
  function toggleChat() {
    const window = document.getElementById('chatbot-window');
    const toggle = document.getElementById('chatbot-toggle');
    
    if (!window || !toggle) return;

    isOpen = !isOpen;
    
    if (isOpen) {
      window.style.display = 'flex';
      toggle.style.display = 'none';
    } else {
      window.style.display = 'none';
      toggle.style.display = 'flex';
    }
  }

  // Initialize widget
  function initWidget() {
    // Create widget HTML
    const widgetHTML = createWidgetHTML();
    
    // Insert widget into page
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = widgetHTML;
    widgetContainer = tempDiv.firstElementChild;
    document.body.appendChild(widgetContainer);

    // Add event listeners
    const toggle = document.getElementById('chatbot-toggle');
    const close = document.getElementById('chatbot-close');
    const input = document.getElementById('chatbot-input');
    const send = document.getElementById('chatbot-send');

    if (toggle) toggle.addEventListener('click', toggleChat);
    if (close) close.addEventListener('click', toggleChat);
    if (send) send.addEventListener('click', handleUserInput);
    if (input) {
      input.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
          handleUserInput();
        }
      });
    }

    // Add hover effect to toggle button
    if (toggle) {
      toggle.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.1)';
      });
      toggle.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
      });
    }
  }

  // Configuration API
  window.ChatbotWidget = {
    init: function(options = {}) {
      // Merge user options with default config
      Object.assign(CONFIG, options);
      
      // Initialize widget when DOM is ready
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initWidget);
      } else {
        initWidget();
      }
    },
    
    config: function(options) {
      Object.assign(CONFIG, options);
    },
    
    open: function() {
      if (!isOpen) toggleChat();
    },
    
    close: function() {
      if (isOpen) toggleChat();
    },
    
    sendMessage: function(message) {
      addMessage(message, 'user');
    }
  };

  // Auto-initialize if script has data attributes
  const script = document.currentScript;
  if (script && script.dataset.autoInit !== 'false') {
    const options = {};
    
    if (script.dataset.position) options.position = script.dataset.position;
    if (script.dataset.theme) options.theme = script.dataset.theme;
    if (script.dataset.primaryColor) options.primaryColor = script.dataset.primaryColor;
    if (script.dataset.width) options.width = script.dataset.width;
    if (script.dataset.height) options.height = script.dataset.height;
    
    window.ChatbotWidget.init(options);
  }

})();
