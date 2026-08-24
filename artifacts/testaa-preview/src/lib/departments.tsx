const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

export const DEPARTMENTS = [
  {
    id: "Police",
    name: "River City Police",
    short: "Police",
    logo: "/branding/police.png",
    color: "#3b82f6",
    blurb: "Patrol, investigations, and city enforcement.",
  },
  {
    id: "Fire",
    name: "Fire & Rescue",
    short: "Fire",
    logo: "/branding/fire-rescue.png",
    color: "#ef4444",
    blurb: "Suppression, rescue, and emergency response.",
  },
  {
    id: "Sheriff",
    name: "Liberty County Sheriff",
    short: "Sheriff",
    logo: "/branding/sheriff.png",
    color: "#eab308",
    blurb: "County-wide law enforcement and custody.",
  },
  {
    id: "DOT",
    name: "Dept. of Transportation",
    short: "DOT",
    logo: "/branding/transportation.png",
    color: "#f59e0b",
    blurb: "Roads, transit, and infrastructure operations.",
  },
];

export const ERLC_TAG = { id: "ERLC", name: "ERLC", color: "#26b07a" };

export const CATEGORIES = [
  { id: "Liveries", desc: "Vehicle liveries and skins" },
  { id: "Uniforms", desc: "Character uniforms and outfits" },
  { id: "ELS", desc: "Emergency lighting configurations" },
  { id: "Map Templates", desc: "Map and scene templates" },
  { id: "Bundles", desc: "Multi-asset collections" },
  { id: "Other Assets", desc: "Scripts, tools, and more" },
];

export const LISTING_TYPES = [
  { id: "Single", desc: "One livery, uniform, ELS pack, etc." },
  { id: "Bundle", desc: "Multiple assets sold together" },
  { id: "Free", desc: "A completely free product" },
  { id: "Code", desc: "A redeemable digital code" },
];

export function getDepartment(id) {
  return DEPARTMENTS.find((d) => d.id === id) || null;
}