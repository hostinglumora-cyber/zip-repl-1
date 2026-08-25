const LISTINGS_KEY = "liberty_marketplace_listings";
const PURCHASES_KEY = "liberty_marketplace_purchases";
const REVIEWS_KEY = "liberty_marketplace_reviews";
const PROFILES_KEY = "liberty_marketplace_creator_profiles";
const FOLLOWERS_KEY = "liberty_marketplace_followers";
const BADGES_KEY = "liberty_marketplace_badges";

export const RESERVED_USERNAMES = [
  "admin",
  "administrator",
  "staff",
  "mod",
  "moderator",
  "libertyx",
  "liberty_x",
  "api",
  "system",
  "support",
  "help",
  "auth",
  "login",
  "register",
  "marketplace",
  "dashboard",
  "status",
  "docs",
  "sell",
  "u",
  "creator",
  "creators",
  "following",
  "settings",
  "tos",
  "privacy",
  "root",
];

const canUseStorage = () =>
  typeof window !== "undefined" && typeof window.localStorage !== "undefined";

function createEntityStore(storageKey: string, idPrefix: string, initialSeed: any[] = []) {
  function read(): any[] {
    if (!canUseStorage()) return initialSeed;
    try {
      const stored = window.localStorage.getItem(storageKey);
      if (!stored) return initialSeed;
      const value = JSON.parse(stored);
      return Array.isArray(value) ? value : initialSeed;
    } catch {
      return initialSeed;
    }
  }

  function write(items: any[]) {
    if (canUseStorage()) {
      window.localStorage.setItem(storageKey, JSON.stringify(items));
    }
  }

  function matchesFilters(item: any, filters: any = {}) {
    return Object.entries(filters).every(([key, value]) => {
      if (value === undefined || value === null || value === "") return true;
      if (Array.isArray(item[key])) {
        return item[key].some((v: string) => String(v).toLowerCase() === String(value).toLowerCase());
      }
      return String(item[key]).toLowerCase() === String(value).toLowerCase();
    });
  }

  function sortItems(items: any[], sort: string = "-created_date") {
    const descending = sort.startsWith("-");
    const key = descending ? sort.slice(1) : sort;
    return [...items].sort((a, b) => {
      const left = a[key] || "";
      const right = b[key] || "";
      return (left > right ? 1 : left < right ? -1 : 0) * (descending ? -1 : 1);
    });
  }

  return {
    async filter(filters: any = {}, sort: string = "-created_date", limit?: number) {
      const filtered = sortItems(
        read().filter((item) => matchesFilters(item, filters)),
        sort
      );
      return typeof limit === "number" ? filtered.slice(0, limit) : filtered;
    },
    async get(id: string) {
      const item = read().find((item) => item.id === id || item.username?.toLowerCase() === id.toLowerCase());
      if (!item) throw new Error("Not found");
      return item;
    },
    async create(input: any) {
      const item = {
        ...input,
        id: input.id || `${idPrefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
        created_date: input.created_date || new Date().toISOString(),
      };
      write([item, ...read()]);
      return item;
    },
    async update(id: string, input: any) {
      const items = read();
      const index = items.findIndex((item) => item.id === id || item.username?.toLowerCase() === id.toLowerCase());
      if (index < 0) {
        // create if not exists
        const newItem = {
          ...input,
          id: id.startsWith(idPrefix) ? id : `${idPrefix}_${id}`,
          updated_date: new Date().toISOString(),
          created_date: input.created_date || new Date().toISOString(),
        };
        write([newItem, ...items]);
        return newItem;
      }
      items[index] = { ...items[index], ...input, updated_date: new Date().toISOString() };
      write(items);
      return items[index];
    },
    async delete(id: string) {
      const items = read().filter((item) => item.id !== id && item.username?.toLowerCase() !== id.toLowerCase());
      write(items);
      return { success: true };
    },
    getAll() {
      return read();
    },
  };
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file || !file.type?.startsWith("image/")) {
      reject(new Error("Please choose an image file (PNG, JPG, WebP)."));
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      reject(new Error("Images must be 5 MB or smaller."));
      return;
    }
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("Could not read this image."));
    reader.readAsDataURL(file);
  });
}

const listingsStore = createEntityStore(LISTINGS_KEY, "listing", []);
const purchasesStore = createEntityStore(PURCHASES_KEY, "purchase", []);
const reviewsStore = createEntityStore(REVIEWS_KEY, "review", []);
const profilesStore = createEntityStore(PROFILES_KEY, "profile", []);
const followersStore = createEntityStore(FOLLOWERS_KEY, "follow", []);
const badgesStore = createEntityStore(BADGES_KEY, "badge", []);

export const localDb = {
  auth: {
    async isAuthenticated() {
      return Boolean(canUseStorage() && window.localStorage.getItem("discord_user"));
    },
    async me() {
      if (!canUseStorage()) return null;
      const saved = window.localStorage.getItem("discord_user");
      if (!saved) return null;
      const profile = JSON.parse(saved);
      return {
        id: profile.id,
        display_name: profile.name || profile.username,
        full_name: profile.name || profile.username,
        email: profile.email || "",
        discord_username: profile.username,
        username: profile.username,
        avatar_url: profile.avatarUrl || null,
        avatarUrl: profile.avatarUrl || null,
      };
    },
    logout() {
      if (canUseStorage()) window.localStorage.removeItem("discord_user");
    },
    redirectToLogin(returnTo?: string) {
      window.location.href = `/login?returnTo=${encodeURIComponent(returnTo || "/")}`;
    },
  },
  entities: {
    Listing: listingsStore,
    Purchase: purchasesStore,
    Review: reviewsStore,
    CreatorProfile: profilesStore,
    Follower: followersStore,
    Badge: badgesStore,
    User: createEntityStore("liberty_marketplace_users", "user", []),
  },
  integrations: {
    Core: {
      UploadFile: async ({ file }: { file: File }) => ({ file_url: await readFileAsDataUrl(file) }),
    },
  },

  // ─── HELPER FUNCTIONS FOR CREATOR PROFILES & STOREFRONTS ───
  async getCreatorProfile(usernameOrId: string) {
    const term = usernameOrId.trim().toLowerCase();
    const all = profilesStore.getAll();
    const found = all.find(
      (p) => p.username?.toLowerCase() === term || p.id?.toLowerCase() === term || p.user_id?.toLowerCase() === term
    );
    if (found) return found;

    // Fallback: if matches currently logged in discord user
    const currentRaw = canUseStorage() ? window.localStorage.getItem("discord_user") : null;
    const currentUser = currentRaw ? JSON.parse(currentRaw) : null;
    if (
      currentUser &&
      (currentUser.username?.toLowerCase() === term ||
        currentUser.id?.toLowerCase() === term ||
        term === "me" ||
        term === currentUser.name?.toLowerCase())
    ) {
      return {
        id: `profile_${currentUser.id}`,
        user_id: currentUser.id,
        username: currentUser.username || "creator",
        display_name: currentUser.name || currentUser.username || "Creator",
        roblox_username: "",
        bio: "ER:LC liveries, uniforms & emergency department packs.",
        avatar_url: currentUser.avatarUrl || null,
        avatar_type: "discord",
        banner_url: "https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=1600&q=80",
        accent_color: "emerald",
        theme_bg: "obsidian",
        badges: ["LibertyX Creator", "Discord Verified"],
        social_links: {
          discord: currentUser.username ? `https://discord.com/users/${currentUser.id}` : "",
          roblox: "",
          youtube: "",
          twitter: "",
          github: "",
          website: "",
        },
        featured_listing_ids: [],
        show_activity: true,
        created_date: currentUser.created_date || new Date().toISOString(),
      };
    }

    return null;
  },

  async saveCreatorProfile(profileData: any) {
    const username = profileData.username?.trim().toLowerCase();
    if (!username) throw new Error("Username is required.");
    if (RESERVED_USERNAMES.includes(username) && profileData.user_id !== "admin") {
      throw new Error("This username is reserved by LibertyX.");
    }
    const all = profilesStore.getAll();
    const existing = all.find(
      (p) => p.username?.toLowerCase() === username && p.user_id !== profileData.user_id
    );
    if (existing) {
      throw new Error("This username is already taken by another creator.");
    }

    const id = profileData.id || `profile_${profileData.user_id || username}`;
    return await profilesStore.update(id, profileData);
  },

  async isFollowing(userId: string, creatorUsernameOrId: string) {
    if (!userId) return false;
    const all = followersStore.getAll();
    return all.some(
      (f) =>
        f.user_id === userId &&
        (f.creator_username?.toLowerCase() === creatorUsernameOrId.toLowerCase() ||
          f.creator_id === creatorUsernameOrId)
    );
  },

  async toggleFollow(userId: string, creatorProfile: any) {
    if (!userId) throw new Error("You must be logged in to follow creators.");
    const all = followersStore.getAll();
    const existingIndex = all.findIndex(
      (f) =>
        f.user_id === userId &&
        (f.creator_username?.toLowerCase() === creatorProfile.username?.toLowerCase() ||
          f.creator_id === creatorProfile.user_id ||
          f.creator_id === creatorProfile.id)
    );

    if (existingIndex >= 0) {
      const next = all.filter((_, i) => i !== existingIndex);
      if (canUseStorage()) window.localStorage.setItem(FOLLOWERS_KEY, JSON.stringify(next));
      return { following: false, count: next.filter((f) => f.creator_username === creatorProfile.username).length };
    } else {
      const newFollow = {
        id: `follow_${Date.now()}`,
        user_id: userId,
        creator_id: creatorProfile.user_id || creatorProfile.id,
        creator_username: creatorProfile.username,
        creator_name: creatorProfile.display_name,
        creator_avatar: creatorProfile.avatar_url,
        created_date: new Date().toISOString(),
      };
      const next = [newFollow, ...all];
      if (canUseStorage()) window.localStorage.setItem(FOLLOWERS_KEY, JSON.stringify(next));
      return { following: true, count: next.filter((f) => f.creator_username === creatorProfile.username).length };
    }
  },

  getFollowersCount(creatorUsernameOrId: string) {
    const all = followersStore.getAll();
    const term = creatorUsernameOrId.toLowerCase();
    return all.filter(
      (f) => f.creator_username?.toLowerCase() === term || f.creator_id?.toLowerCase() === term
    ).length;
  },

  getFollowingList(userId: string) {
    if (!userId) return [];
    const all = followersStore.getAll();
    return all.filter((f) => f.user_id === userId);
  },

  async hasPurchasedListing(userId: string, listingId: string) {
    if (!userId) return false;
    const purchases = purchasesStore.getAll();
    return purchases.some((p) => p.buyer_id === userId && p.listing_id === listingId);
  },
};