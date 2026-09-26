// FaceTube Admin Panel, Moderation Queue & Platform Governance
const FaceTubeAdmin = {
  renderAdminPanel() {
    const users = FaceTubeAuth.getAllUsers();
    const posts = FaceTubeFeed.getPosts();
    const videos = FaceTubeVideos.getVideos();
    const threshold = FaceTubeCreator.getMonetizationThreshold();
    const followReqActive = localStorage.getItem('facetube_req_follow_creator') !== 'false';

    const totalViews = videos.reduce((acc, v) => acc + (v.viewsCount || 0), 0) + 185000;

    return `
      <!-- Admin Panel Header -->
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
        <div>
          <div style="display: flex; align-items: center; gap: 8px;">
            <h2 style="font-size: 24px; font-weight: 800;">FaceTube Admin Panel</h2>
            <span class="creator-badge" style="background: rgba(239, 68, 68, 0.2); border-color: rgba(239, 68, 68, 0.4); color: #EF4444;">SuperAdmin</span>
          </div>
          <div style="font-size: 13px; color: var(--text-muted);">Platform statistics, user governance & moderation queue</div>
        </div>
      </div>

      <!-- Platform Overview Metrics -->
      <div class="metric-grid">
        <div class="metric-box">
          <div class="metric-label">Total Users</div>
          <div class="metric-value">${(users.length + 128500).toLocaleString()}</div>
          <div style="font-size: 10px; color: #10B981; margin-top: 2px;">+1,420 today</div>
        </div>
        <div class="metric-box">
          <div class="metric-label">Total Posts</div>
          <div class="metric-value">${(posts.length + 48200).toLocaleString()}</div>
          <div style="font-size: 10px; color: var(--secondary); margin-top: 2px;">+310 today</div>
        </div>
        <div class="metric-box">
          <div class="metric-label">Total Views</div>
          <div class="metric-value">${totalViews.toLocaleString()}</div>
          <div style="font-size: 10px; color: var(--gold); margin-top: 2px;">98.4% uptime</div>
        </div>
        <div class="metric-box">
          <div class="metric-label">Monetized Creators</div>
          <div class="metric-value">1,842</div>
          <div style="font-size: 10px; color: #10B981; margin-top: 2px;">70/30 Split</div>
        </div>
      </div>

      <!-- Governance & Onboarding Settings Card -->
      <div class="post-card" style="border: 2px solid var(--border-highlight); margin-bottom: 20px;">
        <div style="font-weight: 800; font-size: 16px; margin-bottom: 6px;">⚙️ Platform Governance & Rules</div>
        <div style="font-size: 13px; color: var(--text-secondary); margin-bottom: 14px;">
          Configure global platform onboarding constraints, thresholds, and partner policies.
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px; background: var(--bg-input); border-radius: var(--radius-md); margin-bottom: 12px;">
          <div>
            <div style="font-weight: 700; font-size: 14px;">Mandatory Creator Follow Requirement</div>
            <div style="font-size: 12px; color: var(--text-muted);">
              When enabled, all new registrations must follow official founder (@mdfoysalalom) to activate their account.
            </div>
          </div>
          <div>
            <button class="btn-primary" style="background: ${followReqActive ? 'var(--primary-gradient)' : 'var(--bg-card-hover)'}; color: ${followReqActive ? '#fff' : 'var(--text-muted)'};" onclick="FaceTubeAdmin.toggleFollowRequirement()">
              ${followReqActive ? '✓ ENABLED' : 'DISABLED'}
            </button>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 10px;">
          <div style="background: var(--bg-input); padding: 10px; border-radius: var(--radius-sm);">
            <div style="font-size: 11px; font-weight: 700; color: var(--text-muted);">Monetization Min Followers</div>
            <div style="font-weight: 800; font-size: 16px; margin-top: 4px;">${threshold.minFollowers}</div>
          </div>
          <div style="background: var(--bg-input); padding: 10px; border-radius: var(--radius-sm);">
            <div style="font-size: 11px; font-weight: 700; color: var(--text-muted);">Monetization Min Views</div>
            <div style="font-weight: 800; font-size: 16px; margin-top: 4px;">${threshold.minViews}</div>
          </div>
        </div>
      </div>

      <!-- User Management Table -->
      <div class="post-card" style="margin-bottom: 20px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
          <div style="font-weight: 800; font-size: 16px;">👥 User Management</div>
          <input type="text" placeholder="Search user by name or @..." style="background: var(--bg-input); border: 1px solid var(--border-color); border-radius: var(--radius-full); padding: 4px 12px; font-size: 12px; color: #fff;">
        </div>

        <div style="overflow-x: auto;">
          <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
            <thead>
              <tr style="border-bottom: 1px solid var(--border-color); text-align: left; color: var(--text-muted); font-size: 11px; text-transform: uppercase;">
                <th style="padding: 8px 6px;">User</th>
                <th style="padding: 8px 6px;">Role</th>
                <th style="padding: 8px 6px;">Followers</th>
                <th style="padding: 8px 6px;">Status</th>
                <th style="padding: 8px 6px; text-align: right;">Action</th>
              </tr>
            </thead>
            <tbody>
              ${users.map(u => `
                <tr style="border-bottom: 1px solid rgba(255,255,255,0.03);">
                  <td style="padding: 10px 6px; display: flex; align-items: center; gap: 8px;">
                    <img src="${u.avatar}" style="width: 28px; height: 28px; border-radius: 50%; object-fit: cover;">
                    <div>
                      <div style="font-weight: 700;">${u.name} ${u.verified ? '<span class="verified-badge" style="width: 12px; height: 12px; font-size: 7px;">✓</span>' : ''}</div>
                      <div style="font-size: 11px; color: var(--text-muted);">@${u.username}</div>
                    </div>
                  </td>
                  <td style="padding: 10px 6px;">
                    <span style="font-size: 11px; font-weight: 600; color: ${u.role === 'creator_founder' ? 'var(--gold)' : 'var(--text-secondary)'};">
                      ${u.role === 'creator_founder' ? 'Founder & Creator' : 'Member'}
                    </span>
                  </td>
                  <td style="padding: 10px 6px;">${(u.followersCount || 0).toLocaleString()}</td>
                  <td style="padding: 10px 6px;">
                    <span style="font-size: 10px; font-weight: 700; color: #10B981; background: rgba(16,185,129,0.15); padding: 2px 6px; border-radius: 4px;">ACTIVE</span>
                  </td>
                  <td style="padding: 10px 6px; text-align: right;">
                    <button class="tool-chip" style="font-size: 11px; padding: 3px 8px; display: inline-flex;" onclick="FaceTubeAdmin.manageUser('${u.username}')">Manage</button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Moderation Reports Queue -->
      <div class="post-card">
        <div style="font-weight: 800; font-size: 16px; margin-bottom: 12px;">🛡️ Content Moderation Queue</div>
        <div style="display: flex; flex-direction: column; gap: 8px;">
          <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px; background: var(--bg-input); border-radius: var(--radius-sm);">
            <div>
              <div style="font-weight: 700; font-size: 13px;">Report #492: Potential Spam / Bot Post</div>
              <div style="font-size: 11px; color: var(--text-muted);">Reported by 2 users • Status: Pending Review</div>
            </div>
            <div style="display: flex; gap: 6px;">
              <button class="btn-primary" style="padding: 4px 10px; font-size: 11px;" onclick="FaceTubeApp.showToast('Post dismissed as safe')">Approve</button>
              <button class="btn-secondary" style="padding: 4px 10px; font-size: 11px;" onclick="FaceTubeApp.showToast('Post removed for policy violation')">Remove</button>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  toggleFollowRequirement() {
    const current = localStorage.getItem('facetube_req_follow_creator') !== 'false';
    const next = !current;
    localStorage.setItem('facetube_req_follow_creator', next ? 'true' : 'false');
    FaceTubeApp.showToast(`Mandatory creator follow requirement is now ${next ? 'ENABLED' : 'DISABLED'}`);
    document.getElementById('main-content').innerHTML = this.renderAdminPanel();
  },

  manageUser(username) {
    const action = prompt(`Admin Action for @${username}:\n1: Toggle Verification Badge\n2: Suspend Account\n3: Reset Password\n\nEnter 1, 2, or 3:`);
    if (action === '1') {
      FaceTubeApp.showToast(`Verification status updated for @${username}`);
    } else if (action === '2') {
      FaceTubeApp.showToast(`Account @${username} status updated.`);
    } else if (action === '3') {
      FaceTubeApp.showToast(`Password reset link generated for @${username}`);
    }
  }
};
