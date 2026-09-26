// FaceTube Real-Time Messaging & Direct Conversations
const FaceTubeMessages = {
  activeChatId: 'chat_founder',

  getConversations() {
    const raw = localStorage.getItem('facetube_chats');
    if (!raw) {
      const initialChats = [
        {
          id: 'chat_founder',
          participantName: 'Md Foysal Alom',
          participantUsername: 'mdfoysalalom',
          participantAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
          verified: true,
          isFounder: true,
          online: true,
          unread: 0,
          messages: [
            {
              id: 'm1',
              sender: 'them',
              text: 'Welcome to FaceTube! I founded this platform to bring true creator ownership, high quality reels, and open community to everyone. Let me know if you have any feedback or ideas!',
              timestamp: '10:30 AM',
              read: true
            },
            {
              id: 'm2',
              sender: 'me',
              text: 'Hello Md Foysal Alom! The platform looks incredible. I love the smooth reels and the monetization dashboard.',
              timestamp: '10:32 AM',
              read: true
            },
            {
              id: 'm3',
              sender: 'them',
              text: 'Glad to hear that! Keep creating great content and reach out anytime. 🚀',
              timestamp: '10:35 AM',
              read: true
            }
          ]
        },
        {
          id: 'chat_sarah',
          participantName: 'Sarah Chen',
          participantUsername: 'sarahcreates',
          participantAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=160&q=80',
          verified: true,
          isFounder: false,
          online: true,
          unread: 1,
          messages: [
            {
              id: 'sm1',
              sender: 'them',
              text: 'Hey! Loved your recent comment on my Iceland drone reel! Are you into aerial photography too?',
              timestamp: '11:15 AM',
              read: false
            }
          ]
        },
        {
          id: 'chat_tech_group',
          participantName: 'FaceTube Creators Hub (Group)',
          participantUsername: 'creators_group',
          participantAvatar: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=160&q=80',
          verified: true,
          isFounder: false,
          online: true,
          unread: 0,
          messages: [
            {
              id: 'gm1',
              sender: 'them',
              text: 'Reminder: New weekly monetization metrics update every Sunday at midnight GMT!',
              timestamp: 'Yesterday',
              read: true
            }
          ]
        }
      ];
      localStorage.setItem('facetube_chats', JSON.stringify(initialChats));
      return initialChats;
    }
    return JSON.parse(raw);
  },

  renderMessagesView() {
    const chats = this.getConversations();
    const activeChat = chats.find(c => c.id === this.activeChatId) || chats[0];
    this.activeChatId = activeChat.id;

    return `
      <div class="chat-window-container" id="chat-container">
        <!-- Conversations List (Left) -->
        <div class="chat-sidebar">
          <div class="chat-sidebar-header">
            <span>Direct Messages</span>
            <button class="icon-btn" style="width: 32px; height: 32px;" onclick="FaceTubeMessages.newChatPrompt()">✏️</button>
          </div>
          <div class="chat-list">
            ${chats.map(chat => {
              const lastMsg = chat.messages[chat.messages.length - 1];
              return `
                <div class="chat-item ${chat.id === activeChat.id ? 'active' : ''}" onclick="FaceTubeMessages.selectChat('${chat.id}')">
                  <div style="position: relative;">
                    <img src="${chat.participantAvatar}" style="width: 44px; height: 44px; border-radius: 50%; object-fit: cover;" alt="${chat.participantName}">
                    ${chat.online ? '<div style="position: absolute; bottom: 0; right: 0; width: 12px; height: 12px; border-radius: 50%; background: #10B981; border: 2px solid var(--bg-card);"></div>' : ''}
                  </div>
                  <div class="chat-item-meta">
                    <div class="chat-item-name">
                      <span>${chat.participantName}</span>
                      <span style="font-size: 11px; font-weight: 400; color: var(--text-muted);">${lastMsg ? lastMsg.timestamp : ''}</span>
                    </div>
                    <div class="chat-item-snippet">${lastMsg ? lastMsg.text : 'No messages yet'}</div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- Chat Conversation Area (Right) -->
        <div class="chat-conversation-area">
          <div class="chat-conv-header">
            <div style="display: flex; align-items: center; gap: 10px;">
              <button class="icon-btn" style="display: none;" id="mobile-back-chat" onclick="FaceTubeMessages.backToChatList()">←</button>
              <img src="${activeChat.participantAvatar}" style="width: 36px; height: 36px; border-radius: 50%; object-fit: cover;">
              <div>
                <div style="font-weight: 700; font-size: 14px; display: flex; align-items: center; gap: 4px;">
                  ${activeChat.participantName}
                  ${activeChat.verified ? '<span class="verified-badge" style="width: 14px; height: 14px; font-size: 8px;">✓</span>' : ''}
                  ${activeChat.isFounder ? '<span class="creator-badge" style="font-size: 8px; padding: 1px 5px;">Founder</span>' : ''}
                </div>
                <div style="font-size: 11px; color: ${activeChat.online ? '#10B981' : 'var(--text-muted)'};">
                  ${activeChat.online ? '● Online' : 'Offline'}
                </div>
              </div>
            </div>
            <div style="display: flex; gap: 8px;">
              <button class="icon-btn" style="width: 34px; height: 34px;" onclick="FaceTubeApp.showToast('Voice Call initiated (simulated)')">📞</button>
              <button class="icon-btn" style="width: 34px; height: 34px;" onclick="FaceTubeApp.showToast('HD Video Call connected (simulated)')">📹</button>
            </div>
          </div>

          <!-- Messages Scroll List -->
          <div class="chat-messages-scroll" id="chat-messages-container">
            ${activeChat.messages.map(m => `
              <div class="message-bubble ${m.sender === 'me' ? 'outgoing' : 'incoming'}">
                <div>${m.text}</div>
                <div style="font-size: 10px; opacity: 0.7; text-align: right; margin-top: 4px;">
                  ${m.timestamp} ${m.sender === 'me' ? '✓✓' : ''}
                </div>
              </div>
            `).join('')}
          </div>

          <!-- Input Bar -->
          <div class="chat-input-bar">
            <button class="icon-btn" style="width: 36px; height: 36px;" onclick="FaceTubeMessages.insertEmoji('🔥')">🔥</button>
            <input type="text" id="chat-input-text" class="form-input" placeholder="Type a message to ${activeChat.participantName}..." onkeydown="if(event.key==='Enter') FaceTubeMessages.sendMessage()">
            <button class="btn-primary" style="padding: 8px 16px;" onclick="FaceTubeMessages.sendMessage()">Send</button>
          </div>
        </div>
      </div>
    `;
  },

  selectChat(chatId) {
    this.activeChatId = chatId;
    document.getElementById('main-content').innerHTML = this.renderMessagesView();
    this.scrollToBottom();
  },

  sendMessage() {
    const input = document.getElementById('chat-input-text');
    if (!input || !input.value.trim()) return;
    const text = input.value.trim();
    input.value = '';

    const chats = this.getConversations();
    const activeChat = chats.find(c => c.id === this.activeChatId);
    if (!activeChat) return;

    const newMsg = {
      id: 'm_' + Date.now(),
      sender: 'me',
      text: text,
      timestamp: 'Just now',
      read: true
    };
    activeChat.messages.push(newMsg);
    localStorage.setItem('facetube_chats', JSON.stringify(chats));

    document.getElementById('main-content').innerHTML = this.renderMessagesView();
    this.scrollToBottom();

    // If chatting with Md Foysal Alom, simulate an instant authentic founder reply!
    if (activeChat.participantUsername === 'mdfoysalalom') {
      setTimeout(() => {
        const founderResponses = [
          'Thank you for your message! Building FaceTube into a creator-first platform is our mission every single day.',
          'Great point! We are optimizing video playback speeds and 4K transcoding right now.',
          'Love your energy! Keep uploading your reels and growing your community on FaceTube.'
        ];
        const replyText = founderResponses[Math.floor(Math.random() * founderResponses.length)];
        activeChat.messages.push({
          id: 'm_' + Date.now(),
          sender: 'them',
          text: replyText,
          timestamp: 'Just now',
          read: true
        });
        localStorage.setItem('facetube_chats', JSON.stringify(chats));
        document.getElementById('main-content').innerHTML = FaceTubeMessages.renderMessagesView();
        FaceTubeMessages.scrollToBottom();
      }, 1200);
    }
  },

  insertEmoji(char) {
    const input = document.getElementById('chat-input-text');
    if (input) {
      input.value += char;
      input.focus();
    }
  },

  scrollToBottom() {
    setTimeout(() => {
      const container = document.getElementById('chat-messages-container');
      if (container) container.scrollTop = container.scrollHeight;
    }, 50);
  },

  newChatPrompt() {
    const user = prompt('Enter FaceTube username to message (e.g. sarahcreates, marcus_tech, mdfoysalalom):');
    if (!user) return;
    FaceTubeApp.showToast(`Started conversation with @${user}`);
  }
};
