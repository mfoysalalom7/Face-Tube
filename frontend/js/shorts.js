// FaceTube Shorts & Reels Player
const FaceTubeShorts = {
  currentIndex: 0,

  getShorts() {
    const raw = localStorage.getItem('facetube_shorts');
    if (!raw) {
      const initialShorts = [
        {
          id: 's_founder_vision',
          creatorId: 'user_mdfoysalalom',
          creatorName: 'Md Foysal Alom',
          creatorUsername: 'mdfoysalalom',
          creatorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
          verified: true,
          caption: 'Why we created FaceTube: Giving creators real ownership & high-performance short feeds! 🚀🔥 #Founder #FaceTube #BuildInPublic',
          audioTitle: 'Original Audio - Md Foysal Alom',
          videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
          likesCount: 18900,
          commentsCount: 1420,
          sharesCount: 3100,
          viewsCount: 148000,
          isLiked: false
        },
        {
          id: 's_sarah_waterfall',
          creatorId: 'user_sarah',
          creatorName: 'Sarah Chen',
          creatorUsername: 'sarahcreates',
          creatorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=160&q=80',
          verified: true,
          caption: 'Diving behind a 60m waterfall in Bali! Sound on for nature vibrations 🌊✨ #TravelReels #Adventure',
          audioTitle: 'Nature Acoustics • Cinematic Waves',
          videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
          likesCount: 24500,
          commentsCount: 980,
          sharesCount: 4200,
          viewsCount: 220000,
          isLiked: true
        },
        {
          id: 's_marcus_keyboard',
          creatorId: 'user_marcus',
          creatorName: 'Marcus Brody',
          creatorUsername: 'marcus_tech',
          creatorAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=160&q=80',
          verified: false,
          caption: 'Custom 65% mechanical keyboard typing test with lubed Holy Pandas. That thock sound! 🎧⌨️ #Keyboard #ASMR',
          audioTitle: 'Mechanical Symphony • Marcus Tech',
          videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
          likesCount: 9400,
          commentsCount: 430,
          sharesCount: 890,
          viewsCount: 89000,
          isLiked: false
        }
      ];
      localStorage.setItem('facetube_shorts', JSON.stringify(initialShorts));
      return initialShorts;
    }
    return JSON.parse(raw);
  },

  renderShortsView() {
    const shorts = this.getShorts();
    if (this.currentIndex >= shorts.length) this.currentIndex = 0;
    if (this.currentIndex < 0) this.currentIndex = shorts.length - 1;

    const current = shorts[this.currentIndex];

    return `
      <div style="position: relative; max-width: 440px; margin: 0 auto; height: calc(100vh - var(--header-height) - 20px);">
        <!-- Top Controls Overlay -->
        <div style="position: absolute; top: 14px; left: 16px; right: 16px; z-index: 20; display: flex; justify-content: space-between; align-items: center;">
          <div style="font-weight: 800; font-size: 16px; color: #fff; text-shadow: 0 2px 6px rgba(0,0,0,0.8); display: flex; align-items: center; gap: 6px;">
            <span>⚡ Shorts</span>
            <span style="font-size: 11px; opacity: 0.8;">(${this.currentIndex + 1}/${shorts.length})</span>
          </div>
          <button class="btn-primary" style="padding: 6px 12px; font-size: 12px;" onclick="FaceTubeShorts.uploadShort()">+ Create Short</button>
        </div>

        <!-- Video Player Box -->
        <div class="shorts-container" id="shorts-box" onclick="FaceTubeShorts.togglePlayPause()">
          <video class="short-video-element" id="short-video-el" src="${current.videoUrl}" autoplay loop playsinline></video>

          <!-- Right Action Rail -->
          <div class="shorts-overlay-right" onclick="event.stopPropagation()">
            <!-- Like -->
            <div class="shorts-action-btn ${current.isLiked ? 'active' : ''}" onclick="FaceTubeShorts.toggleShortLike('${current.id}')">
              <div class="circle-icon">${current.isLiked ? '❤️' : '🤍'}</div>
              <span>${current.likesCount}</span>
            </div>

            <!-- Comments -->
            <div class="shorts-action-btn" onclick="FaceTubeShorts.openShortComments('${current.id}')">
              <div class="circle-icon">💬</div>
              <span>${current.commentsCount}</span>
            </div>

            <!-- Share -->
            <div class="shorts-action-btn" onclick="FaceTubeApp.sharePost('${current.id}')">
              <div class="circle-icon">🔗</div>
              <span>Share</span>
            </div>

            <!-- Next Reel Down -->
            <div class="shorts-action-btn" onclick="FaceTubeShorts.nextShort()">
              <div class="circle-icon" title="Next Short">↓</div>
              <span>Next</span>
            </div>
          </div>

          <!-- Bottom Caption Overlay -->
          <div class="shorts-overlay-bottom" onclick="event.stopPropagation()">
            <div class="shorts-creator-row">
              <img src="${current.creatorAvatar}" style="width: 36px; height: 36px; border-radius: 50%; object-fit: cover; border: 2px solid #fff;" onclick="FaceTubeApp.openProfile('${current.creatorUsername}')">
              <span class="shorts-creator-name" onclick="FaceTubeApp.openProfile('${current.creatorUsername}')">${current.creatorName}</span>
              ${current.verified ? '<span class="verified-badge" style="width: 14px; height: 14px; font-size: 8px;">✓</span>' : ''}
              <button class="btn-secondary" style="padding: 4px 10px; font-size: 11px; margin-left: 6px; border-radius: var(--radius-full);" onclick="FaceTubeApp.toggleFollow('${current.creatorUsername}')">Follow</button>
            </div>
            <div class="shorts-caption">${current.caption}</div>
            <div class="shorts-audio-tag">🎵 <span>${current.audioTitle}</span></div>
          </div>
        </div>
      </div>
    `;
  },

  nextShort() {
    const shorts = this.getShorts();
    this.currentIndex = (this.currentIndex + 1) % shorts.length;
    document.getElementById('main-content').innerHTML = this.renderShortsView();
  },

  prevShort() {
    const shorts = this.getShorts();
    this.currentIndex = (this.currentIndex - 1 + shorts.length) % shorts.length;
    document.getElementById('main-content').innerHTML = this.renderShortsView();
  },

  togglePlayPause() {
    const video = document.getElementById('short-video-el');
    if (!video) return;
    if (video.paused) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  },

  toggleShortLike(shortId) {
    const shorts = this.getShorts();
    const short = shorts.find(s => s.id === shortId);
    if (!short) return;

    short.isLiked = !short.isLiked;
    short.likesCount = short.isLiked ? (short.likesCount + 1) : Math.max(0, short.likesCount - 1);
    localStorage.setItem('facetube_shorts', JSON.stringify(shorts));
    document.getElementById('main-content').innerHTML = this.renderShortsView();
  },

  openShortComments(shortId) {
    FaceTubeApp.showToast('Opening comments for this Reel...');
  },

  uploadShort() {
    const caption = prompt('Enter Short Reel Caption & #Hashtags:');
    if (!caption) return;
    const sound = prompt('Sound / Music Title (e.g. Original Sound):') || 'Original Audio';

    const currentUser = FaceTubeAuth.getCurrentUser();
    const newShort = {
      id: 's_' + Date.now(),
      creatorId: currentUser.id,
      creatorName: currentUser.name,
      creatorUsername: currentUser.username,
      creatorAvatar: currentUser.avatar,
      verified: currentUser.verified || false,
      caption: caption,
      audioTitle: sound,
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
      likesCount: 1,
      commentsCount: 0,
      sharesCount: 0,
      viewsCount: 1,
      isLiked: false
    };

    const shorts = this.getShorts();
    shorts.unshift(newShort);
    localStorage.setItem('facetube_shorts', JSON.stringify(shorts));
    this.currentIndex = 0;
    FaceTubeApp.showToast('Short Reel published to FaceTube! ⚡');
    document.getElementById('main-content').innerHTML = this.renderShortsView();
  }
};
