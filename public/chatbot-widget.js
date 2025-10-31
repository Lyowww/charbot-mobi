(function () {
  'use strict';

  let isOpen = false;
  let messages = [];
  let widgetContainer = null;
  let chatKey = null;
  let chatUrl = null;
  let currentHistory = [];
  let currentPage = 1;
  let isLoadingHistory = false;
  let chatPersona = null;
  let userIp = null;

  function createWidgetHTML() {
    return `
      <!-- Overlay (mobile only) -->
      <div id="chatbot-overlay" class="chatbot-overlay"></div>

      <div id="chatbot-widget-container" style="
        position: fixed;
        right: 0;
        bottom: 0;
        border-radius: 24px 24px 0 0;
        z-index: 1000;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      ">
        <!-- Chat Popup -->
        <div id="chatbot-window" class="chatbot-container chatbot-popup" style="
          position: fixed;
          bottom: 0;
          right: 30px;
          width: 420px;
          max-width: calc(100vw - 40px);
          height: 600px;
          max-height: 100vh;
          background: white;
          border-radius: 24px 24px 0 0;
          box-shadow: 0 8px 40px rgba(0, 0, 0, 0.15);
          display: none;
          flex-direction: column;
          overflow: hidden;
          z-index: 1001;
        ">
          <!-- Drag Handle -->
          <div id="chatbot-dragbar" class="drag-handle" style="
            background: white;
            padding: 12px 0 12px 0;
            display: none;
            justify-content: center;
            align-items: center;
            cursor: grab;
            touch-action: none;
          ">
            <div class="drag-bar" style="
              width: 36px;
              height: 5px;
              background: #d0d0d0;
              border-radius: 3px;
            "></div>
          </div>
          <!-- Header -->
          <div class="chatbot-header" style="
            background: white;
            padding: 10px 24px;
            display: grid;
            grid-template-columns: 36px 1fr 36px;
            align-items: center;
          ">
            <div class="chatbot-header-content" style="
              grid-column: 2;
              text-align: center;
            ">
              <div class="chatbot-title" style="
                font-size: 14px;
                color: #666;
              ">Armenia Travel</div>
            </div>
            <button id="chatbot-close" class="chatbot-close" style="
              background: #f5f5f5;
              border: none;
              border-radius: 50%;
              width: 36px;
              height: 36px;
              cursor: pointer;
              font-size: 20px;
              color: #666;
              display: flex;
              align-items: center;
              justify-content: center;
              transition: background 0.2s;
            ">
              <svg width="11" height="11" viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 10L10 1M1 1L10 10" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
          </div>

          <!-- Messages Area -->
          <div id="chatbot-messages" style="
            flex: 1;
            overflow-y: auto;
            padding: 24px;
            display: flex;
            flex-direction: column;
            gap: 16px;
            background: white;
            overscroll-behavior: contain;
            -webkit-overflow-scrolling: touch;
            touch-action: pan-y;
          ">
            <!-- Terms Notice -->
            <div class="terms-notice" style="
              background: white;
              padding: 0 0 10px 0;
              text-align: center;
              font-size: 13px;
              color: #666;
              line-height: 1.6;
              margin-bottom: 16px;
            ">
              By engaging in this conversation, you agree<br>to our <a href="/terms-and-conditions" target="_blank" style="color: #666; text-decoration: underline;">Terms and Conditions</a>.
            </div>
          </div>

          <!-- Input Area -->
          <div class="chatbot-input-wrapper" style="
            padding: 20px 24px;
            padding-bottom: calc(20px + env(safe-area-inset-bottom));
          ">
            <div class="chatbot-input-container" style="
              display: flex;
              gap: 16px;
              align-items: center;
              background: white;
              border: 1px solid #e0e0e0;
              border-radius: 30px;
              padding: 8px 8px 8px 24px;
              transition: border-color 0.2s;
            ">
              <textarea 
                id="chatbot-input" 
                class="chatbot-input"
                aria-label="Type your message here"
                placeholder="Type your message here..."
                rows="1"
                style="
                  flex: 1;
                  border: none;
                  font-size: 16px;
                  font-family: inherit;
                  resize: none;
                  max-height: 100px;
                  outline: none;
                  background: transparent;
                  color: black;
                "
                role="textbox"
                aria-multiline="true"
                autocomplete="off"
                autocorrect="off"
                spellcheck="true"
              ></textarea>
              <button 
                id="chatbot-send" 
                class="input-button send" 
                title="Send message"
                aria-label="Send message"
                aria-disabled="true"
                disabled
                style="
                  background: transparent;
                  border: none;
                  cursor: pointer;
                  padding: 0;
                  color: #000;
                  transition: opacity 0.2s;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  flex-shrink: 0;
                  width: 44px;
                  height: 44px;
                "
                tabindex="0"
                role="button"
              >
                <svg width="30" height="30" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6.06073 6.82798C6.54195 6.34333 7.26375 6.19901 7.86542 6.46274L34.008 18.0018C34.1818 18.0788 34.3366 18.185 34.466 18.3143C34.7549 18.6032 34.9209 19.0054 34.9123 19.4364C34.9001 20.0624 34.5239 20.6389 33.9504 20.91L7.32147 33.5086C6.70839 33.7998 5.99479 33.6839 5.53241 33.2215L5.53046 33.2196C5.06731 32.7538 4.95532 32.0368 5.24921 31.4256L10.7648 19.9237L5.70722 8.63364C5.43838 8.03144 5.57844 7.31147 6.06073 6.82798ZM13.7189 21.41L10.3615 28.412L25.1603 21.41H13.7189ZM13.3488 17.6053L13.3498 17.41H24.4787L10.4973 11.2391L13.3488 17.6053Z" fill="black"/>
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Chat Button -->
        <button id="chatbot-toggle" class="chatbot-toggle-button" style="
          position: fixed;
          bottom: 30px;
          right: 30px;
          background: #0046FF;
          color: white;
          border: none;
          border-radius: 50px;
          padding: 18px 32px;
          font-size: 20px;
          font-weight: 600;
          cursor: pointer;
          box-shadow: 0 8px 24px rgba(0, 70, 255, 0.4);
          display: flex;
          align-items: center;
          gap: 12px;
          transition: transform 0.2s, box-shadow 0.2s;
          z-index: 1000;
        ">
          <span class="button-content" style="display: flex; align-items: center;">
            <span class="toggle-text">Questions?</span>
            <span class="indicator indicator-desktop" style="
              width: 10px;
              height: 10px;
              background: #00FF85;
              border-radius: 50%;
              margin-left: 12px;
            "></span>
          </span>
          <span class="indicator-mobile" style="
            width: 16px;
            height: 16px;
            background: #00FF85;
            border-radius: 50%;
            position: absolute;
            top: 12px;
            right: 12px;
            display: none;
          "></span>
          <svg class="button-icon" width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" style="display: none;">
            <path d="M8.07297 8.19358C8.65034 7.612 9.51651 7.43881 10.2385 7.75529L40.8096 21.6021C41.0181 21.6945 41.2039 21.822 41.3592 21.9772C41.7059 22.3238 41.9051 22.8065 41.8948 23.3237C41.8801 24.0749 41.4287 24.7667 40.7405 25.092L8.78576 40.2103C8.05007 40.5598 7.19375 40.4207 6.63889 39.8658L6.63655 39.8635C6.08077 39.3046 5.94638 38.4442 6.29905 37.7107L12.9178 23.9084L6.84866 10.3604C6.52606 9.63773 6.69413 8.77376 8.07297 8.19358ZM16.4627 25.692L12.4338 34.0944L30.1924 25.692H16.4627ZM16.0186 21.1264L16.0198 20.892H29.3744L12.5968 13.4869L16.0186 21.1264Z" fill="white"/>
          </svg>
        </button>
      </div>
    `;
  }

  function addMessage(text, sender = 'bot', pushToArray = true) {
    const messagesContainer = document.getElementById('chatbot-messages');
    if (!messagesContainer) return;

    // Replace backend limit error with a friendlier message
    if (
      sender === 'bot' &&
      typeof text === 'string' &&
      text.trim() === 'Error user hits the limit'
    ) {
      text = 'user limit has expired wait a minute for again talking';
    }

    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender === 'bot' ? 'assistant' : 'user'}`;
    messageDiv.style.cssText = `
      display: flex;
      flex-direction: column;
      max-width: 80%;
      align-self: ${sender === 'bot' ? 'flex-start' : 'flex-end'};
      animation: fadeIn 0.3s ease-out;
    `;

    const bubbleDiv = document.createElement('div');
    bubbleDiv.className = 'message-bubble';
    bubbleDiv.style.cssText = `
      padding: 14px 18px;
      border-radius: 20px;
      font-size: 15px;
      line-height: 1.5;
      word-wrap: break-word;
      background: ${sender === 'bot' ? '#0046FF' : '#F5F5F5'};
      color: ${sender === 'bot' ? 'white' : '#333'};
      border-bottom-${sender === 'bot' ? 'left' : 'right'}-radius: 6px;
    `;
    bubbleDiv.textContent = text;

    messageDiv.appendChild(bubbleDiv);
    messagesContainer.appendChild(messageDiv);

    requestAnimationFrame(() => {
      const messageOffsetTop = messageDiv.offsetTop;
      messagesContainer.scrollTop = messageOffsetTop;
      setTimeout(() => {
        messagesContainer.scrollTop = messageOffsetTop;
      }, 100);
    });

    if (pushToArray) {
      messages.push({ text, sender });
    }
  }

  function scrollToBottom() {
    const messagesContainer = document.getElementById('chatbot-messages');
    if (messagesContainer) {
      const messages = messagesContainer.querySelectorAll('.message');
      if (messages.length > 0) {
        const lastMessage = messages[messages.length - 1];
        const messageOffsetTop = lastMessage.offsetTop;

        requestAnimationFrame(() => {
          messagesContainer.scrollTop = messageOffsetTop;

          setTimeout(() => {
            messagesContainer.scrollTop = messageOffsetTop;
          }, 50);
        });
      }
    }
  }

  function showTypingIndicator() {
    const messagesContainer = document.getElementById('chatbot-messages');
    if (!messagesContainer) return;

    if (document.getElementById('typing-indicator')) return;

    const typingDiv = document.createElement('div');
    typingDiv.className = 'message assistant';
    typingDiv.id = 'typing-indicator';
    typingDiv.style.cssText = `
      display: flex;
      flex-direction: column;
      max-width: 80%;
      align-self: flex-start;
    `;

    const indicator = document.createElement('div');
    indicator.className = 'typing-indicator queued-indicator';
    indicator.style.cssText = `
      display: flex;
      align-items: center;
      gap: 4px;
      padding: 14px 18px;
      min-height: 42px;
      background: #0046FF;
      border-radius: 20px;
      border-bottom-left-radius: 6px;
      width: fit-content;
      backface-visibility: hidden;
      will-change: transform;
    `;

    if (window.typingDotInterval) {
      clearInterval(window.typingDotInterval);
      window.typingDotInterval = null;
    }
    if (window.typingDotRAF) {
      cancelAnimationFrame(window.typingDotRAF);
      window.typingDotRAF = null;
    }

    const dotEls = [];
    for (let i = 0; i < 3; i++) {
      const span = document.createElement('span');
      span.className = 'typing-dot';
      span.style.cssText = `
        width: 8px;
        height: 8px;
        background: #fff;
        border-radius: 50%;
        opacity: 0.65;
        transform: scale(0.9);
        will-change: transform, opacity, filter;
        transition: opacity 150ms linear;
        filter: drop-shadow(0 0 0px rgba(255,255,255,0));
      `;
      indicator.appendChild(span);
      dotEls.push(span);
    }

    let startTs = null;
    const DOT_COUNT = dotEls.length;
    const CYCLE_MS = 1500;
    const BASE_SCALE = 0.9;
    const MAX_SCALE = 1.65;

    function smoothstep(t) {
      return t * t * (3 - 2 * t);
    }

    function step(ts) {
      if (!startTs) startTs = ts;
      const elapsed = (ts - startTs) % CYCLE_MS;
      const phase = elapsed / CYCLE_MS;

      for (let i = 0; i < DOT_COUNT; i++) {
        const el = dotEls[i];
        let local = phase - i / DOT_COUNT;
        local = local - Math.floor(local);

        const tri = 1 - Math.abs(local - 0.5) * 2;
        const intensity = smoothstep(Math.max(0, tri));

        const scale = BASE_SCALE + (MAX_SCALE - BASE_SCALE) * intensity;
        const opacity = 0.55 + 0.45 * intensity;
        const glow = 6 * intensity;

        el.style.transform = `scale(${scale})`;
        el.style.opacity = `${opacity}`;
        el.style.filter = `drop-shadow(0 0 ${glow}px rgba(255,255,255,${0.7 * intensity}))`;
      }

      window.typingDotRAF = requestAnimationFrame(step);
    }

    window.typingDotRAF = requestAnimationFrame(step);

    typingDiv.appendChild(indicator);
    messagesContainer.appendChild(typingDiv);
    requestAnimationFrame(() => {
      messagesContainer.scrollTop = typingDiv.offsetTop;
    });
  }

  function hideTypingIndicator() {
    const typingIndicator = document.getElementById('typing-indicator');
    if (typingIndicator) {
      typingIndicator.remove();
    }
    if (window.typingDotInterval) {
      clearInterval(window.typingDotInterval);
      window.typingDotInterval = null;
    }
    if (window.typingDotRAF) {
      cancelAnimationFrame(window.typingDotRAF);
      window.typingDotRAF = null;
    }
  }

  async function handleUserInput() {
    const input = document.getElementById('chatbot-input');
    if (!input || !input.value.trim()) return;

    const userMessage = input.value.trim();
    addMessage(userMessage, 'user');
    input.value = '';
    input.style.height = 'auto';

    input.blur();

    setTimeout(() => {
      scrollToBottom();
    }, 150);

    const sendButton = document.getElementById('chatbot-send');
    if (input) input.disabled = true;
    if (sendButton) sendButton.disabled = true;

    showTypingIndicator();

    try {
      const storedChatInfo = getStoredChatInfo();

      if (!storedChatInfo || !storedChatInfo.chat_info || !storedChatInfo.property_info) {
        hideTypingIndicator();
        addMessage('Sorry, chat session not initialized properly.', 'bot');
        setTimeout(() => {
          scrollToBottom();
        }, 200);
        const inputEl = document.getElementById('chatbot-input');
        const sendBtnEl = document.getElementById('chatbot-send');
        if (inputEl) {
          inputEl.disabled = false;
          setTimeout(() => {
            inputEl.focus();
          }, 100);
        }
        if (sendBtnEl) sendBtnEl.disabled = true;
        return;
      }

      const chatToken = storedChatInfo.chat_info.token;
      const propertyId = storedChatInfo.property_info.property_id;
      const authToken = localStorage.getItem('auth_token') || localStorage.getItem('token');
      const sessionId = storedChatInfo.chat_info.session_id;

      const requestBody = {
        languageCode: 'en',
        query: userMessage,
        audio: false,
        property_id: propertyId,
        session_id: sessionId
      };

      const headers = {
        'Content-Type': 'application/json'
      };

      if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
      }

      if (chatToken) {
        headers['x-chat-token'] = chatToken;
      }
      const response = await fetch('https://admin.moby.host/api/v2/chat/send', {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(requestBody)
      });

      const result = await response.json();

      hideTypingIndicator();

      if (result && result.data && result.data.messages && result.data.messages.text) {
        addMessage(result.data.messages.text, 'bot');
      } else {
        addMessage('Sorry, I encountered an error. Please try again.', 'bot');
      }

      // Ensure scroll to show new message at top after bot response
      setTimeout(() => {
        scrollToBottom();
      }, 200);
    } catch (error) {
      hideTypingIndicator();
      addMessage('Sorry, I encountered an error. Please try again.', 'bot');
      setTimeout(() => {
        scrollToBottom();
      }, 200);
    } finally {
      const inputEl = document.getElementById('chatbot-input');
      const sendBtnEl = document.getElementById('chatbot-send');
      if (inputEl) {
        inputEl.disabled = false;
        setTimeout(() => {
          inputEl.focus();
        }, 100);
      }
      if (sendBtnEl) sendBtnEl.disabled = true;
    }
  }

  function disableBodyScroll() {
    const scrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop;

    document.body.dataset.scrollY = scrollY.toString();

    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%';
    document.body.style.left = '0';
    document.body.style.right = '0';

    if (isMobileDevice()) {
      document.body.style.touchAction = 'none';
      document.documentElement.style.touchAction = 'none';
    }
  }

  function enableBodyScroll() {
    const scrollY = document.body.dataset.scrollY || '0';
    const scrollPosition = parseInt(scrollY, 10);

    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.width = '';
    document.body.style.left = '';
    document.body.style.right = '';

    if (isMobileDevice()) {
      document.body.style.touchAction = '';
      document.documentElement.style.touchAction = '';
    }

    if (scrollPosition > 0) {
      window.scrollTo(0, scrollPosition);
    }

    delete document.body.dataset.scrollY;
  }

  function toggleChat() {
    const chatWindow = document.getElementById('chatbot-window');
    const toggle = document.getElementById('chatbot-toggle');
    const overlay = document.getElementById('chatbot-overlay');
    if (!chatWindow || !toggle) return;

    isOpen = !isOpen;

    if (isOpen) {
      chatWindow.classList.add('active');
      if (overlay) overlay.classList.add('active');
      toggle.style.display = 'none';
      disableBodyScroll();
      scrollToBottom();
    } else {
      chatWindow.classList.remove('active');
      if (overlay) overlay.classList.remove('active');
      toggle.style.display = 'flex';
      enableBodyScroll();
    }
  }

  function initializechatKey() {
    let script = document.currentScript;
    if (!script) {
      const scripts = document.querySelectorAll('script');
      for (let i = scripts.length - 1; i >= 0; i--) {
        const src = scripts[i].getAttribute('src');
        if (src && (src.includes('chatbot-widget.js') || src.includes('widget'))) {
          script = scripts[i];
          break;
        }
      }
    }


    if (script) {
      chatUrl = script.getAttribute('chat_url') || null;
      if (chatUrl) {
        chatKey = chatUrl.split('/').pop();
        chatPersona = script.getAttribute('persona') || null;
      }
    }

    if (chatKey) {
      const currentOrigin = window.location.origin;

      const websitesKey = 'chatbot_websites_' + chatKey;
      const existingWebsites = localStorage.getItem(websitesKey);
      let websites = existingWebsites ? JSON.parse(existingWebsites) : [];

      if (!websites.includes(currentOrigin)) {
        websites.push(currentOrigin);
      }

      localStorage.setItem(websitesKey, JSON.stringify(websites));
      localStorage.setItem('chatbot_current_chatKey', chatKey);

      const timestampKey = 'chatbot_timestamp_' + chatKey + '_' + currentOrigin.replace(/[^a-zA-Z0-9]/g, '_');
      localStorage.setItem(timestampKey, new Date().toISOString());

      localStorage.setItem('chatbot_chatKey_' + chatKey, currentOrigin);
    }
  }

  function getchatKey() {
    return chatKey || localStorage.getItem('chatbot_current_chatKey');
  }

  function getWebsitesForchatKey(customchatKey) {
    const chatKeyToUse = customchatKey || chatKey;
    if (!chatKeyToUse) return [];

    const websitesKey = 'chatbot_websites_' + chatKeyToUse;
    const storedWebsites = localStorage.getItem(websitesKey);
    return storedWebsites ? JSON.parse(storedWebsites) : [];
  }

  function getOrCreateDeviceId() {
    const deviceIdKey = 'chatbot_device_id';
    let deviceId = localStorage.getItem(deviceIdKey);

    if (!deviceId) {
      deviceId = 'device_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem(deviceIdKey, deviceId);
    }

    return deviceId;
  }

  function detectPlatform() {
    const ua = navigator.userAgent.toLowerCase();

    if (ua.includes('iphone') || ua.includes('ipad') || ua.includes('ipod') || ua.includes('mac')) {
      return 'IOS';
    } else {
      return 'WEB';
    }
  }

  async function getUserIp() {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip;
    } catch (error) {
      return null;
    }
  }

  async function generateToken() {
    const currentChatKey = getchatKey();

    if (!currentChatKey) {
      return;
    }

    try {
      const deviceId = getOrCreateDeviceId();
      const platform = detectPlatform();
      userIp = await getUserIp();
      if (!userIp) {
        addMessage('Sorry, I encountered an error. Please try again. IP address not found.', 'bot');
        setTimeout(() => {
          scrollToBottom();
        }, 200);
        hideTypingIndicator();
        return;
      }
      const requestBody = {
        "chat_key": chatKey,
        "persona": chatPersona,
        "user_ip": userIp,
        "device_info": {
          "device_id": deviceId,
          "platform": platform
        }
      }
      const response = await fetch('https://admin.moby.host/api/v2/chat/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      const result = await response.json();

      if (result && result.data) {
        const chatInfoKey = 'chatbot_chat_info_' + currentChatKey;
        localStorage.setItem(chatInfoKey, JSON.stringify(result.data));

        if (result.data.initial_message) {
          currentHistory = [result.data.initial_message];
          displayMessagesFromHistory();
        }
      }

      return result;
    } catch (error) {
      return null;
    }
  }

  function getStoredChatInfo() {
    const currentChatKey = getchatKey();
    if (!currentChatKey) return null;

    const chatInfoKey = 'chatbot_chat_info_' + currentChatKey;
    const storedInfo = localStorage.getItem(chatInfoKey);

    return storedInfo ? JSON.parse(storedInfo) : null;
  }

  async function fetchChatHistory(page = 1, ajustar = false, append = false) {
    const storedChatInfo = getStoredChatInfo();

    if (!storedChatInfo || !storedChatInfo.chat_info) {
      return null;
    }

    if (isLoadingHistory) {
      return null;
    }

    try {
      isLoadingHistory = true;
      const chatToken = storedChatInfo.chat_info.token;

      const authToken = localStorage.getItem('auth_token染色体') || localStorage.getItem('token');

      const params = new URLSearchParams({
        page: page.toString(),
        size: '50'
      });

      const headers = {
        'Content-Type': 'application/json'
      };

      if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
      }

      if (chatToken) {
        headers['x-chat-token'] = chatToken;
      }

      const response = await fetch(`https://admin.moby.host/api/v2/chat/history?${params}`, {
        method: 'GET',
        headers: headers
      });

      const result = await response.json();

      if (result && result.data && result.data.history) {
        if (append) {
          currentHistory = [...result.data.history, ...currentHistory];
        } else {
          currentHistory = result.data.history;
        }

        displayMessagesFromHistory(append);
      }

      return result;
    } catch (error) {
      return null;
    } finally {
      isLoadingHistory = false;
    }
  }

  function displayMessagesFromHistory(append = false) {
    const messagesContainer = document.getElementById('chatbot-messages');
    if (!messagesContainer) return;

    if (currentHistory.length > 0) {
      const previousScrollHeight = messagesContainer.scrollHeight;

      if (!append) {
        const initialMsg = messagesContainer.querySelector('.message.assistant');
        messagesContainer.innerHTML = '';
        if (initialMsg) {
          messagesContainer.appendChild(initialMsg);
        }
        messages = [];
      } else {
        messages = [];
      }

      const sortedHistory = [...currentHistory].sort((a, b) => {
        return new Date(a.created_at) - new Date(b.created_at);
      });

      sortedHistory.forEach(msg => {
        const sender = msg.sender === 'BOT' ? 'bot' : 'user';
        addMessage(msg.message, sender, false);
      });

      if (append) {
        const newScrollHeight = messagesContainer.scrollHeight;
        messagesContainer.scrollTop = newScrollHeight - previousScrollHeight;
      } else {
        setTimeout(() => {
          const messages = messagesContainer.querySelectorAll('.message');
          if (messages.length > 0) {
            const lastMessage = messages[messages.length - 1];
            messagesContainer.scrollTop = lastMessage.offsetTop;
          }
        }, 200);
      }
    }
  }

  function initWidget() {
    try {
      initializechatKey();

      if (!chatUrl || !chatKey) {
        return;
      }

      const widgetHTML = createWidgetHTML();

      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = widgetHTML;

      while (tempDiv.firstChild) {
        document.body.appendChild(tempDiv.firstChild);
      }

      widgetContainer = document.getElementById('chatbot-widget-container');

      if (!widgetContainer || !document.body) {
        return;
      }


      addStyles();

      // Drag-to-close handlers (mobile)
      (function setupDragBar() {
        const chatWindow = document.getElementById('chatbot-window');
        const dragBar = document.getElementById('chatbot-dragbar');
        if (!chatWindow || !dragBar) return;

        let startY = 0;
        let currentY = 0;
        let dragging = false;
        let hasMoved = false;
        const getCloseThreshold = () => Math.max(120, (chatWindow.clientHeight || 600) * 0.35);

        const setTransform = (y) => {
          chatWindow.style.transform = `translateY(${Math.max(0, y)}px)`;
        };

        const resetTransform = () => {
          chatWindow.style.transition = 'transform 180ms ease-out';
          setTransform(0);
          setTimeout(() => { chatWindow.style.transition = ''; }, 200);
        };

        const closeWithAnimation = () => {
          const distance = (chatWindow.clientHeight || 600) + 100;
          chatWindow.style.transition = 'transform 220ms ease-out';
          setTransform(distance);
          setTimeout(() => {
            if (isOpen) toggleChat();
            chatWindow.style.transition = '';
            setTransform(0);
          }, 230);
        };

        const onStart = (y) => {
          dragging = true;
          hasMoved = false;
          startY = y;
          currentY = y;
          dragBar.style.cursor = 'grabbing';
          chatWindow.style.transition = '';
        };

        const onMove = (y, evt) => {
          if (!dragging) return;
          const delta = y - startY;
          if (delta > 0) {
            hasMoved = true;
            setTransform(delta);
            if (evt && evt.cancelable) evt.preventDefault();
          }
        };

        const onEnd = () => {
          if (!dragging) return;
          dragging = false;
          dragBar.style.cursor = 'grab';
          const delta = currentY - startY;
          if (delta > getCloseThreshold()) {
            closeWithAnimation();
          } else {
            resetTransform();
          }
        };

        // Pointer/Mouse
        dragBar.addEventListener('mousedown', (e) => onStart(e.clientY));
        window.addEventListener('mousemove', (e) => { currentY = e.clientY; onMove(e.clientY, e); });
        window.addEventListener('mouseup', onEnd);

        // Touch
        dragBar.addEventListener('touchstart', (e) => {
          const t = e.touches[0];
          onStart(t.clientY);
        }, { passive: true });
        dragBar.addEventListener('touchmove', (e) => {
          const t = e.touches[0];
          currentY = t.clientY;
          onMove(t.clientY, e);
        }, { passive: false });
        dragBar.addEventListener('touchend', onEnd);

        // Tap to close (no drag)
        dragBar.addEventListener('click', () => {
          if (!hasMoved && isOpen) toggleChat();
        });
      })();

      const storedChatInfo = getStoredChatInfo();

      if (storedChatInfo && storedChatInfo.chat_info && (!storedChatInfo.chat_info.user_ip || !storedChatInfo.chat_info.persona)) {
        generateToken();
      } else if (storedChatInfo && storedChatInfo.chat_info) {
        fetchChatHistory();
      } else {
        generateToken();
      }

      const toggle = document.getElementById('chatbot-toggle');
      const close = document.getElementById('chatbot-close');
      const overlay = document.getElementById('chatbot-overlay');
      const input = document.getElementById('chatbot-input');
      const send = document.getElementById('chatbot-send');

      if (toggle) {
        toggle.style.display = 'flex';
        toggle.style.visibility = 'visible';
        toggle.style.opacity = '1';
        toggle.addEventListener('click', toggleChat);
      }
      if (close) close.addEventListener('click', toggleChat);
      if (overlay) overlay.addEventListener('click', toggleChat);
      if (send) send.addEventListener('click', handleUserInput);
      if (input) {
        input.addEventListener('input', function () {
          this.style.height = 'auto';
          this.style.height = Math.min(this.scrollHeight, 100) + 'px';
          const sendButton = document.getElementById('chatbot-send');
          if (sendButton) sendButton.disabled = this.value.trim() === '';
        });

        input.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleUserInput();
          }
        });

        if (isMobileDevice()) {
          let scrollPositionBeforeFocus = 0;

          let isKeyboardVisible = false;
          let initialViewportHeight = window.innerHeight;

          const preventScroll = function (e) {
            const inputWrapper = input ? input.closest('.chatbot-input-wrapper') : null;
            if (e.target === input || input.contains(e.target) || (inputWrapper && inputWrapper.contains(e.target))) {
              return true;
            }
            if (isKeyboardVisible) {
              e.preventDefault();
              e.stopPropagation();
              return false;
            }
            return true;
          };

          let preventScrollHandlers = {
            documentTouchmove: null,
            documentWheel: null,
            documentScroll: null,
            windowScroll: null,
            chatWindowTouchmove: null,
            chatWindowWheel: null,
            chatWindowScroll: null,
            messagesTouchmove: null,
            messagesWheel: null,
            messagesScroll: null
          };

          const applyKeyboardRestrictions = () => {
            if (isKeyboardVisible) return;

            scrollPositionBeforeFocus = window.pageYOffset || window.scrollY || document.documentElement.scrollTop;
            isKeyboardVisible = true;

            const chatWindow = document.getElementById('chatbot-window');
            const messagesContainer = document.getElementById('chatbot-messages');

            document.body.style.position = 'fixed';
            document.body.style.top = `-${scrollPositionBeforeFocus}px`;
            document.body.style.width = '100%';
            document.body.style.overflow = 'hidden';
            document.body.style.left = '0';
            document.body.style.right = '0';
            document.documentElement.style.overflow = 'hidden';

            if (messagesContainer) {
              messagesContainerScrollBeforeFocus = messagesContainer.scrollTop;
              messagesContainer.style.overflow = 'hidden';
              messagesContainer.style.touchAction = 'none';
              messagesContainer.style.overscrollBehavior = 'none';
            }

            if (chatWindow) {
              chatWindow.classList.add('keyboard-visible');
              chatWindow.style.overflow = 'hidden';
              chatWindow.style.touchAction = 'none';

              const updateChatHeight = () => {
                if (window.visualViewport) {
                  const viewportHeight = window.visualViewport.height;
                  chatWindow.style.height = viewportHeight + 'px';
                  chatWindow.style.maxHeight = viewportHeight + 'px';
                }
              };

              updateChatHeight();
              setTimeout(updateChatHeight, 300);
            }

            preventScrollHandlers.documentTouchmove = preventScroll;
            preventScrollHandlers.documentWheel = preventScroll;
            preventScrollHandlers.documentScroll = preventScroll;
            preventScrollHandlers.windowScroll = preventScroll;

            document.addEventListener('touchmove', preventScroll, { passive: false });
            document.addEventListener('wheel', preventScroll, { passive: false });
            document.addEventListener('scroll', preventScroll, { passive: false });
            window.addEventListener('scroll', preventScroll, { passive: false });
          };

          const removeKeyboardRestrictions = () => {
            if (!isKeyboardVisible) return;

            isKeyboardVisible = false;
            const chatWindow = document.getElementById('chatbot-window');
            const messagesContainer = document.getElementById('chatbot-messages');

            if (preventScrollHandlers.documentTouchmove) {
              document.removeEventListener('touchmove', preventScrollHandlers.documentTouchmove);
            }
            if (preventScrollHandlers.documentWheel) {
              document.removeEventListener('wheel', preventScrollHandlers.documentWheel);
            }
            if (preventScrollHandlers.documentScroll) {
              document.removeEventListener('scroll', preventScrollHandlers.documentScroll);
            }
            if (preventScrollHandlers.windowScroll) {
              window.removeEventListener('scroll', preventScrollHandlers.windowScroll);
            }

            if (messagesContainer) {
              messagesContainer.style.overflow = 'auto';
              messagesContainer.style.touchAction = 'pan-y';
              messagesContainer.style.overscrollBehavior = 'contain';
              messagesContainer.scrollTop = messagesContainer.scrollHeight;
            }

            if (chatWindow) {
              chatWindow.classList.remove('keyboard-visible');
              chatWindow.style.height = '80vh';
              chatWindow.style.maxHeight = '80vh';
              chatWindow.style.overflow = '';
              chatWindow.style.touchAction = '';
            }

            const scrollY = document.body.style.top;
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.width = '';
            document.body.style.overflow = '';
            document.body.style.left = '';
            document.body.style.right = '';
            document.documentElement.style.overflow = '';

            if (scrollY) {
              const scrollPosition = parseInt(scrollY.replace('-', '') || '0');
              window.scrollTo(0, scrollPosition);
            }

            preventScrollHandlers = {
              documentTouchmove: null,
              documentWheel: null,
              documentScroll: null,
              windowScroll: null,
              chatWindowTouchmove: null,
              chatWindowWheel: null,
              chatWindowScroll: null,
              messagesTouchmove: null,
              messagesWheel: null,
              messagesScroll: null
            };
          };

          input.addEventListener('focus', function (e) {
            initialViewportHeight = window.innerHeight;

            setTimeout(() => {
              if (document.activeElement === input && window.visualViewport) {
                const currentHeight = window.visualViewport.height;
                if (currentHeight < initialViewportHeight * 0.75) {
                  applyKeyboardRestrictions();
                }
              }
            }, 200);
          });

          input.addEventListener('blur', function () {
            setTimeout(() => {
              if (isMobileDevice()) {
                removeKeyboardRestrictions();
              }
            }, 250);
          });

          if (window.visualViewport) {
            let lastViewportHeight = window.visualViewport.height;

            window.visualViewport.addEventListener('resize', function () {
              const chatWindow = document.getElementById('chatbot-window');
              const input = document.getElementById('chatbot-input');

              if (isMobileDevice() && chatWindow) {
                const currentViewportHeight = window.visualViewport.height;
                const isInputFocused = document.activeElement === input;

                if (currentViewportHeight < lastViewportHeight && isInputFocused) {
                  applyKeyboardRestrictions();
                }

                if (currentViewportHeight > lastViewportHeight && !isInputFocused && isKeyboardVisible) {
                  removeKeyboardRestrictions();
                }

                lastViewportHeight = currentViewportHeight;
              }
            });
          }

          input.addEventListener('touchstart', function (e) {
            e.stopPropagation();
          });

          const inputWrapper = input.closest('.chatbot-input-wrapper');
          if (inputWrapper) {
            inputWrapper.addEventListener('touchmove', function (e) {
              if (e.target !== input) {
                e.stopPropagation();
              }
            }, { passive: false });
          }
        }
      }

      const messagesContainer = document.getElementById('chatbot-messages');
      if (messagesContainer) {
        messagesContainer.addEventListener('scroll', function () {
          if (this.scrollTop === 0 && !isLoadingHistory) {
            const storedChatInfo = getStoredChatInfo();
            if (storedChatInfo && storedChatInfo.chat_info) {
              currentPage++;
              fetchChatHistory(currentPage, true);
            }
          }
        });
      }

      if (toggle) {
        toggle.addEventListener('mouseenter', function () {
          this.style.transform = 'translateY(-2px)';
          this.style.boxShadow = '0 12px 32px rgba(0, 70, 255, 0.5)';
        });
        toggle.addEventListener('mouseleave', function () {
          this.style.transform = 'translateY(0)';
          this.style.boxShadow = '0 8px 24px rgba(0, 70, 255, 0.4)';
        });
      }

      applyMobileStyles();

      setTimeout(() => {
        applyMobileStyles();
      }, 100);

      if (document.readyState === 'loading') {
        window.addEventListener('load', () => {
          setTimeout(applyMobileStyles, 50);
        });
      }

      window.addEventListener('resize', applyMobileStyles);

      if (window.visualViewport) {
        window.visualViewport.addEventListener('resize', applyMobileStyles);
        window.visualViewport.addEventListener('scroll', applyMobileStyles);
      }

    } catch (error) {
      console.error('Chatbot widget initialization error:', error);
    }
  }

  function addStyles() {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes typing {
        0%, 60%, 100% {
          opacity: 0.3;
        }
        30% {
          opacity: 1;
        }
      }

      @keyframes fadeIn {
        from {
          opacity: 0;
          transform: translateY(10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      @keyframes slideUp {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      @keyframes pulse {
        0%, 100% {
          opacity: 1;
        }
        50% {
          opacity: 0.5;
        }
      }

      .chatbot-overlay {
        display: none;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        z-index: 1000;
        opacity: 0;
        transition: opacity 0.3s ease-out;
      }

      .chatbot-overlay.active {
        display: block;
        opacity: 1;
      }

      .chatbot-popup.active {
        display: flex !important;
        animation: slideUp 0.3s ease-out;
      }

      .drag-handle {
        background: white;
        padding: 12px 0 12px 0;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: grab;
        touch-action: none;
      }

      .drag-handle:active {
        cursor: grabbing;
      }

      .drag-bar {
        width: 36px;
        height: 5px;
        background: #d0d0d0;
        border-radius: 3px;
      }

      .chatbot-close:hover {
        background: #e5e5e5 !important;
      }

      .chatbot-close svg {
        width: 11px;
        height: 11px;
      }

      .chatbot-input-container:focus-within {
        border-color: #0046FF !important;
      }

      .input-button:hover:not(:disabled) {
        opacity: 0.7 !important;
      }

      .input-button.send:disabled {
        opacity: 0.3 !important;
        cursor: not-allowed !important;
      }

      .indicator {
        animation: pulse 2s infinite;
      }

      .chatbot-messages::-webkit-scrollbar {
        width: 6px;
      }

      .chatbot-messages::-webkit-scrollbar-track {
        background: transparent;
      }

      .chatbot-messages::-webkit-scrollbar-thumb {
        background: #d0d0d0;
        border-radius: 3px;
      }

      .chatbot-messages::-webkit-scrollbar-thumb:hover {
        background: #b0b0b0;
      }

      #chatbot-messages {
        scrollbar-width: thin;
        scrollbar-color: #d0d0d0 transparent;
      }
    
      .chatbot-toggle-button{
        position: fixed;
        bottom: 30px;
        bottom: calc(30px + env(safe-area-inset-bottom));
        right: 30px;
        right: calc(30px + env(safe-area-inset-right));
        padding: 18px 32px;
        font-size: 20px;
      }
        
      .chatbot-toggle-button.mobile {
        padding: 0;
        width: 70px;
        height: 70px;
        border-radius: 50% !important;
      }
      
      .toggle-icon {
        display: none;
      }
      
      .status-dot1 {
        display: none;
      }
      
      .mobile .button-content {
        display: none;
      }

      .mobile .toggle-text {
        display: none !important;
      }
      
      .mobile .toggle-icon {
        display: block !important;
        margin: auto;
        max-width: 30px;
      }
      
      .mobile .status-dot2 {
        display: none;
      }
      
      .mobile .status-dot1{
        display: block !important;
        width: 16px !important;
        height: 16px !important;
        position: absolute !important;
        top: 12px !important;
        right: 12px !important;
        border: 3px solid #0046FF !important;
        background: #00FF85 !important;
      }
      
      @media (max-width: 480px) {
        .chatbot-overlay.active {
          display: block;
        }

        .chatbot-popup {
          bottom: 0 !important;
          right: 0 !important;
          left: 0 !important;
          width: 100% !important;
          max-width: 100% !important;
          height: 80vh !important;
          max-height: 80vh !important;
          border-radius: 24px 24px 0 0 !important;
          transition: height 0.25s ease-out, max-height 0.25s ease-out;
          position: fixed !important;
          touch-action: pan-y;
        }

        .chatbot-popup.keyboard-visible {
          bottom: 0 !important;
          position: fixed !important;
          touch-action: pan-y;
        }

        #chatbot-messages {
          -webkit-overflow-scrolling: touch;
          overscroll-behavior: contain;
          touch-action: pan-y;
        }

        .chatbot-input-wrapper {
          touch-action: none;
          flex-shrink: 0;
        }

        .chatbot-input {
          touch-action: manipulation;
        }

        .chatbot-toggle-button{
          position: fixed !important;
          bottom: 20px !important;
          right: 20px !important;
          width: 70px !important;
          height: 70px !important;
          border-radius: 50% !important;
          padding: 0 !important;
          box-shadow: 0 8px 24px rgba(0, 70, 255, 0.4) !important;
        }

        .indicator-mobile {
          display: block !important;
          width: 16px !important;
          height: 16px !important;
          border: 3px solid #0046FF !important;
          background: #00FF85 !important;
          border-radius: 50% !important;
          position: absolute !important;
          top: 12px !important;
          right: 12px !important;
          z-index: 1000 !important;
          animation: pulse 2s infinite !important;
        }
        
        .button-content {
          display: none !important;
        }
        
        .button-icon {
          display: block !important;
          margin: auto;
          max-width: 30px;
        }
        
        .status-dot2 {
          display: none !important;
        }
        .status-dot1{
          display: block !important;
          width: 16px !important;
          height: 16px !important;
          position: absolute !important;
          top: 12px !important;
          right: 12px !important;
          border: 3px solid #0046FF !important;
          background: #00FF85 !important;
        }
      }
    `;
    document.head.appendChild(style);
  }

  function isMobileDevice() {
    return window.innerWidth <= 480;
  }

  function isSafari() {
    const ua = navigator.userAgent || '';
    const hasSafari = /safari/i.test(ua);
    const noChrome = !/chrome/i.test(ua) && !/chromium/i.test(ua);
    const isIOS = /iphone|ipad|ipod/i.test(ua);

    const hasSafariIndicator = window.safari !== undefined ||
      (hasSafari && noChrome) ||
      isIOS;

    return hasSafariIndicator;
  }

  function isIOSSafari() {
    const ua = navigator.userAgent || '';
    return (/iphone|ipad|ipod/i.test(ua)) && isSafari();
  }

  function getSafariBottomPosition() {
    const safari = isSafari();

    if (!safari) {
      return 30;
    }

    if (isIOSSafari()) {
      let bottomOffset = 100;

      if (window.visualViewport && window.innerHeight) {
        try {
          const viewportHeight = window.visualViewport.height;
          const windowHeight = window.innerHeight;
          const bottomBarHeight = windowHeight - viewportHeight;

          if (bottomBarHeight > 0) {
            bottomOffset = Math.max(100, bottomBarHeight + 70);
          }
        } catch (e) {
          bottomOffset = 100;
        }
      }

      return bottomOffset;
    }

    return 30;
  }

  function applyMobileStyles() {
    const chatWindow = document.getElementById('chatbot-window');
    const toggle = document.getElementById('chatbot-toggle');
    const container = document.getElementById('chatbot-widget-container');
    const dragBar = document.getElementById('chatbot-dragbar');

    if (!chatWindow || !toggle || !container) {
      return;
    }

    if (isMobileDevice()) {
      chatWindow.classList.add('mobile');
      container.style.right = '0';
      chatWindow.style.width = '100%';
      chatWindow.style.height = '80vh';
      chatWindow.style.maxHeight = '80vh';
      chatWindow.style.borderRadius = '24px 24px 0 0';
      chatWindow.style.right = '0';
      chatWindow.style.left = '0';
      if (dragBar) dragBar.style.display = 'flex';

      toggle.classList.add('mobile');

      const bottomPos = getSafariBottomPosition();
      toggle.style.bottom = bottomPos + 'px';
      toggle.style.right = '20px';
    } else {
      chatWindow.classList.remove('mobile');
      container.style.right = '0';
      chatWindow.style.width = '420px';
      chatWindow.style.height = '600px';
      if (dragBar) dragBar.style.display = 'none';
      toggle.classList.remove('mobile');
      const bottomPos = getSafariBottomPosition();
      toggle.style.bottom = bottomPos + 'px';
      toggle.style.right = '30px';
      toggle.style.display = 'flex';
      toggle.style.visibility = 'visible';
    }

  }

  window.ChatbotWidget = {
    init: function () {
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initWidget);
      } else {
        initWidget();
      }
    },

    open: function () {
      if (!isOpen) toggleChat();
    },

    close: function () {
      if (isOpen) toggleChat();
    },

    sendMessage: function (message) {
      addMessage(message, 'user');
    },

    getchatKey: function () {
      return getchatKey();
    },

    getWebsitesForchatKey: function (customchatKey) {
      return getWebsitesForchatKey(customchatKey);
    }
  };

  const script = document.currentScript;
  let shouldAutoInit = false;
  let targetScript = script;

  if (!targetScript) {
    const scripts = document.querySelectorAll('script[src*="chatbot-widget"]');
    for (let i = scripts.length - 1; i >= 0; i--) {
      if (scripts[i].getAttribute('chat_url')) {
        targetScript = scripts[i];
        break;
      }
    }
  } else {
  }

  if (targetScript) {
    const hasChatUrl = targetScript.getAttribute('chat_url');
    const autoInitDisabled = targetScript.dataset.autoInit === 'false';
    shouldAutoInit = hasChatUrl && !autoInitDisabled;
  }
  if (shouldAutoInit) {
    window.ChatbotWidget.init();
  }

  // Add ESC key to close chat
  document.addEventListener('keydown', function (event) {
    if ((event.key === 'Escape' || event.key === 'Esc' || event.keyCode === 27) && isOpen) {
      toggleChat();
    }
  });

})();
