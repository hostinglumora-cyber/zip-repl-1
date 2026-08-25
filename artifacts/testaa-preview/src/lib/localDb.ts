const LISTINGS_KEY = "liberty_marketplace_listings";

const canUseStorage = () =>
  typeof window !== "undefined" && typeof window.localStorage !== "undefined";

function readListings() {
  if (!canUseStorage()) return [];
  try {
    const value = JSON.parse(window.localStorage.getItem(LISTINGS_KEY) || "[]");
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

function writeListings(listings) {
  if (canUseStorage()) {
    window.localStorage.setItem(LISTINGS_KEY, JSON.stringify(listings));
  }
}

function matchesFilters(listing, filters = {}) {
  return Object.entries(filters).every(([key, value]) => {
    if (value === undefined || value === null || value === "") return true;
    if (Array.isArray(listing[key])) return listing[key].includes(value);
    return listing[key] === value;
  });
}

function sortListings(listings, sort = "-created_date") {
  const descending = sort.startsWith("-");
  const key = descending ? sort.slice(1) : sort;
  return [...listings].sort((a, b) => {
    const left = a[key] || "";
    const right = b[key] || "";
    return (left > right ? 1 : left < right ? -1 : 0) * (descending ? -1 : 1);
  });
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    if (!file || !file.type?.startsWith("image/")) {
      reject(new Error("Please choose an image file."));
      return;
    }
    if (file.size > 4 * 1024 * 1024) {
      reject(new Error("Images must be 4 MB or smaller."));
      return;
    }
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("Could not read this image."));
    reader.readAsDataURL(file);
  });
}

const listingEntity = {
  async filter(filters, sort, limit) {
    const filtered = sortListings(
      readListings().filter((listing) => matchesFilters(listing, filters)),
      sort,
    );
    return typeof limit === "number" ? filtered.slice(0, limit) : filtered;
  },
  async get(id) {
    const listing = readListings().find((item) => item.id === id);
    if (!listing) throw new Error("Listing not found");
    return listing;
  },
  async create(input) {
    const listing = {
      ...input,
      id: `listing_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      created_date: new Date().toISOString(),
    };
    writeListings([listing, ...readListings()]);
    return listing;
  },
  async update(id, input) {
    const listings = readListings();
    const index = listings.findIndex((listing) => listing.id === id);
    if (index < 0) throw new Error("Listing not found");
    listings[index] = { ...listings[index], ...input, updated_date: new Date().toISOString() };
    writeListings(listings);
    return listings[index];
  },
};

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
        avatar_url: profile.avatarUrl || null,
      };
    },
    logout() {
      if (canUseStorage()) window.localStorage.removeItem("discord_user");
    },
    redirectToLogin(returnTo) {
      window.location.href = `/login?returnTo=${encodeURIComponent(returnTo || "/")}`;
    },
  },
  entities: { Listing: listingEntity },
  integrations: {
    Core: {
      UploadFile: async ({ file }) => ({ file_url: await readFileAsDataUrl(file) }),
    },
  },
};