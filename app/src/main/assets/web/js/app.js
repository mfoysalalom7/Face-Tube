// FaceTube Master Orchestrator — Connect. Create. Share.
const FaceTubeApp = {
  currentRoute: 'feed',
  activeCommentPostId: null,
  activePlayingVideo: null,
  composerMediaFile: null,
  composerMediaType: null,

  init() {
    this.initTheme();
    this.updateNavUser();
    this.renderSidebarTrends();
    this.setupSearch();
    this.checkOnboardingRequirement();
    this.navigateTo('feed');
  },

  initTheme() {
    const savedTheme = localStorage.getItem('facetube_theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
  },

  toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('facetube_theme', next);
    this.showToast(`Switched to ${next} mode`);
  },

  updateNavUser() {
    const user = FaceTubeAuth.getCurrentUser();
    const avatarEl = document.getElementById('nav-user-avatar');
    if (avatarEl) {
      avatarEl.src = user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=160&q=80';
    }
  },

  checkOnboardingRequirement() {
    const followReqActive = localStorage.getItem('facetube_req_follow_creator') !== 'false';
    const user = FaceTubeAuth.getCurrentUser();

    if (followReqActive && !FaceTubeAuth.isFollowingCreator(user)) {
      this.openModal('onboarding-follow-modal');
    }
  },

  onboardingFollowCreator() {
    const user = FaceTubeAuth.getCurrentUser();
    if (!user.followingIds) user.followingIds = [];
    if (!user.followingIds.includes('user_mdfoysalalom')) {
      user.followingIds.push('user_mdfoysalalom');
    }
    user.followingCount = (user.followingCount || 0) + 1;
    FaceTubeAuth.setCurrentUser(user);

    const followBtn = document.getElementById('onboarding-follow-btn');
    if (followBtn) {
      followBtn.innerText = '✓ Following @mdfoysalalom';
      followBtn.style.background = '#10B981';
      followBtn.style.color = '#fff';
    }

    const continueBtn = document.getElementById('onboarding-continue-btn');
    if (continueBtn) {
      continueBtn.style.opacity = '1';
      continueBtn.style.pointerEvents = 'auto';
    }

    this.showToast('Follow verified! Welcome to FaceTube.');
  },

  completeOnboarding() {
    this.closeModal('onboarding-follow-modal');
    this.showToast('Account setup complete! Explore the feed.');
    this.refreshFeedView();
  },

  navigateTo(route) {
    this.currentRoute = route;

    // Update Nav bar highlights
    document.querySelectorAll('.nav-item').forEach(el => {
      el.classList.toggle('active', el.getAttribute('data-nav') === route);
    });
    document.querySelectorAll('.bottom-nav-btn').forEach(el => {
      el.classList.toggle('active', el.getAttribute('data-nav') === route);
    });

    const main = document.getElementById('main-content');
    main.classList.remove('wide-mode', 'full-bleed');

    switch (route) {
      case 'feed':
        main.innerHTML = FaceTubeFeed.renderFeed();
        break;
      case 'trending':
        main.innerHTML = this.renderTrendingView();
        break;
      case 'shorts':
        main.classList.add('full-bleed');
        main.innerHTML = FaceTubeShorts.renderShortsView();
        break;
      case 'videos':
        main.classList.add('wide-mode');
        main.innerHTML = FaceTubeVideos.renderVideoHub();
        break;
      case 'messages':
        main.classList.add('wide-mode');
        main.innerHTML = FaceTubeMessages.renderMessagesView();
        break;
      case 'notifications':
        main.innerHTML = this.renderNotificationsView();
        break;
      case 'creator-studio':
        main.classList.add('wide-mode');
        main.innerHTML = FaceTubeCreator.renderCreatorStudio();
        break;
      case 'monetization':
        main.classList.add('wide-mode');
        main.innerHTML = FaceTubeCreator.renderCreatorStudio();
        break;
      case 'admin':
        main.classList.add('wide-mode');
        main.innerHTML = FaceTubeAdmin.renderAdminPanel();
        break;
      case 'settings':
        main.innerHTML = this.renderSettingsView();
        break;
      default:
        main.innerHTML = FaceTubeFeed.renderFeed();
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  },

  refreshFeedView() {
    if (this.currentRoute === 'feed') {
      document.getElementById('main-content').innerHTML = FaceTubeFeed.renderFeed();
    }
  },

  renderTrendingView() {
    return `
      <div style="margin-bottom: 20px;">
        <h2 style="font-size: 24px; font-weight: 800;">🔥 Trending on FaceTube</h2>
        <div style="font-size: 13px; color: var(--text-muted);">What's capturing attention right now across video, reels & discussions</div>
      </div>

      <div class="post-card">
        <div style="font-weight: 800; font-size: 16px; margin-bottom: 12px;">Trending Hashtags</div>
        <div style="display: flex; flex-direction: column; gap: 12px;">
          <div style="display: flex; justify-content: space-between; align-items: center; cursor: pointer;" onclick="FaceTubeApp.searchTag('FaceTubeLaunch')">
            <div>
              <div style="font-weight: 800; color: var(--primary);">#FaceTubeLaunch</div>
              <div style="font-size: 12px; color: var(--text-muted);">48.2K posts • Trending in Tech & Social</div>
            </div>
            <span class="tool-chip">Explore</span>
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center; cursor: pointer;" onclick="FaceTubeApp.searchTag('CreatorEconomy')">
            <div>
              <div style="font-weight: 800; color: var(--primary);">#CreatorEconomy</div>
              <div style="font-size: 12px; color: var(--text-muted);">32.1K posts • 70/30 Revenue Milestone</div>
            </div>
            <span class="tool-chip">Explore</span>
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center; cursor: pointer;" onclick="FaceTubeApp.searchTag('MdFoysalAlom')">
            <div>
              <div style="font-weight: 800; color: var(--gold);">#MdFoysalAlom</div>
              <div style="font-size: 12px; color: var(--text-muted);">29.4K posts • Founder Keynote & Vision</div>
            </div>
            <span class="tool-chip">Explore</span>
          </div>
        </div>
      </div>
    `;
  },

  renderNotificationsView() {
    return `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
        <h2 style="font-size: 22px; font-weight: 800;">Notifications</h2>
        <button class="tool-chip" onclick="FaceTubeApp.showToast('All notifications marked as read')">Mark all as read</button>
      </div>

      <div style="display: flex; flex-direction: column; gap: 8px;">
        <div class="post-card" style="display: flex; gap: 12px; align-items: center; padding: 12px;">
          <div style="font-size: 24px;">👑</div>
          <div style="flex: 1;">
            <div style="font-weight: 700; font-size: 13px;"><b>Md Foysal Alom</b> posted a new announcement: FaceTube Keynote 2026.</div>
            <div style="font-size: 11px; color: var(--text-muted);">2 hours ago</div>
          </div>
        </div>
        <div class="post-card" style="display: flex; gap: 12px; align-items: center; padding: 12px;">
          <div style="font-size: 24px;">💰</div>
          <div style="flex: 1;">
            <div style="font-weight: 700; font-size: 13px;">Monetization Update: You reached 1,240 followers and are eligible to apply!</div>
            <div style="font-size: 11px; color: var(--text-muted);">5 hours ago</div>
          </div>
        </div>
        <div class="post-card" style="display: flex; gap: 12px; align-items: center; padding: 12px;">
          <div style="font-size: 24px;">❤️</div>
          <div style="flex: 1;">
            <div style="font-weight: 700; font-size: 13px;"><b>Sarah Chen</b> and 14 others liked your comment.</div>
            <div style="font-size: 11px; color: var(--text-muted);">1 day ago</div>
          </div>
        </div>
      </div>
    `;
  },

  renderSettingsView() {
    const user = FaceTubeAuth.getCurrentUser();
    return `
      <div style="margin-bottom: 20px;">
        <h2 style="font-size: 24px; font-weight: 800;">Settings & Privacy</h2>
        <div style="font-size: 13px; color: var(--text-muted);">Account governance, theme preferences & personal data download</div>
      </div>

      <div class="post-card" style="margin-bottom: 16px;">
        <div style="font-weight: 800; font-size: 16px; margin-bottom: 12px;">Account Details</div>
        <div style="display: flex; gap: 12px; align-items: center; margin-bottom: 14px;">
          <img src="${user.avatar}" style="width: 54px; height: 54px; border-radius: 50%; object-fit: cover;">
          <div>
            <div style="font-weight: 800; font-size: 15px;">${user.name}</div>
            <div style="font-size: 13px; color: var(--text-muted);">@${user.username} • ${user.email}</div>
          </div>
        </div>
        <button class="btn-secondary" style="font-size: 12px;" onclick="FaceTubeApp.openProfile('${user.username}')">View Public Profile</button>
      </div>

      <div class="post-card" style="margin-bottom: 16px;">
        <div style="font-weight: 800; font-size: 16px; margin-bottom: 12px;">Privacy & Data Control</div>
        <div style="display: flex; flex-direction: column; gap: 10px;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <div>
              <div style="font-weight: 700; font-size: 13px;">Private Account</div>
              <div style="font-size: 11px; color: var(--text-muted);">Only approved followers see your posts</div>
            </div>
            <input type="checkbox">
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border-color); padding-top: 10px;">
            <div>
              <div style="font-weight: 700; font-size: 13px;">Download My FaceTube Data</div>
              <div style="font-size: 11px; color: var(--text-muted);">Export all your posts, profile, and settings in JSON</div>
            </div>
            <button class="btn-secondary" style="font-size: 11px;" onclick="FaceTubeApp.downloadUserData()">Download JSON</button>
          </div>
        </div>
      </div>

      <div class="post-card">
        <div style="font-weight: 800; font-size: 16px; margin-bottom: 12px;">Account Actions</div>
        <div style="display: flex; gap: 10px;">
          <button class="btn-secondary" onclick="FaceTubeAuth.logout()">Log Out</button>
          <button class="btn-secondary" style="color: #EF4444; border-color: rgba(239, 68, 68, 0.4);" onclick="FaceTubeApp.deleteAccountPrompt()">Delete Account</button>
        </div>
      </div>
    `;
  },

  downloadUserData() {
    const user = FaceTubeAuth.getCurrentUser();
    const posts = FaceTubeFeed.getPosts().filter(p => p.authorId === user.id);
    const exportData = {
      user: user,
      posts: posts,
      exportedAt: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `facetube-data-${user.username}.json`;
    a.click();
    this.showToast('FaceTube user data downloaded successfully!');
  },

  deleteAccountPrompt() {
    const confirmed = prompt('Type DELETE to confirm permanent account deletion:');
    if (confirmed === 'DELETE') {
      FaceTubeAuth.logout();
    }
  },

  openProfile(username) {
    username = username.toLowerCase().replace(/^@/, '');
    const users = FaceTubeAuth.getAllUsers();
    let target = users.find(u => u.username.toLowerCase() === username);
    if (!target && username === 'mdfoysalalom') {
      target = FaceTubeAuth.CREATOR_ACCOUNT;
    }
    if (!target) {
      this.showToast(`User @${username} not found`);
      return;
    }

    const posts = FaceTubeFeed.getPosts().filter(p => p.authorUsername.toLowerCase() === username);

    const main = document.getElementById('main-content');
    main.innerHTML = `
      <div class="post-card" style="padding: 0; overflow: hidden; margin-bottom: 16px;">
        <div style="height: 140px; background: url('${target.cover || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80'}') center/cover;"></div>
        <div style="padding: 16px; position: relative;">
          <img src="${target.avatar}" style="width: 80px; height: 80px; border-radius: 50%; object-fit: cover; border: 4px solid var(--bg-card); position: absolute; top: -40px; left: 16px;" class="${target.username === 'mdfoysalalom' ? 'creator-ring' : ''}">
          <div style="display: flex; justify-content: flex-end; gap: 8px;">
            <button class="btn-primary" onclick="FaceTubeApp.toggleFollow('${target.username}')">Follow</button>
            <button class="btn-secondary" onclick="FaceTubeApp.navigateTo('messages')">Message</button>
          </div>
          <div style="margin-top: 14px;">
            <div style="font-weight: 800; font-size: 18px; display: flex; align-items: center; gap: 6px;">
              ${target.name}
              ${target.verified ? '<span class="verified-badge">✓</span>' : ''}
              ${target.username === 'mdfoysalalom' ? '<span class="creator-badge">Creator & Founder</span>' : ''}
            </div>
            <div style="font-size: 13px; color: var(--text-muted); margin-bottom: 8px;">@${target.username}</div>
            <p style="font-size: 13px; line-height: 1.5; margin-bottom: 12px;">${target.bio || 'Creating content on FaceTube.'}</p>
            <div style="display: flex; gap: 16px; font-size: 13px; font-weight: 700;">
              <span>${(target.followersCount || 0).toLocaleString()} <span style="font-weight: 400; color: var(--text-muted);">Followers</span></span>
              <span>${(target.followingCount || 0).toLocaleString()} <span style="font-weight: 400; color: var(--text-muted);">Following</span></span>
              <span>${posts.length} <span style="font-weight: 400; color: var(--text-muted);">Posts</span></span>
            </div>
          </div>
        </div>
      </div>

      <div style="font-weight: 800; font-size: 16px; margin: 16px 0 10px;">Posts by ${target.name.split(' ')[0]}</div>
      ${posts.length > 0 ? posts.map(p => FaceTubeFeed.renderSinglePost(p, FaceTubeAuth.getCurrentUser())).join('') : '<div style="color: var(--text-muted); font-size: 13px;">No posts published yet.</div>'}
    `;
  },

  openCurrentUserProfile() {
    const user = FaceTubeAuth.getCurrentUser();
    this.openProfile(user.username);
  },

  toggleFollow(username) {
    const user = FaceTubeAuth.getCurrentUser();
    if (!user.followingIds) user.followingIds = [];
    const isFollowing = user.followingIds.includes(username);

    if (isFollowing) {
      user.followingIds = user.followingIds.filter(id => id !== username);
      this.showToast(`Unfollowed @${username}`);
    } else {
      user.followingIds.push(username);
      this.showToast(`Now following @${username} ✓`);
    }
    FaceTubeAuth.setCurrentUser(user);
    this.refreshFeedView();
  },

  openCreateModal() {
    const user = FaceTubeAuth.getCurrentUser();
    document.getElementById('composer-user-name').innerText = user.name;
    document.getElementById('composer-user-avatar').src = user.avatar;
    this.openModal('composer-modal');
  },

  handleComposerMedia(input, type) {
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const url = URL.createObjectURL(file);
      this.composerMediaFile = url;
      this.composerMediaType = type;

      const previewContainer = document.getElementById('composer-media-preview');
      const img = document.getElementById('composer-preview-img');
      const vid = document.getElementById('composer-preview-video');

      previewContainer.style.display = 'block';
      if (type === 'photo') {
        img.src = url;
        img.style.display = 'block';
        vid.style.display = 'none';
      } else {
        vid.src = url;
        vid.style.display = 'block';
        img.style.display = 'none';
      }
    }
  },

  removeComposerMedia() {
    this.composerMediaFile = null;
    this.composerMediaType = null;
    document.getElementById('composer-media-preview').style.display = 'none';
  },

  togglePollEditor() {
    const el = document.getElementById('poll-editor');
    el.style.display = el.style.display === 'none' ? 'block' : 'none';
  },

  insertEmoji(char) {
    const textarea = document.getElementById('composer-text');
    textarea.value += char;
    textarea.focus();
  },

  submitNewPost() {
    const textarea = document.getElementById('composer-text');
    const text = textarea.value.trim();
    if (!text && !this.composerMediaFile) {
      this.showToast('Please add text or attach media to post!');
      return;
    }

    const currentUser = FaceTubeAuth.getCurrentUser();
    let pollObj = null;
    const opt1 = document.getElementById('poll-option-1').value.trim();
    const opt2 = document.getElementById('poll-option-2').value.trim();
    if (opt1 && opt2) {
      pollObj = {
        question: text.split('\n')[0] || 'Community Poll',
        options: [
          { text: opt1, votes: 0 },
          { text: opt2, votes: 0 }
        ],
        userVote: null
      };
    }

    const newPost = {
      id: 'post_' + Date.now(),
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorUsername: currentUser.username,
      authorAvatar: currentUser.avatar,
      isCreator: true,
      verified: currentUser.verified || false,
      content: text,
      timestamp: 'Just now',
      likesCount: 0,
      isLiked: false,
      isSaved: false,
      mediaType: this.composerMediaType,
      mediaUrl: this.composerMediaFile,
      poll: pollObj,
      comments: []
    };

    const posts = FaceTubeFeed.getPosts();
    posts.unshift(newPost);
    FaceTubeFeed.savePosts(posts);

    // Reset composer
    textarea.value = '';
    this.removeComposerMedia();
    document.getElementById('poll-editor').style.display = 'none';
    this.closeModal('composer-modal');
    this.showToast('Post published to FaceTube feed! 🚀');
    this.navigateTo('feed');
  },

  submitComment() {
    const input = document.getElementById('comment-input-field');
    const text = input.value.trim();
    if (!text || !this.activeCommentPostId) return;

    const currentUser = FaceTubeAuth.getCurrentUser();
    const posts = FaceTubeFeed.getPosts();
    const post = posts.find(p => p.id === this.activeCommentPostId);
    if (!post) return;

    if (!post.comments) post.comments = [];
    post.comments.push({
      id: 'c_' + Date.now(),
      authorName: currentUser.name,
      authorUsername: currentUser.username,
      authorAvatar: currentUser.avatar,
      text: text,
      timestamp: 'Just now',
      likesCount: 0
    });

    FaceTubeFeed.savePosts(posts);
    input.value = '';
    FaceTubeFeed.openComments(this.activeCommentPostId);
    this.refreshFeedView();
    this.showToast('Comment added!');
  },

  sharePost(postId) {
    if (navigator.share) {
      navigator.share({
        title: 'FaceTube Post',
        url: window.location.href
      }).catch(() => {});
    } else {
      this.showToast('Post link copied to clipboard!');
    }
  },

  setupSearch() {
    const input = document.getElementById('global-search-input');
    if (input) {
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          this.searchTag(input.value.trim().replace(/^#/, ''));
        }
      });
    }
  },

  searchTag(tag) {
    this.navigateTo('feed');
    FaceTubeFeed.setHashtagFilter(tag);
  },

  renderSidebarTrends() {
    const list = document.getElementById('sidebar-trending-list');
    if (!list) return;
    list.innerHTML = `
      <div style="cursor: pointer;" onclick="FaceTubeApp.searchTag('FaceTubeLaunch')">
        <div style="font-weight: 700; font-size: 13px; color: var(--primary);">#FaceTubeLaunch</div>
        <div style="font-size: 11px; color: var(--text-muted);">48.2K posts</div>
      </div>
      <div style="cursor: pointer;" onclick="FaceTubeApp.searchTag('CreatorEconomy')">
        <div style="font-weight: 700; font-size: 13px; color: var(--primary);">#CreatorEconomy</div>
        <div style="font-size: 11px; color: var(--text-muted);">32.1K posts</div>
      </div>
      <div style="cursor: pointer;" onclick="FaceTubeApp.searchTag('MdFoysalAlom')">
        <div style="font-weight: 700; font-size: 13px; color: var(--gold);">#MdFoysalAlom</div>
        <div style="font-size: 11px; color: var(--text-muted);">29.4K posts</div>
      </div>
    `;
  },

  openUserMenu() {
    const user = FaceTubeAuth.getCurrentUser();
    const action = confirm(`Signed in as ${user.name} (@${user.username})\n\nClick OK to View Profile, or Cancel to Log Out`);
    if (action) {
      this.openProfile(user.username);
    } else {
      FaceTubeAuth.logout();
    }
  },

  quickLoginAsFounder() {
    FaceTubeAuth.setCurrentUser(FaceTubeAuth.CREATOR_ACCOUNT);
    this.closeModal('auth-modal');
    this.updateNavUser();
    this.showToast('Logged in as Md Foysal Alom (Founder & Creator)!');
    this.navigateTo('feed');
  },

  handleLogin() {
    const identifier = document.getElementById('login-identifier').value;
    const password = document.getElementById('login-password').value;
    try {
      FaceTubeAuth.login(identifier, password);
      this.closeModal('auth-modal');
      this.updateNavUser();
      this.showToast('Welcome back to FaceTube!');
      this.navigateTo('feed');
    } catch (err) {
      this.showToast(err.message);
    }
  },

  handleRegister() {
    const name = document.getElementById('reg-name').value;
    const username = document.getElementById('reg-username').value;
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-password').value;
    const dob = document.getElementById('reg-dob').value;
    try {
      FaceTubeAuth.register(name, username, email, password, dob);
      this.closeModal('auth-modal');
      this.updateNavUser();
      this.showToast('Account created successfully!');
      this.checkOnboardingRequirement();
      this.navigateTo('feed');
    } catch (err) {
      this.showToast(err.message);
    }
  },

  switchAuthTab(tab) {
    document.getElementById('login-form').style.display = tab === 'login' ? 'block' : 'none';
    document.getElementById('register-form').style.display = tab === 'register' ? 'block' : 'none';
    document.getElementById('auth-modal-title').innerText = tab === 'login' ? 'Log in to FaceTube' : 'Join FaceTube';
  },

  forgotPassword() {
    const email = prompt('Enter your registered FaceTube email:');
    if (email) this.showToast(`Password reset link sent to ${email}`);
  },

  showLegalModal(type) {
    const title = document.getElementById('legal-modal-title');
    const content = document.getElementById('legal-modal-content');

    if (type === 'terms') {
      title.innerText = 'FaceTube Terms of Service';
      content.innerHTML = `
        <h4>1. Acceptance of Terms</h4>
        <p>By accessing or using FaceTube ("Connect. Create. Share."), you agree to comply with our community terms, content standards, and creator copyright guidelines.</p>
        <h4 style="margin-top: 10px;">2. Creator Rights & Content Ownership</h4>
        <p>Creators retain full copyright ownership of all videos, reels, photos, and music posted on FaceTube.</p>
        <h4 style="margin-top: 10px;">3. Founder Governance & Onboarding</h4>
        <p>Platform rules and onboarding requirements (including following official platform founders) are established for community safety and creator network integrity.</p>
      `;
    } else if (type === 'privacy') {
      title.innerText = 'FaceTube Privacy Policy';
      content.innerHTML = `
        <h4>Data Collection & Transparency</h4>
        <p>FaceTube collects only necessary telemetry for stream delivery, feed optimization, and monetization accuracy. We never sell personal data or plain-text credentials.</p>
        <h4 style="margin-top: 10px;">User Rights</h4>
        <p>Users may download their data or delete their accounts at any time from Settings & Privacy.</p>
      `;
    } else if (type === 'monetization') {
      title.innerText = 'FaceTube Monetization Terms';
      content.innerHTML = `
        <h4>Partner Program Eligibility</h4>
        <p>Eligibility requires meeting platform milestones: 1,000 verified followers and 10,000 valid views. Revenue share is disbursed at 70% to creators upon admin review.</p>
      `;
    } else {
      title.innerText = 'FaceTube Community Guidelines';
      content.innerHTML = `
        <h4>Respect & Safety</h4>
        <p>No harassment, hate speech, spam, copyright infringement, or deceptive scams. Violations will result in account suspension.</p>
      `;
    }

    this.openModal('legal-modal');
  },

  closeVideoTheater() {
    const player = document.getElementById('theater-video-player');
    if (player) player.pause();
    this.closeModal('video-theater-modal');
  },

  toggleCurrentVideoLike() {
    this.showToast('Liked video! Added to Liked Videos.');
  },

  shareCurrentVideo() {
    this.showToast('Video link copied to clipboard!');
  },

  openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.add('active');
  },

  closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.remove('active');
  },

  showToast(message) {
    const container = document.getElementById('toast-container');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerText = message;
    container.appendChild(toast);
    setTimeout(() => {
      toast.remove();
    }, 3200);
  },

  toggleMobileSearch() {
    const bar = document.getElementById('nav-search-bar');
    bar.classList.toggle('mobile-open');
  }
};

window.addEventListener('DOMContentLoaded', () => {
  FaceTubeApp.init();
});
