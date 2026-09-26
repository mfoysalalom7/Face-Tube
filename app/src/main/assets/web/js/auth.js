// FaceTube Authentication & Onboarding Gate Engine
const FaceTubeAuth = {
  // Creator & Founder default account
  CREATOR_ACCOUNT: {
    id: 'user_mdfoysalalom',
    name: 'Md Foysal Alom',
    username: 'mdfoysalalom',
    email: 'creator@facetube.com',
    role: 'creator_founder',
    verified: true,
    isCreator: true,
    title: 'Creator & Founder of FaceTube',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    cover: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    bio: 'Founder & CEO of FaceTube. Empowering creators worldwide with video, reels & fair revenue sharing.',
    followersCount: 128500,
    followingCount: 42,
    postsCount: 154,
    monetizationStatus: 'monetized',
    joinedDate: 'January 2026'
  },

  getCurrentUser() {
    const raw = localStorage.getItem('facetube_current_user');
    if (!raw) {
      // Default to demo user if not logged in
      const defaultUser = {
        id: 'user_alex',
        name: 'Alex Rivera',
        username: 'alex_r',
        email: 'alex@example.com',
        role: 'user',
        verified: false,
        isCreator: true,
        title: 'Video Creator & Tech Enthusiast',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=160&q=80',
        cover: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=1200&q=80',
        bio: 'Creating videos & exploring future tech. Happy to be on FaceTube!',
        followersCount: 1240,
        followingCount: 180,
        postsCount: 28,
        validViewsCount: 14850,
        monetizationStatus: 'eligible', // eligible for monetization!
        joinedDate: 'March 2026',
        followingIds: ['user_mdfoysalalom']
      };
      localStorage.setItem('facetube_current_user', JSON.stringify(defaultUser));
      return defaultUser;
    }
    return JSON.parse(raw);
  },

  setCurrentUser(user) {
    localStorage.setItem('facetube_current_user', JSON.stringify(user));
  },

  getAllUsers() {
    const raw = localStorage.getItem('facetube_users_list');
    if (!raw) {
      const initialUsers = [
        this.CREATOR_ACCOUNT,
        this.getCurrentUser(),
        {
          id: 'user_sarah',
          name: 'Sarah Chen',
          username: 'sarahcreates',
          email: 'sarah@example.com',
          role: 'user',
          verified: true,
          isCreator: true,
          title: 'Cinematographer & Drone Pilot',
          avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=160&q=80',
          cover: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
          bio: 'Visual storyteller sharing aesthetic 4K travel shorts and color grades.',
          followersCount: 38200,
          followingCount: 95,
          postsCount: 64,
          validViewsCount: 420000,
          monetizationStatus: 'monetized',
          joinedDate: 'February 2026'
        },
        {
          id: 'user_marcus',
          name: 'Marcus Brody',
          username: 'marcus_tech',
          email: 'marcus@example.com',
          role: 'user',
          verified: false,
          isCreator: true,
          title: 'Software Dev & AI Builder',
          avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=160&q=80',
          bio: 'Building open-source apps and reviewing developer setups.',
          followersCount: 890,
          followingCount: 140,
          postsCount: 19,
          validViewsCount: 6500,
          monetizationStatus: 'in_progress',
          joinedDate: 'April 2026'
        }
      ];
      localStorage.setItem('facetube_users_list', JSON.stringify(initialUsers));
      return initialUsers;
    }
    return JSON.parse(raw);
  },

  async register(name, username, email, password, dob) {
    const users = this.getAllUsers();
    username = username.replace(/^@/, '').trim().toLowerCase();
    
    if (users.some(u => u.username.toLowerCase() === username)) {
      throw new Error('Username already exists. Please choose another.');
    }
    if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
      throw new Error('Email address already registered.');
    }

    const newUser = {
      id: 'user_' + Date.now(),
      name: name.trim(),
      username: username,
      email: email.trim().toLowerCase(),
      role: 'user',
      verified: false,
      isCreator: false,
      title: 'FaceTube Member',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=160&q=80',
      cover: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=1200&q=80',
      bio: `Hello! I'm on FaceTube.`,
      followersCount: 0,
      followingCount: 0,
      postsCount: 0,
      validViewsCount: 0,
      monetizationStatus: 'none',
      joinedDate: 'September 2026',
      followingIds: [],
      dob: dob
    };

    users.push(newUser);
    localStorage.setItem('facetube_users_list', JSON.stringify(users));
    this.setCurrentUser(newUser);

    // Check if follow requirement is active
    const followReqActive = localStorage.getItem('facetube_req_follow_creator') !== 'false';
    if (followReqActive) {
      localStorage.setItem('facetube_pending_onboarding', 'true');
    }

    return newUser;
  },

  async login(identifier, password) {
    identifier = identifier.trim().toLowerCase().replace(/^@/, '');
    const users = this.getAllUsers();
    
    // Check founder shortcut or matches
    if (identifier === 'mdfoysalalom' || identifier === 'creator@facetube.com') {
      this.setCurrentUser(this.CREATOR_ACCOUNT);
      return this.CREATOR_ACCOUNT;
    }

    const matched = users.find(u => u.username.toLowerCase() === identifier || u.email.toLowerCase() === identifier);
    if (!matched) {
      throw new Error('Invalid username or email address.');
    }

    this.setCurrentUser(matched);
    return matched;
  },

  logout() {
    localStorage.removeItem('facetube_current_user');
    window.location.reload();
  },

  isFollowingCreator(user) {
    if (!user || !user.followingIds) return false;
    return user.followingIds.includes('user_mdfoysalalom') || user.id === 'user_mdfoysalalom';
  }
};
