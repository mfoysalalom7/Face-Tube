// FaceTube Feed, Posts, Polls, Advanced Filtering, and Interaction System
const FaceTubeFeed = {
  // Advanced Filter State
  filterState: {
    sort: 'recommended', // 'recommended' | 'latest' | 'following'
    type: 'all',         // 'all' | 'post' | 'video' | 'short'
    hashtag: null,       // string or null
    customTagInput: ''
  },

  getPosts() {
    const raw = localStorage.getItem('facetube_posts');
    if (!raw) {
      const initialPosts = [
        {
          id: 'post_founder_welcome',
          itemType: 'post',
          authorId: 'user_mdfoysalalom',
          authorName: 'Md Foysal Alom',
          authorUsername: 'mdfoysalalom',
          authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
          isCreator: true,
          verified: true,
          content: '🚀 Welcome to FaceTube! Connect. Create. Share.\n\nWe designed FaceTube from the ground up to give creators authentic control, lightning-fast short reels, transparent monetization (1K followers + 10K views threshold), and true community ownership.\n\nWhat feature are you most excited to try first? #FaceTube #CreatorEconomy #ConnectCreateShare #Founder',
          timestamp: '2 hours ago',
          likesCount: 3842,
          isLiked: false,
          isSaved: false,
          mediaType: 'image',
          mediaUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
          hashtags: ['FaceTube', 'CreatorEconomy', 'ConnectCreateShare', 'Founder'],
          poll: {
            question: 'Which format will you create on FaceTube?',
            options: [
              { text: '⚡ Short Reels & Stories', votes: 1420 },
              { text: '🎬 Long-form 4K Videos', votes: 890 },
              { text: '💬 Community Discussions & Polls', votes: 610 }
            ],
            userVote: null
          },
          comments: [
            {
              id: 'c1',
              authorName: 'Sarah Chen',
              authorUsername: 'sarahcreates',
              authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=160&q=80',
              text: 'Congratulations @mdfoysalalom! The UI and the creator revenue program are phenomenal!',
              timestamp: '1 hour ago',
              likesCount: 145,
              replies: [
                {
                  id: 'r1',
                  authorName: 'Md Foysal Alom',
                  authorUsername: 'mdfoysalalom',
                  text: 'Thank you Sarah! Excited to see your drone cinematography reels here.',
                  timestamp: '45 mins ago',
                  likesCount: 88
                }
              ]
            }
          ]
        },
        {
          id: 'post_sarah_drone',
          itemType: 'post',
          authorId: 'user_sarah',
          authorName: 'Sarah Chen',
          authorUsername: 'sarahcreates',
          authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=160&q=80',
          isCreator: true,
          verified: true,
          content: 'Golden hour drone shot over the coastal cliffs. Shot in 4K ProRes 60fps. What do you think of this color grade? #Cinematography #FaceTube #Travel',
          timestamp: '4 hours ago',
          likesCount: 1290,
          isLiked: true,
          isSaved: true,
          mediaType: 'image',
          mediaUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
          hashtags: ['Cinematography', 'FaceTube', 'Travel'],
          comments: []
        },
        {
          id: 'post_marcus_tech',
          itemType: 'post',
          authorId: 'user_marcus',
          authorName: 'Marcus Brody',
          authorUsername: 'marcus_tech',
          authorAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=160&q=80',
          isCreator: true,
          verified: false,
          content: 'Just deployed our newest real-time messaging pipeline using WebSockets and Redis. Clean architecture always pays off! #Coding #Tech #FaceTube',
          timestamp: '6 hours ago',
          likesCount: 420,
          isLiked: false,
          isSaved: false,
          mediaType: null,
          mediaUrl: null,
          hashtags: ['Coding', 'Tech', 'FaceTube'],
          comments: []
        }
      ];
      localStorage.setItem('facetube_posts', JSON.stringify(initialPosts));
      return initialPosts;
    }
    return JSON.parse(raw);
  },

  savePosts(posts) {
    localStorage.setItem('facetube_posts', JSON.stringify(posts));
  },

  // Extract all hashtags across posts, videos, and shorts
  getAllAvailableHashtags() {
    const tagsMap = new Map();

    // From Posts
    const posts = this.getPosts();
    posts.forEach(p => {
      const tags = this.extractTagsFromText(p.content || '');
      (p.hashtags || []).concat(tags).forEach(t => {
        const clean = t.replace(/^#/, '').trim();
        if (clean) tagsMap.set(clean.toLowerCase(), clean);
      });
    });

    // From Videos
    if (window.FaceTubeVideos && FaceTubeVideos.getVideos) {
      FaceTubeVideos.getVideos().forEach(v => {
        if (v.category) tagsMap.set(v.category.toLowerCase(), v.category);
        const tags = this.extractTagsFromText((v.title || '') + ' ' + (v.description || ''));
        tags.forEach(t => {
          const clean = t.replace(/^#/, '').trim();
          if (clean) tagsMap.set(clean.toLowerCase(), clean);
        });
      });
    }

    // From Shorts
    if (window.FaceTubeShorts && FaceTubeShorts.getShorts) {
      FaceTubeShorts.getShorts().forEach(s => {
        const tags = this.extractTagsFromText(s.caption || '');
        tags.forEach(t => {
          const clean = t.replace(/^#/, '').trim();
          if (clean) tagsMap.set(clean.toLowerCase(), clean);
        });
      });
    }

    // Standard curated tags
    const curated = ['FaceTube', 'CreatorEconomy', 'Tech', 'Travel', 'Cinematography', 'Coding', 'ASMR', 'Founder'];
    curated.forEach(t => tagsMap.set(t.toLowerCase(), t));

    return Array.from(tagsMap.values());
  },

  extractTagsFromText(text) {
    if (!text) return [];
    const matches = text.match(/#([a-zA-Z0-9_\u0080-\uFFFF]+)/g) || [];
    return matches.map(m => m.replace(/^#/, ''));
  },

  // Unified items aggregation
  getAllUnifiedItems() {
    const items = [];

    // 1. Regular Posts
    const posts = this.getPosts();
    posts.forEach(p => {
      const explicitTags = p.hashtags || [];
      const textTags = this.extractTagsFromText(p.content || '');
      items.push({
        ...p,
        itemType: 'post',
        allHashtags: Array.from(new Set(explicitTags.concat(textTags).map(t => t.toLowerCase())))
      });
    });

    // 2. Videos
    if (window.FaceTubeVideos && FaceTubeVideos.getVideos) {
      FaceTubeVideos.getVideos().forEach(v => {
        const textTags = this.extractTagsFromText((v.title || '') + ' ' + (v.description || ''));
        const catTag = v.category ? [v.category.toLowerCase()] : [];
        items.push({
          id: v.id,
          itemType: 'video',
          authorId: v.creatorId,
          authorName: v.creatorName,
          authorUsername: v.creatorUsername,
          authorAvatar: v.creatorAvatar,
          verified: v.verified,
          isCreator: true,
          title: v.title,
          content: v.description,
          timestamp: v.uploadDate,
          likesCount: v.likesCount,
          viewsCount: v.viewsCount,
          duration: v.duration,
          category: v.category,
          thumbnail: v.thumbnail,
          videoUrl: v.videoUrl,
          allHashtags: Array.from(new Set(textTags.map(t => t.toLowerCase()).concat(catTag).concat(['video', 'tech'])))
        });
      });
    }

    // 3. Shorts
    if (window.FaceTubeShorts && FaceTubeShorts.getShorts) {
      FaceTubeShorts.getShorts().forEach(s => {
        const textTags = this.extractTagsFromText(s.caption || '');
        items.push({
          id: s.id,
          itemType: 'short',
          authorId: s.creatorId,
          authorName: s.creatorName,
          authorUsername: s.creatorUsername,
          authorAvatar: s.creatorAvatar,
          verified: s.verified,
          isCreator: true,
          title: s.caption,
          content: s.caption,
          timestamp: 'Recent Reel',
          likesCount: s.likesCount,
          viewsCount: s.viewsCount,
          commentsCount: s.commentsCount,
          audioTitle: s.audioTitle,
          videoUrl: s.videoUrl,
          isLiked: s.isLiked,
          allHashtags: Array.from(new Set(textTags.map(t => t.toLowerCase()).concat(['shorts', 'reels'])))
        });
      });
    }

    return items;
  },

  // Main Feed Renderer
  renderFeed(explicitSort = null) {
    if (explicitSort) {
      this.filterState.sort = explicitSort;
    }

    const currentUser = FaceTubeAuth.getCurrentUser();
    const allItems = this.getAllUnifiedItems();
    const availableTags = this.getAllAvailableHashtags();

    // Calculate dynamic counts per type before type filtering
    let baseFilteredByTag = allItems;
    if (this.filterState.hashtag) {
      const tagLower = this.filterState.hashtag.toLowerCase();
      baseFilteredByTag = allItems.filter(item => {
        return item.allHashtags && item.allHashtags.some(t => t === tagLower || t.includes(tagLower));
      });
    }

    const counts = {
      all: baseFilteredByTag.length,
      post: baseFilteredByTag.filter(i => i.itemType === 'post').length,
      video: baseFilteredByTag.filter(i => i.itemType === 'video').length,
      short: baseFilteredByTag.filter(i => i.itemType === 'short').length
    };

    // Apply Type Filter
    let filtered = baseFilteredByTag;
    if (this.filterState.type !== 'all') {
      filtered = filtered.filter(item => item.itemType === this.filterState.type);
    }

    // Apply Audience & Sort Filter
    if (this.filterState.sort === 'latest') {
      // Sort by recency
      filtered.sort((a, b) => (b.id > a.id ? 1 : -1));
    } else if (this.filterState.sort === 'following') {
      const following = currentUser.followingIds || [];
      filtered = filtered.filter(i => following.includes(i.authorId) || i.authorId === currentUser.id);
    } else {
      // 'recommended' - sort by popularity / score
      filtered.sort((a, b) => {
        const scoreA = (a.likesCount || 0) * 2 + (a.viewsCount ? a.viewsCount / 100 : 0);
        const scoreB = (b.likesCount || 0) * 2 + (b.viewsCount ? b.viewsCount / 100 : 0);
        return scoreB - scoreA;
      });
    }

    const isAnyFilterActive = this.filterState.type !== 'all' || this.filterState.hashtag !== null;

    let html = `
      <!-- Stories Bar -->
      <div style="display: flex; gap: 12px; overflow-x: auto; padding: 4px 0 14px; margin-bottom: 12px;">
        <div style="display: flex; flex-direction: column; align-items: center; gap: 4px; cursor: pointer;" onclick="FaceTubeApp.openCreateModal()">
          <div style="width: 58px; height: 58px; border-radius: 50%; border: 2px dashed var(--primary); display: flex; align-items: center; justify-content: center; font-size: 22px; background: var(--bg-card);">
            +
          </div>
          <span style="font-size: 11px; font-weight: 600;">Add Story</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 4px; cursor: pointer;" onclick="FaceTubeApp.openProfile('mdfoysalalom')">
          <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80" style="width: 58px; height: 58px; border-radius: 50%; border: 3px solid #F59E0B; object-fit: cover;">
          <span style="font-size: 11px; font-weight: 700; color: #F59E0B;">Founder</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 4px; cursor: pointer;" onclick="FaceTubeApp.openProfile('sarahcreates')">
          <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=160&q=80" style="width: 58px; height: 58px; border-radius: 50%; border: 2px solid var(--primary); object-fit: cover;">
          <span style="font-size: 11px; font-weight: 600;">Sarah</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 4px; cursor: pointer;" onclick="FaceTubeApp.openProfile('marcus_tech')">
          <img src="https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=160&q=80" style="width: 58px; height: 58px; border-radius: 50%; border: 2px solid var(--primary); object-fit: cover;">
          <span style="font-size: 11px; font-weight: 600;">Marcus</span>
        </div>
      </div>

      <!-- Quick Composer Card -->
      <div class="composer-card">
        <div class="composer-input-row" onclick="FaceTubeApp.openCreateModal()" style="cursor: pointer;">
          <img src="${currentUser.avatar || ''}" class="author-avatar" alt="Me">
          <div style="flex: 1; background: var(--bg-input); padding: 12px 16px; border-radius: var(--radius-full); font-size: 14px; color: var(--text-muted); border: 1px solid var(--border-color);">
            What's on your mind, ${currentUser.name.split(' ')[0]}? Share reels, thoughts...
          </div>
        </div>
        <div style="display: flex; justify-content: space-around; margin-top: 12px; padding-top: 10px; border-top: 1px solid var(--border-color);">
          <button class="tool-chip" onclick="FaceTubeApp.openCreateModal()">📷 Photo</button>
          <button class="tool-chip" onclick="FaceTubeVideos.openUploadVideoModal()">🎥 Video</button>
          <button class="tool-chip" onclick="FaceTubeShorts.uploadShort()">⚡ Reel/Short</button>
          <button class="tool-chip" onclick="FaceTubeApp.openCreateModal()">📊 Poll</button>
        </div>
      </div>

      <!-- ADVANCED FEED FILTER PANEL -->
      <div class="feed-filter-panel">
        <!-- 1. Content Type Filter Group -->
        <div class="filter-section-header">
          <span class="filter-section-title">
            <span>🎯 Content Type</span>
          </span>
          <div style="display: flex; gap: 4px;">
            <button class="action-btn ${this.filterState.sort === 'recommended' ? 'liked' : ''}" style="font-size: 11px; padding: 3px 8px; border-radius: var(--radius-full);" onclick="FaceTubeFeed.setSortFilter('recommended')">✨ Recommended</button>
            <button class="action-btn ${this.filterState.sort === 'latest' ? 'liked' : ''}" style="font-size: 11px; padding: 3px 8px; border-radius: var(--radius-full);" onclick="FaceTubeFeed.setSortFilter('latest')">🕒 Latest</button>
            <button class="action-btn ${this.filterState.sort === 'following' ? 'liked' : ''}" style="font-size: 11px; padding: 3px 8px; border-radius: var(--radius-full);" onclick="FaceTubeFeed.setSortFilter('following')">👥 Following</button>
          </div>
        </div>

        <div class="type-filter-group">
          <button class="type-filter-btn ${this.filterState.type === 'all' ? 'active' : ''}" onclick="FaceTubeFeed.setTypeFilter('all')">
            <span>🌐 All Content</span>
            <span class="type-count-badge">${counts.all}</span>
          </button>
          <button class="type-filter-btn ${this.filterState.type === 'post' ? 'active' : ''}" onclick="FaceTubeFeed.setTypeFilter('post')">
            <span>📝 Posts</span>
            <span class="type-count-badge">${counts.post}</span>
          </button>
          <button class="type-filter-btn ${this.filterState.type === 'video' ? 'active' : ''}" onclick="FaceTubeFeed.setTypeFilter('video')">
            <span>🎬 Videos</span>
            <span class="type-count-badge">${counts.video}</span>
          </button>
          <button class="type-filter-btn ${this.filterState.type === 'short' ? 'active' : ''}" onclick="FaceTubeFeed.setTypeFilter('short')">
            <span>⚡ Shorts & Reels</span>
            <span class="type-count-badge">${counts.short}</span>
          </button>
        </div>

        <!-- 2. Hashtag Discovery Ribbon -->
        <div style="border-top: 1px solid var(--border-color); padding-top: 10px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <span style="font-size: 12px; font-weight: 700; color: var(--text-muted); display: flex; align-items: center; gap: 4px;">
              <span>🏷️ Filter by Hashtag:</span>
            </span>
            <div style="display: flex; align-items: center; gap: 6px;">
              <input type="text" id="custom-hashtag-input" placeholder="#custom tag..." 
                     value="${this.filterState.customTagInput || ''}"
                     style="background: var(--bg-input); border: 1px solid var(--border-color); border-radius: var(--radius-full); padding: 2px 10px; font-size: 11px; color: #fff; width: 110px;"
                     onkeydown="if(event.key==='Enter') FaceTubeFeed.applyCustomHashtag(this.value)">
              <button class="tool-chip" style="font-size: 11px; padding: 2px 8px;" onclick="FaceTubeFeed.applyCustomHashtag(document.getElementById('custom-hashtag-input').value)">Apply</button>
            </div>
          </div>

          <div class="hashtag-discovery-bar">
            <span class="hashtag-chip ${this.filterState.hashtag === null ? 'active' : ''}" onclick="FaceTubeFeed.setHashtagFilter(null)">
              ✨ All Hashtags
            </span>
            ${availableTags.map(tag => {
              const isActive = this.filterState.hashtag && this.filterState.hashtag.toLowerCase() === tag.toLowerCase();
              return `
                <span class="hashtag-chip ${isActive ? 'active' : ''}" onclick="FaceTubeFeed.setHashtagFilter('${tag}')">
                  #${tag}
                </span>
              `;
            }).join('')}
          </div>
        </div>

        <!-- 3. Active Filter Summary Indicator -->
        ${isAnyFilterActive ? `
          <div class="filter-active-summary">
            <div style="display: flex; align-items: center; gap: 6px; flex-wrap: wrap;">
              <span style="font-weight: 700; color: var(--primary);">Active Filters:</span>
              ${this.filterState.type !== 'all' ? `
                <span class="filter-tag-pill">
                  <span>Type: <b>${this.getTypeLabel(this.filterState.type)}</b></span>
                  <span class="filter-tag-remove" onclick="FaceTubeFeed.setTypeFilter('all')">✕</span>
                </span>
              ` : ''}
              ${this.filterState.hashtag ? `
                <span class="filter-tag-pill">
                  <span>#<b>${this.filterState.hashtag}</b></span>
                  <span class="filter-tag-remove" onclick="FaceTubeFeed.setHashtagFilter(null)">✕</span>
                </span>
              ` : ''}
              <span style="color: var(--text-muted);">(${filtered.length} found)</span>
            </div>
            <button class="tool-chip" style="font-size: 11px; color: var(--primary);" onclick="FaceTubeFeed.clearFilters()">Clear All</button>
          </div>
        ` : ''}
      </div>
    `;

    // Render Filtered Content Feed Items
    if (filtered.length === 0) {
      html += `
        <div class="post-card" style="text-align: center; padding: 48px 20px;">
          <div style="font-size: 42px; margin-bottom: 12px;">🔍</div>
          <div style="font-weight: 800; font-size: 17px; margin-bottom: 6px;">No content found for this filter</div>
          <div style="font-size: 13px; color: var(--text-muted); margin-bottom: 18px; max-width: 380px; margin-left: auto; margin-right: auto;">
            Try changing the content type, picking another hashtag, or clearing the active filters to see all FaceTube updates.
          </div>
          <div style="display: flex; justify-content: center; gap: 10px;">
            <button class="btn-primary" onclick="FaceTubeFeed.clearFilters()">Reset All Filters</button>
            <button class="btn-secondary" onclick="FaceTubeApp.openCreateModal()">Create #${this.filterState.hashtag || 'FaceTube'} Post</button>
          </div>
        </div>
      `;
    } else {
      filtered.forEach(item => {
        if (item.itemType === 'post') {
          html += this.renderSinglePost(item, currentUser);
        } else if (item.itemType === 'video') {
          html += this.renderFeedVideoCard(item, currentUser);
        } else if (item.itemType === 'short') {
          html += this.renderFeedShortCard(item, currentUser);
        }
      });
    }

    return html;
  },

  getTypeLabel(type) {
    switch (type) {
      case 'post': return 'Posts';
      case 'video': return 'Videos';
      case 'short': return 'Shorts & Reels';
      default: return 'All Content';
    }
  },

  setTypeFilter(type) {
    this.filterState.type = type;
    FaceTubeApp.showToast(`Showing ${this.getTypeLabel(type)}`);
    document.getElementById('main-content').innerHTML = this.renderFeed();
  },

  setSortFilter(sort) {
    this.filterState.sort = sort;
    document.getElementById('main-content').innerHTML = this.renderFeed();
  },

  setHashtagFilter(tag) {
    if (this.filterState.hashtag && tag && this.filterState.hashtag.toLowerCase() === tag.toLowerCase()) {
      this.filterState.hashtag = null; // toggle off if clicked again
    } else {
      this.filterState.hashtag = tag;
    }
    this.filterState.customTagInput = this.filterState.hashtag || '';
    if (tag) {
      FaceTubeApp.showToast(`Filtered by #${tag}`);
    } else {
      FaceTubeApp.showToast('Showing all hashtags');
    }
    document.getElementById('main-content').innerHTML = this.renderFeed();
  },

  applyCustomHashtag(inputVal) {
    const clean = (inputVal || '').replace(/^#/, '').trim();
    if (!clean) {
      this.setHashtagFilter(null);
    } else {
      this.setHashtagFilter(clean);
    }
  },

  clearFilters() {
    this.filterState.type = 'all';
    this.filterState.hashtag = null;
    this.filterState.customTagInput = '';
    this.filterState.sort = 'recommended';
    FaceTubeApp.showToast('Filters cleared');
    document.getElementById('main-content').innerHTML = this.renderFeed();
  },

  // Specialized Post Card
  renderSinglePost(post, currentUser) {
    const isOwner = post.authorId === currentUser.id;
    const isLiked = post.isLiked;
    const isSaved = post.isSaved;

    // Parse hashtags and mentions with interactive filter trigger
    let formattedContent = (post.content || '')
      .replace(/#([a-zA-Z0-9_\u0080-\uFFFF]+)/g, '<span class="post-hashtag" onclick="FaceTubeFeed.setHashtagFilter(\'$1\')">#$1</span>')
      .replace(/@([a-zA-Z0-9_\u0080-\uFFFF]+)/g, '<span class="post-mention" onclick="FaceTubeApp.openProfile(\'$1\')">@$1</span>');

    let mediaHtml = '';
    if (post.mediaUrl) {
      if (post.mediaType === 'video') {
        mediaHtml = `
          <div class="post-media-container">
            <video class="post-media-video" controls src="${post.mediaUrl}"></video>
          </div>
        `;
      } else {
        mediaHtml = `
          <div class="post-media-container">
            <img class="post-media-image" src="${post.mediaUrl}" loading="lazy" alt="Post media">
          </div>
        `;
      }
    }

    let pollHtml = '';
    if (post.poll && post.poll.options) {
      const totalVotes = post.poll.options.reduce((sum, opt) => sum + (opt.votes || 0), 0);
      pollHtml = `
        <div class="poll-container">
          <div class="poll-question">📊 ${post.poll.question}</div>
          ${post.poll.options.map((opt, idx) => {
            const pct = totalVotes > 0 ? Math.round((opt.votes / totalVotes) * 100) : 0;
            return `
              <div class="poll-option" onclick="FaceTubeFeed.votePoll('${post.id}', ${idx})">
                <div class="poll-progress-bar" style="width: ${pct}%"></div>
                <span>${opt.text}</span>
                <span><b>${pct}%</b> (${opt.votes})</span>
              </div>
            `;
          }).join('')}
          <div style="font-size: 11px; color: var(--text-muted); margin-top: 6px;">Total Votes: ${totalVotes} • Live FaceTube Poll</div>
        </div>
      `;
    }

    return `
      <article class="post-card" id="post-${post.id}">
        <div class="post-header">
          <div class="post-author-info" onclick="FaceTubeApp.openProfile('${post.authorUsername}')" style="cursor: pointer;">
            <img src="${post.authorAvatar}" class="author-avatar ${post.authorUsername === 'mdfoysalalom' ? 'creator-ring' : ''}" alt="${post.authorName}">
            <div class="author-meta">
              <div class="author-name-row">
                ${post.authorName}
                ${post.verified ? '<span class="verified-badge">✓</span>' : ''}
                ${post.authorUsername === 'mdfoysalalom' ? '<span class="creator-badge" style="font-size: 9px; padding: 2px 6px;">Founder</span>' : ''}
              </div>
              <div style="display: flex; gap: 6px; align-items: center;">
                <span class="author-username">@${post.authorUsername}</span>
                <span style="font-size: 10px; color: var(--text-muted);">•</span>
                <span class="post-timestamp">${post.timestamp}</span>
              </div>
            </div>
          </div>
          <div style="display: flex; align-items: center; gap: 6px;">
            <span class="tool-chip" style="font-size: 10px; padding: 2px 6px;">📝 Post</span>
            <button class="icon-btn" style="width: 32px; height: 32px; font-size: 14px;" onclick="FaceTubeFeed.openPostMenu('${post.id}')">⋯</button>
          </div>
        </div>

        <div class="post-content-text">${formattedContent}</div>
        ${pollHtml}
        ${mediaHtml}

        <div class="post-actions-row">
          <button class="action-btn ${isLiked ? 'liked' : ''}" onclick="FaceTubeFeed.toggleLike('${post.id}')">
            <span>${isLiked ? '❤️' : '🤍'}</span>
            <span>${post.likesCount || 0}</span>
          </button>
          <button class="action-btn" onclick="FaceTubeFeed.openComments('${post.id}')">
            <span>💬</span>
            <span>${post.comments ? post.comments.length : 0}</span>
          </button>
          <button class="action-btn ${isSaved ? 'saved' : ''}" onclick="FaceTubeFeed.toggleSave('${post.id}')">
            <span>${isSaved ? '★' : '☆'}</span>
            <span>Save</span>
          </button>
          <button class="action-btn" onclick="FaceTubeApp.sharePost('${post.id}')">
            <span>🔗</span>
            <span>Share</span>
          </button>
        </div>
      </article>
    `;
  },

  // Specialized Video Feed Card
  renderFeedVideoCard(video, currentUser) {
    let formattedDesc = (video.content || video.title || '')
      .replace(/#([a-zA-Z0-9_\u0080-\uFFFF]+)/g, '<span class="post-hashtag" onclick="FaceTubeFeed.setHashtagFilter(\'$1\')">#$1</span>');

    return `
      <article class="post-card" id="video-card-${video.id}">
        <div class="post-header">
          <div class="post-author-info" onclick="FaceTubeApp.openProfile('${video.authorUsername}')" style="cursor: pointer;">
            <img src="${video.authorAvatar}" class="author-avatar" alt="${video.authorName}">
            <div class="author-meta">
              <div class="author-name-row">
                ${video.authorName}
                ${video.verified ? '<span class="verified-badge">✓</span>' : ''}
              </div>
              <div style="display: flex; gap: 6px; align-items: center;">
                <span class="author-username">@${video.authorUsername}</span>
                <span style="font-size: 10px; color: var(--text-muted);">•</span>
                <span class="post-timestamp">${video.timestamp}</span>
              </div>
            </div>
          </div>
          <div style="display: flex; align-items: center; gap: 6px;">
            <span class="tool-chip" style="font-size: 10px; padding: 2px 6px; background: rgba(59, 130, 246, 0.15); color: #3B82F6; border: 1px solid rgba(59, 130, 246, 0.3);">🎬 Video</span>
            <button class="icon-btn" style="width: 32px; height: 32px; font-size: 14px;" onclick="FaceTubeApp.showToast('Video link copied')">⋯</button>
          </div>
        </div>

        <div style="font-weight: 800; font-size: 16px; margin-bottom: 8px; line-height: 1.4;">${video.title}</div>
        <div class="post-content-text" style="margin-bottom: 10px; color: var(--text-secondary); font-size: 13px;">${formattedDesc}</div>

        <!-- Video Player Banner with Play Overlay -->
        <div class="feed-video-banner" onclick="FaceTubeVideos.playVideo('${video.id}')">
          <img src="${video.thumbnail}" loading="lazy" alt="${video.title}">
          <div class="feed-play-overlay">
            <div class="feed-play-btn-circle">▶</div>
          </div>
          <span class="video-duration-badge" style="position: absolute; bottom: 8px; right: 8px;">${video.duration || 'Video'}</span>
          <span style="position: absolute; bottom: 8px; left: 8px; background: rgba(0,0,0,0.7); color: #fff; font-size: 11px; padding: 2px 8px; border-radius: 4px; font-weight: 600;">
            ${video.category || 'Tech'}
          </span>
        </div>

        <div class="post-actions-row">
          <button class="action-btn" onclick="FaceTubeVideos.playVideo('${video.id}')">
            <span>▶ Watch Video</span>
            <span style="font-size: 12px; color: var(--text-muted);">(${(video.viewsCount || 0).toLocaleString()} views)</span>
          </button>
          <button class="action-btn" onclick="FaceTubeApp.showToast('Liked video!')">
            <span>👍</span>
            <span>${(video.likesCount || 0).toLocaleString()}</span>
          </button>
          <button class="action-btn" onclick="FaceTubeApp.sharePost('${video.id}')">
            <span>🔗 Share</span>
          </button>
        </div>
      </article>
    `;
  },

  // Specialized Short Reel Feed Card
  renderFeedShortCard(short, currentUser) {
    let formattedCaption = (short.content || short.title || '')
      .replace(/#([a-zA-Z0-9_\u0080-\uFFFF]+)/g, '<span class="post-hashtag" onclick="FaceTubeFeed.setHashtagFilter(\'$1\')">#$1</span>');

    return `
      <article class="post-card" id="short-card-${short.id}" style="border: 1px solid rgba(255, 30, 68, 0.25);">
        <div class="post-header">
          <div class="post-author-info" onclick="FaceTubeApp.openProfile('${short.authorUsername}')" style="cursor: pointer;">
            <img src="${short.authorAvatar}" class="author-avatar" alt="${short.authorName}">
            <div class="author-meta">
              <div class="author-name-row">
                ${short.authorName}
                ${short.verified ? '<span class="verified-badge">✓</span>' : ''}
              </div>
              <span class="author-username">@${short.authorUsername}</span>
            </div>
          </div>
          <div style="display: flex; align-items: center; gap: 6px;">
            <span class="tool-chip" style="font-size: 10px; padding: 2px 6px; background: var(--primary-light); color: var(--primary); border: 1px solid var(--border-highlight);">⚡ Short Reel</span>
            <button class="btn-primary" style="padding: 4px 10px; font-size: 11px;" onclick="FaceTubeApp.navigateTo('shorts')">Watch Fullscreen</button>
          </div>
        </div>

        <div class="post-content-text">${formattedCaption}</div>

        <!-- Vertical Short Reel Video Preview -->
        <div class="feed-short-card-preview" onclick="FaceTubeApp.navigateTo('shorts')">
          <video src="${short.videoUrl}" autoplay loop muted playsinline style="width: 100%; height: 100%; object-fit: cover;"></video>
          <div style="position: absolute; bottom: 8px; left: 8px; right: 8px; background: linear-gradient(0deg, rgba(0,0,0,0.85) 0%, transparent 100%); padding: 8px; border-radius: 6px; color: #fff;">
            <div style="font-size: 11px; font-weight: 700;">🎵 ${short.audioTitle || 'Original Audio'}</div>
            <div style="font-size: 10px; opacity: 0.8;">${(short.viewsCount || 0).toLocaleString()} views • Tap to enter Reels Feed</div>
          </div>
        </div>

        <div class="post-actions-row">
          <button class="action-btn ${short.isLiked ? 'liked' : ''}" onclick="FaceTubeShorts.toggleShortLike('${short.id}')">
            <span>${short.isLiked ? '❤️' : '🤍'}</span>
            <span>${short.likesCount || 0}</span>
          </button>
          <button class="action-btn" onclick="FaceTubeApp.navigateTo('shorts')">
            <span>💬</span>
            <span>${short.commentsCount || 0}</span>
          </button>
          <button class="action-btn" onclick="FaceTubeApp.sharePost('${short.id}')">
            <span>🔗 Share</span>
          </button>
        </div>
      </article>
    `;
  },

  toggleLike(postId) {
    const posts = this.getPosts();
    const post = posts.find(p => p.id === postId);
    if (!post) return;

    post.isLiked = !post.isLiked;
    post.likesCount = post.isLiked ? (post.likesCount + 1) : Math.max(0, post.likesCount - 1);
    this.savePosts(posts);
    FaceTubeApp.refreshFeedView();
  },

  toggleSave(postId) {
    const posts = this.getPosts();
    const post = posts.find(p => p.id === postId);
    if (!post) return;

    post.isSaved = !post.isSaved;
    this.savePosts(posts);
    FaceTubeApp.showToast(post.isSaved ? 'Saved to Bookmarks ★' : 'Removed from Bookmarks');
    FaceTubeApp.refreshFeedView();
  },

  votePoll(postId, optionIdx) {
    const posts = this.getPosts();
    const post = posts.find(p => p.id === postId);
    if (!post || !post.poll) return;

    if (post.poll.userVote !== null && post.poll.userVote !== undefined) {
      FaceTubeApp.showToast('You already voted in this poll!');
      return;
    }

    post.poll.options[optionIdx].votes += 1;
    post.poll.userVote = optionIdx;
    this.savePosts(posts);
    FaceTubeApp.showToast('Vote submitted!');
    FaceTubeApp.refreshFeedView();
  },

  openComments(postId) {
    const posts = this.getPosts();
    const post = posts.find(p => p.id === postId);
    if (!post) return;

    FaceTubeApp.activeCommentPostId = postId;
    document.getElementById('comments-count-title').innerText = (post.comments ? post.comments.length : 0);
    
    const container = document.getElementById('comments-list-container');
    if (!post.comments || post.comments.length === 0) {
      container.innerHTML = `
        <div style="text-align: center; padding: 24px; color: var(--text-muted); font-size: 13px;">
          No comments yet. Be the first to start the conversation!
        </div>
      `;
    } else {
      container.innerHTML = post.comments.map(c => `
        <div style="display: flex; gap: 10px; align-items: flex-start; padding: 8px 0; border-bottom: 1px solid rgba(255,255,255,0.05);">
          <img src="${c.authorAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80'}" style="width: 32px; height: 32px; border-radius: 50%; object-fit: cover;">
          <div style="flex: 1;">
            <div style="display: flex; justify-content: space-between; align-items: baseline;">
              <span style="font-weight: 700; font-size: 13px;">${c.authorName} <span style="font-weight: 400; color: var(--text-muted); font-size: 11px;">@${c.authorUsername}</span></span>
              <span style="font-size: 11px; color: var(--text-muted);">${c.timestamp}</span>
            </div>
            <div style="font-size: 13px; margin: 4px 0;">${c.text}</div>
            <div style="display: flex; gap: 12px; font-size: 11px; color: var(--text-muted);">
              <span style="cursor: pointer;" onclick="FaceTubeFeed.likeComment('${postId}', '${c.id}')">❤️ ${c.likesCount || 0}</span>
              <span style="cursor: pointer;" onclick="FaceTubeFeed.replyComment('${c.authorUsername}')">Reply</span>
            </div>
          </div>
        </div>
      `).join('');
    }

    FaceTubeApp.openModal('comments-modal');
  },

  likeComment(postId, commentId) {
    const posts = this.getPosts();
    const post = posts.find(p => p.id === postId);
    if (!post || !post.comments) return;
    const comment = post.comments.find(c => c.id === commentId);
    if (comment) {
      comment.likesCount = (comment.likesCount || 0) + 1;
      this.savePosts(posts);
      this.openComments(postId);
    }
  },

  replyComment(username) {
    const input = document.getElementById('comment-input-field');
    input.value = `@${username} `;
    input.focus();
  },

  openPostMenu(postId) {
    const choice = confirm('Post Options:\n\nClick OK to Copy Post Link\nClick Cancel to Report Content');
    if (choice) {
      FaceTubeApp.showToast('Post link copied to clipboard!');
    } else {
      FaceTubeApp.showToast('Report submitted to moderation queue.');
    }
  }
};
