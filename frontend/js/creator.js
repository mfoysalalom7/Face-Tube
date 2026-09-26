// FaceTube Creator Studio & Monetization System
const FaceTubeCreator = {
  getMonetizationThreshold() {
    const raw = localStorage.getItem('facetube_monetization_settings');
    if (!raw) {
      const defaults = {
        minFollowers: 1000,
        minViews: 10000,
        revenueSharePercent: 70
      };
      localStorage.setItem('facetube_monetization_settings', JSON.stringify(defaults));
      return defaults;
    }
    return JSON.parse(raw);
  },

  renderCreatorStudio() {
    const currentUser = FaceTubeAuth.getCurrentUser();
    const threshold = this.getMonetizationThreshold();

    const followers = currentUser.followersCount || 1240;
    const views = currentUser.validViewsCount || 14850;
    const followersPct = Math.min(100, Math.round((followers / threshold.minFollowers) * 100));
    const viewsPct = Math.min(100, Math.round((views / threshold.minViews) * 100));
    const isEligible = followers >= threshold.minFollowers && views >= threshold.minViews;

    return `
      <!-- Creator Studio Header -->
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
        <div>
          <h2 style="font-size: 24px; font-weight: 800;">FaceTube Creator Studio</h2>
          <div style="font-size: 13px; color: var(--text-muted);">Creator analytics, audience growth & monetization engine</div>
        </div>
        <button class="btn-primary" onclick="FaceTubeApp.openCreateModal()">+ Create New Content</button>
      </div>

      <!-- Monetization Eligibility Banner -->
      <div class="monetization-card">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">
          <div>
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="font-size: 20px;">💰</span>
              <span style="font-weight: 800; font-size: 17px;">FaceTube Partner Program</span>
              <span class="creator-badge" style="background: rgba(16, 185, 129, 0.2); border-color: rgba(16, 185, 129, 0.4); color: #10B981;">${threshold.revenueSharePercent}% Creator Payout</span>
            </div>
            <div style="font-size: 13px; color: var(--text-secondary); margin-top: 4px;">
              Requirements: <b>${threshold.minFollowers.toLocaleString()} Followers</b> and <b>${threshold.minViews.toLocaleString()} Valid Views</b>
            </div>
          </div>
          ${isEligible ? `
            <button class="btn-primary" style="background: var(--gold-gradient); color: #000; font-weight: 800;" onclick="FaceTubeCreator.applyForMonetization()">
              ★ Apply Now
            </button>
          ` : `
            <button class="btn-secondary" disabled style="opacity: 0.6; font-size: 12px;">
              In Progress
            </button>
          `}
        </div>

        <!-- Progress Bars -->
        <div style="margin-top: 14px;">
          <div style="display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 4px; font-weight: 700;">
            <span>Followers: ${followers.toLocaleString()} / ${threshold.minFollowers.toLocaleString()}</span>
            <span>${followersPct}%</span>
          </div>
          <div style="height: 8px; background: var(--bg-input); border-radius: var(--radius-full); overflow: hidden; margin-bottom: 12px;">
            <div style="width: ${followersPct}%; height: 100%; background: var(--primary-gradient);"></div>
          </div>

          <div style="display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 4px; font-weight: 700;">
            <span>Valid Views: ${views.toLocaleString()} / ${threshold.minViews.toLocaleString()}</span>
            <span>${viewsPct}%</span>
          </div>
          <div style="height: 8px; background: var(--bg-input); border-radius: var(--radius-full); overflow: hidden;">
            <div style="width: ${viewsPct}%; height: 100%; background: linear-gradient(135deg, #3B82F6 0%, #10B981 100%);"></div>
          </div>
        </div>

        ${isEligible ? `
          <div style="margin-top: 14px; padding: 10px; background: rgba(16, 185, 129, 0.15); border-radius: var(--radius-sm); border: 1px solid rgba(16, 185, 129, 0.3); font-size: 13px; color: #10B981; font-weight: 700;">
            🎉 Congratulations! You may be eligible for FaceTube Monetization. Click 'Apply Now' to verify and activate ad revenue sharing.
          </div>
        ` : `
          <div style="margin-top: 12px; font-size: 12px; color: var(--text-muted);">
            Keep posting reels and videos to hit the milestone and join the FaceTube Partner Program.
          </div>
        `}
      </div>

      <!-- Performance Metrics Grid -->
      <div class="metric-grid">
        <div class="metric-box">
          <div class="metric-label">Estimated Revenue</div>
          <div class="metric-value" style="color: #10B981;">$1,428.50</div>
          <div style="font-size: 10px; color: #10B981; margin-top: 2px;">+18.4% this month</div>
        </div>
        <div class="metric-box">
          <div class="metric-label">Total Views</div>
          <div class="metric-value">${views.toLocaleString()}</div>
          <div style="font-size: 10px; color: var(--secondary); margin-top: 2px;">+3.2K this week</div>
        </div>
        <div class="metric-box">
          <div class="metric-label">Total Followers</div>
          <div class="metric-value">${followers.toLocaleString()}</div>
          <div style="font-size: 10px; color: var(--primary); margin-top: 2px;">+140 new followers</div>
        </div>
        <div class="metric-box">
          <div class="metric-label">Watch Time</div>
          <div class="metric-value">620 hrs</div>
          <div style="font-size: 10px; color: var(--gold); margin-top: 2px;">Average 4.2 min</div>
        </div>
      </div>

      <!-- Interactive SVG Growth Chart -->
      <div class="post-card" style="padding: 20px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px;">
          <div>
            <div style="font-weight: 800; font-size: 16px;">Audience & Earnings Growth</div>
            <div style="font-size: 12px; color: var(--text-muted);">Daily views & estimated revenue trends</div>
          </div>
          <div style="display: flex; gap: 6px;">
            <button class="action-btn liked" style="font-size: 11px; padding: 4px 8px;">Weekly</button>
            <button class="action-btn" style="font-size: 11px; padding: 4px 8px;">Monthly</button>
          </div>
        </div>

        <!-- SVG Line Graph -->
        <div style="width: 100%; height: 180px; position: relative;">
          <svg viewBox="0 0 500 160" style="width: 100%; height: 100%; overflow: visible;">
            <defs>
              <linearGradient id="grad-area" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stop-color="#FF1E44" stop-opacity="0.35"/>
                <stop offset="100%" stop-color="#FF1E44" stop-opacity="0.0"/>
              </linearGradient>
            </defs>
            <!-- Grid Lines -->
            <line x1="0" y1="40" x2="500" y2="40" stroke="rgba(255,255,255,0.06)" stroke-dasharray="4"/>
            <line x1="0" y1="80" x2="500" y2="80" stroke="rgba(255,255,255,0.06)" stroke-dasharray="4"/>
            <line x1="0" y1="120" x2="500" y2="120" stroke="rgba(255,255,255,0.06)" stroke-dasharray="4"/>
            <!-- Area Fill -->
            <polygon points="0,140 0,110 80,95 160,115 240,70 320,60 400,30 500,20 500,140" fill="url(#grad-area)" />
            <!-- Line Stroke -->
            <polyline points="0,110 80,95 160,115 240,70 320,60 400,30 500,20" fill="none" stroke="#FF1E44" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
            <!-- Data Points -->
            <circle cx="80" cy="95" r="4" fill="#FF1E44" stroke="#fff" stroke-width="2"/>
            <circle cx="240" cy="70" r="4" fill="#FF1E44" stroke="#fff" stroke-width="2"/>
            <circle cx="400" cy="30" r="4" fill="#FF1E44" stroke="#fff" stroke-width="2"/>
            <circle cx="500" cy="20" r="5" fill="#F59E0B" stroke="#fff" stroke-width="2"/>
          </svg>
          <div style="display: flex; justify-content: space-between; font-size: 11px; color: var(--text-muted); margin-top: 8px;">
            <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
          </div>
        </div>
      </div>

      <!-- Top Performing Content Table -->
      <div class="post-card">
        <div style="font-weight: 800; font-size: 15px; margin-bottom: 12px;">Top Performing Videos & Reels</div>
        <div style="display: flex; flex-direction: column; gap: 10px;">
          <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid var(--border-color);">
            <div>
              <div style="font-weight: 700; font-size: 13px;">4K Drone Cinematic Sequence</div>
              <div style="font-size: 11px; color: var(--text-muted);">Published 5 days ago • 8.4K views</div>
            </div>
            <div style="font-weight: 800; color: #10B981; font-size: 14px;">+$124.80</div>
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid var(--border-color);">
            <div>
              <div style="font-weight: 700; font-size: 13px;">Top 5 Jetpack Compose Shortcuts</div>
              <div style="font-size: 11px; color: var(--text-muted);">Published 2 weeks ago • 5.1K views</div>
            </div>
            <div style="font-weight: 800; color: #10B981; font-size: 14px;">+$86.40</div>
          </div>
        </div>
      </div>
    `;
  },

  applyForMonetization() {
    const confirmed = confirm(
      'Apply for FaceTube Partner Program:\n\n' +
      '• 70% Ad Revenue Share\n' +
      '• Direct Fan SuperThanks & Subscriptions\n' +
      '• Verified Creator Badge eligibility\n\n' +
      'Click OK to submit application for Admin verification.'
    );
    if (confirmed) {
      FaceTubeApp.showToast('Monetization application submitted! Status: Pending Admin Review.');
    }
  }
};
