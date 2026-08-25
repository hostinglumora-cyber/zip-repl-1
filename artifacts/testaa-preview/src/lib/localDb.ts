const LISTINGS_KEY = "liberty_marketplace_listings";
const PURCHASES_KEY = "liberty_marketplace_purchases";
const REVIEWS_KEY = "liberty_marketplace_reviews";

const SEED_LISTINGS = [
  {
    id: "listing_p1",
    title: "2024 State Police Slicktop Ghost Fleet",
    description: "Ultra-detailed 4K ghost livery package with subtle daylight reflections and matching unit callsigns. Includes templates for 2024 Tahoe, Crown Victoria, Explorer Interceptor, and Dodge Charger.",
    listing_type: "Bundle",
    category: "Liveries",
    departments: ["Police"],
    price_type: "Robux",
    price: 150,
    images: [
      "https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80"
    ],
    codes: ["rbxassetid://13892019482", "https://pastebin.com/raw/StateGhost2024"],
    seller_name: "ApexLiveryStudio",
    seller_id: "seller_apex",
    status: "active",
    created_date: "2026-08-24T18:00:00.000Z",
  },
  {
    id: "listing_p2",
    title: "River City Metro Police Patrol Pack",
    description: "Standard city police patrol livery with high-contrast reflective chevrons and authentic door crests. Includes marked supervisor and traffic enforcement variants.",
    listing_type: "Single",
    category: "Liveries",
    departments: ["Police"],
    price_type: "Robux",
    price: 120,
    images: [
      "https://images.unsplash.com/photo-1508974239320-0a029497e820?auto=format&fit=crop&w=1200&q=80"
    ],
    codes: ["rbxassetid://13892049281"],
    seller_name: "MetroDesignWorks",
    seller_id: "seller_metro",
    status: "active",
    created_date: "2026-08-23T14:30:00.000Z",
  },
  {
    id: "listing_s1",
    title: "Liberty County Sheriff High-Visibility Deputy Pack",
    description: "Traditional dual-tone green and gold county sheriff livery pack with high-resolution badge emblems. Compatible with Silverado 1500, Tahoe PPV, and Dodge Charger.",
    listing_type: "Bundle",
    category: "Liveries",
    departments: ["Sheriff"],
    price_type: "Robux",
    price: 140,
    images: [
      "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1200&q=80"
    ],
    codes: ["rbxassetid://13892183921"],
    seller_name: "CountyGraphics",
    seller_id: "seller_county",
    status: "active",
    created_date: "2026-08-22T20:15:00.000Z",
  },
  {
    id: "listing_s2",
    title: "County K-9 Interceptor & Transport Unit",
    description: "Specialized K-9 enforcement vehicle skin with rear heat-warning decals, kennel door indicators, and tactical dark chevron rear quarter wrap.",
    listing_type: "Single",
    category: "Bundles",
    departments: ["Sheriff"],
    price_type: "Robux",
    price: 95,
    images: [
      "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=80"
    ],
    codes: ["rbxassetid://13892294812"],
    seller_name: "K9Tactical",
    seller_id: "seller_k9",
    status: "active",
    created_date: "2026-08-21T11:00:00.000Z",
  },
  {
    id: "listing_f1",
    title: "Engine 4 & Heavy Rescue 1 Battalion Livery",
    description: "High-visibility fire department engine and ladder livery with authentic gold-leaf scrollwork, NFPA compliant rear chevron striping, and battalion numbers.",
    listing_type: "Bundle",
    category: "Liveries",
    departments: ["Fire"],
    price_type: "Robux",
    price: 110,
    images: [
      "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=1200&q=80"
    ],
    codes: ["rbxassetid://13892304912"],
    seller_name: "RescueGraphics",
    seller_id: "seller_rescue",
    status: "active",
    created_date: "2026-08-20T09:45:00.000Z",
  },
  {
    id: "listing_f2",
    title: "Liberty Fire Dept EMS Ambulance & Fly-Car",
    description: "Paramedic response ambulance and rapid fly-car package with clean star-of-life logos, reflective safety striping, and high-visibility neon accents.",
    listing_type: "Single",
    category: "Bundles",
    departments: ["Fire"],
    price_type: "Robux",
    price: 85,
    images: [
      "https://images.unsplash.com/photo-1587745416684-47953f16f02f?auto=format&fit=crop&w=1200&q=80"
    ],
    codes: ["rbxassetid://13892419201"],
    seller_name: "MedicLivery",
    seller_id: "seller_medic",
    status: "active",
    created_date: "2026-08-19T16:20:00.000Z",
  },
  {
    id: "listing_d1",
    title: "Department of Transportation Incident Management",
    description: "Official state DOT incident management response livery for utility trucks, arrow board haulers, and road ranger highway assistance vehicles.",
    listing_type: "Single",
    category: "Liveries",
    departments: ["DOT"],
    price_type: "Free",
    price: 0,
    images: [
      "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=1200&q=80"
    ],
    codes: ["rbxassetid://13892582910"],
    seller_name: "DOTWorks",
    seller_id: "seller_dot",
    status: "active",
    created_date: "2026-08-18T12:00:00.000Z",
  },
  {
    id: "listing_d2",
    title: "Highway Safety & Infrastructure Escort Pack",
    description: "High-intensity amber warning light profiles, vehicle escort wraps, and oversized load convoy markings for state transit operations.",
    listing_type: "Single",
    category: "ELS",
    departments: ["DOT"],
    price_type: "Robux",
    price: 60,
    images: [
      "https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=1200&q=80"
    ],
    codes: ["rbxassetid://13892694012"],
    seller_name: "TransitTech",
    seller_id: "seller_transit",
    status: "active",
    created_date: "2026-08-17T15:30:00.000Z",
  },
  {
    id: "listing_u1",
    title: "Class A/B/C State Trooper Duty Uniform & Vest",
    description: "Complete tactical and formal duty uniform pack including long sleeve with tie, short sleeve patrol, load-bearing molle vest, and badge patch.",
    listing_type: "Single",
    category: "Uniforms",
    departments: ["Police"],
    price_type: "Robux",
    price: 75,
    images: [
      "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=1200&q=80"
    ],
    codes: ["rbxassetid://13892718290"],
    seller_name: "TrooperTailor",
    seller_id: "seller_trooper",
    status: "active",
    created_date: "2026-08-16T18:00:00.000Z",
  },
  {
    id: "listing_e1",
    title: "Spectralux Stage 3 ELS Pattern & Siren Bank",
    description: "Custom lighting stage configurations (Pursuit, Code 2, Traffic Advisor) paired with ultra-realistic electronic siren sound profiles.",
    listing_type: "Single",
    category: "ELS",
    departments: ["Police", "Sheriff"],
    price_type: "Robux",
    price: 50,
    images: [
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=80"
    ],
    codes: ["https://pastebin.com/raw/ELS_Spectralux_v3"],
    seller_name: "SoundMasterERLC",
    seller_id: "seller_sound",
    status: "active",
    created_date: "2026-08-15T14:10:00.000Z",
  }
];

const canUseStorage = () =>
  typeof window !== "undefined" && typeof window.localStorage !== "undefined";

function createEntityStore(storageKey: string, idPrefix: string, initialSeed: any[] = []) {
  function read() {
    if (!canUseStorage()) return initialSeed;
    try {
      const stored = window.localStorage.getItem(storageKey);
      if (!stored) {
        if (initialSeed.length > 0) {
          window.localStorage.setItem(storageKey, JSON.stringify(initialSeed));
          return initialSeed;
        }
        return [];
      }
      const value = JSON.parse(stored);
      if (Array.isArray(value)) {
        if (value.length === 0 && initialSeed.length > 0) {
          window.localStorage.setItem(storageKey, JSON.stringify(initialSeed));
          return initialSeed;
        }
        return value;
      }
      return initialSeed;
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
      const item = read().find((item) => item.id === id);
      if (!item) throw new Error("Not found");
      return item;
    },
    async create(input: any) {
      const item = {
        ...input,
        id: `${idPrefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
        created_date: new Date().toISOString(),
      };
      write([item, ...read()]);
      return item;
    },
    async update(id: string, input: any) {
      const items = read();
      const index = items.findIndex((item) => item.id === id);
      if (index < 0) throw new Error("Not found");
      items[index] = { ...items[index], ...input, updated_date: new Date().toISOString() };
      write(items);
      return items[index];
    },
    async delete(id: string) {
      const items = read().filter((item) => item.id !== id);
      write(items);
      return { success: true };
    },
  };
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file || !file.type?.startsWith("image/")) {
      reject(new Error("Please choose an image file."));
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
    redirectToLogin(returnTo?: string) {
      window.location.href = `/login?returnTo=${encodeURIComponent(returnTo || "/")}`;
    },
  },
  entities: {
    Listing: createEntityStore(LISTINGS_KEY, "listing", SEED_LISTINGS),
    Purchase: createEntityStore(PURCHASES_KEY, "purchase", [
      {
        id: "purchase_1",
        listing_title: "2024 State Police Slicktop Ghost Fleet",
        buyer_name: "OfficerJake_ERLC",
        price: 150,
        status: "delivered",
        created_date: "2026-08-24T20:00:00.000Z",
      },
      {
        id: "purchase_2",
        listing_title: "River City Metro Police Patrol Pack",
        buyer_name: "DeputyMiller",
        price: 120,
        status: "delivered",
        created_date: "2026-08-24T15:30:00.000Z",
      }
    ]),
    Review: createEntityStore(REVIEWS_KEY, "review", [
      {
        id: "rev_1",
        listing_id: "listing_p1",
        reviewer_name: "Chief_Anderson",
        rating: 5,
        comment: "Flawless textures on the Tahoe and Charger. ELS mapping works straight out of the box in our server.",
        created_date: "2026-08-24T19:00:00.000Z",
      },
      {
        id: "rev_2",
        listing_id: "listing_s1",
        reviewer_name: "SheriffColt",
        rating: 5,
        comment: "Best county livery pack available. Real quality and instant key delivery.",
        created_date: "2026-08-23T10:00:00.000Z",
      }
    ]),
    User: createEntityStore("liberty_marketplace_users", "user"),
  },
  integrations: {
    Core: {
      UploadFile: async ({ file }: { file: File }) => ({ file_url: await readFileAsDataUrl(file) }),
    },
  },
};