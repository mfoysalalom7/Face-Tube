// FaceTube Video Hub & Interactive Video Player
const FaceTubeVideos = {
  currentCategory: 'All',

  getVideos() {
    const raw = localStorage.getItem('facetube_videos');
    if (!raw) {
      const initialVideos = [
        {
          id: 'v_founder_keynote',
          title: 'FaceTube Keynote 2026: The Future of Creator Economy & Community',
          creatorId: 'user_mdfoysalalom',
          creatorName: 'Md Foysal Alom',
          creatorUsername: 'mdfoysalalom',
          creatorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
          verified: true,
          duration: '14:28',
          viewsCount: 245000,
          likesCount: 18400,
          category: 'Tech',
          thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80',
          videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
          description: 'Official introduction to the FaceTube ecosystem by founder Md Foysal Alom. Breaking down decentralized creator earnings, 4K reel processing, and direct community messaging.',
          uploadDate: '2 days ago'
        },
        {
          id: 'v_sarah_iceland',
          title: '4K Drone Odyssey: Exploring Iceland’s Hidden Glaciers & Volcanic Rivers',
          creatorId: 'user_sarah',
          creatorName: 'Sarah Chen',
          creatorUsername: 'sarahcreates',
          creatorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=160&q=80',
          verified: true,
          duration: '08:45',
          viewsCount: 98200,
          likesCount: 7100,
          category: 'Travel',
          thumbnail: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
          videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
          description: 'Join me on a 7-day cinematic journey across south Iceland. Shot entirely on DJI Inspire 3 in ProRes RAW.',
          uploadDate: '5 days ago'
        },
        {
          id: 'v_marcus_ai_agent',
          title: 'Building Autonomous AI Agents with Jetpack Compose & Real-Time Sync',
          creatorId: 'user_marcus',
          creatorName: 'Marcus Brody',
          creatorUsername: 'marcus_tech',
          creatorAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=160&q=80',
          verified: false,
          duration: '21:10',
          viewsCount: 42100,
          likesCount: 3200,
          category: 'Tech',
          thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80',
          videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
          description: 'A deep dive into reactive state machines, WebSockets, and modern Android architecture.',
          uploadDate: '1 week ago'
        },
        {
          id: 'v_music_lofi',
          title: 'FaceTube Beats: 24/7 Lofi Chillhop to Relax / Study / Code to',
          creatorId: 'user_facetube_music',
          creatorName: 'FaceTube Music Hub',
          creatorUsername: 'facetubemusic',
          creatorAvatar: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=160&q=80',
          verified: true,
          duration: '45:00',
          viewsCount: 310000,
          likesCount: 22000,
          category: 'Music',
          thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
          videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
          description: 'Original chillhop tracks curated exclusively for the FaceTube creator community.',
          uploadDate: '3 weeks ago'
        }
      ];
      localStorage.setItem('facetube_videos', JSON.stringify(initialVideos));
      return initialVideos;
    }
    return JSON.parse(raw);
  },

  renderVideoHub() {
    const videos = this.getVideos();
    const categories = ['All', 'Tech', 'Travel', 'Music', 'Gaming', 'Podcasts', 'Education'];
    
    let filtered = videos;
    if (this.currentCategory !== 'All') {
      filtered = videos.filter(v => v.category === this.currentCategory);
    }

    return `
      <!-- Video Hub Header -->
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
        <div>
          <h2 style="font-size: 22px; font-weight: 800;">FaceTube Video Hub</h2>
          <div style="font-size: 13px; color: var(--text-muted);">High-fidelity videos from creators across the globe</div>
        </div>
        <button class="btn-primary" onclick="FaceTubeVideos.openUploadVideoModal()">+ Upload Video</button>
      </div>

      <!-- Categories Pills -->
      <div style="display: flex; gap: 8px; overflow-x: auto; padding-bottom: 12px; margin-bottom: 18px;">
        ${categories.map(cat => `
          <button class="action-btn ${this.currentCategory === cat ? 'liked' : ''}" 
                  style="background: ${this.currentCategory === cat ? 'var(--primary-light)' : 'var(--bg-card)'}; border-radius: var(--radius-full); font-size: 13px; white-space: nowrap;"
                  onclick="FaceTubeVideos.filterCategory('${cat}')">
            ${cat}
          </button>
        `).join('')}
      </div>

      <!-- Video Grid -->
      <div class="video-grid">
        ${filtered.map(v => `
          <div class="video-card" onclick="FaceTubeVideos.playVideo('${v.id}')">
            <div class="video-thumbnail-wrapper">
              <img class="video-thumbnail" src="${v.thumbnail}" loading="lazy" alt="${v.title}">
              <span class="video-duration-badge">${v.duration}</span>
            </div>
            <div class="video-info">
              <img src="${v.creatorAvatar}" style="width: 38px; height: 38px; border-radius: 50%; object-fit: cover; flex-shrink: 0;" alt="${v.creatorName}">
              <div class="video-details">
                <div class="video-title">${v.title}</div>
                <div style="font-size: 12px; color: var(--text-secondary); display: flex; align-items: center; gap: 4px;">
                  ${v.creatorName} ${v.verified ? '<span class="verified-badge" style="width: 14px; height: 14px; font-size: 8px;">✓</span>' : ''}
                </div>
                <div class="video-stats">${(v.viewsCount).toLocaleString()} views • ${v.uploadDate}</div>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  },

  filterCategory(cat) {
    this.currentCategory = cat;
    document.getElementById('main-content').innerHTML = this.renderVideoHub();
  },

  playVideo(videoId) {
    const videos = this.getVideos();
    const video = videos.find(v => v.id === videoId);
    if (!video) return;

    // Increment views
    video.viewsCount = (video.viewsCount || 0) + 1;
    localStorage.setItem('facetube_videos', JSON.stringify(videos));

    document.getElementById('theater-video-title').innerText = video.title;
    const player = document.getElementById('theater-video-player');
    player.src = video.videoUrl;
    player.play().catch(() => {});

    document.getElementById('theater-video-channel').innerHTML = `
      <img src="${video.creatorAvatar}" style="width: 32px; height: 32px; border-radius: 50%; object-fit: cover;">
      <span>${video.creatorName}</span>
      ${video.verified ? '<span class="verified-badge">✓</span>' : ''}
      <span style="font-size: 12px; color: var(--text-muted); margin-left: 6px;">${video.viewsCount.toLocaleString()} views</span>
    `;

    document.getElementById('theater-video-desc').innerText = video.description;
    FaceTubeApp.activePlayingVideo = video;
    FaceTubeApp.openModal('video-theater-modal');
  },

  openUploadVideoModal() {
    const title = prompt('Enter Video Title:');
    if (!title) return;
    const desc = prompt('Enter Description:') || 'Uploaded on FaceTube';
    const cat = prompt('Category (Tech, Travel, Music, Gaming, etc.):') || 'Tech';

    const currentUser = FaceTubeAuth.getCurrentUser();
    const newVid = {
      id: 'v_' + Date.now(),
      title: title,
      creatorId: currentUser.id,
      creatorName: currentUser.name,
      creatorUsername: currentUser.username,
      creatorAvatar: currentUser.avatar,
      verified: currentUser.verified || false,
      duration: '04:12',
      viewsCount: 1,
      likesCount: 1,
      category: cat,
      thumbnail: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=800&q=80',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      description: desc,
      uploadDate: 'Just now'
    };

    const videos = this.getVideos();
    videos.unshift(newVid);
    localStorage.setItem('facetube_videos', JSON.stringify(videos));
    FaceTubeApp.showToast('Video published to FaceTube Video Hub! 🚀');
    document.getElementById('main-content').innerHTML = this.renderVideoHub();
  }
};
