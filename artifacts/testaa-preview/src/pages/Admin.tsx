const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import React, { useEffect, useState } from "react";

import { useAuth } from "@/lib/AuthContext";
import { ShieldCheck, Ban, Search, Users, Store, AlertTriangle } from "lucide-react";

export default function Admin() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [listings, setListings] = useState([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [banReason, setBanReason] = useState({});

  const load = async () => {
    setLoading(true);
    try {
      const [u, l] = await Promise.all([
        db.entities.User.filter({}).catch(() => []),
        db.entities.Listing.filter({}).catch(() => []),
      ]);
      setUsers(u);
      setListings(l);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  if (user && user.role !== "admin") {
    return (
      <div className="min-h-screen bg-background text-foreground grid place-items-center px-5">
        <div className="text-center max-w-sm">
          <AlertTriangle className="w-12 h-12 text-amber-400 mx-auto mb-4" />
          <h1 className="text-xl font-bold mb-2">Admins only</h1>
          <p className="text-muted-foreground text-sm">You don't have access to this panel.</p>
        </div>
      </div>
    );
  }

  const filteredUsers = users.filter((u) => (u.email || "").toLowerCase().includes(q.toLowerCase()) || (u.display_name || "").toLowerCase().includes(q.toLowerCase()));

  const toggleBan = async (u) => {
    const reason = banReason[u.id] || "";
    await db.entities.User.update(u.id, { banned: !u.banned, ban_reason: !u.banned ? reason : "" });
    load();
  };

  const removeListing = async (id) => {
    await db.entities.Listing.update(id, { status: "removed" });
    load();
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary/15 grid place-items-center"><ShieldCheck className="w-5 h-5 text-primary" /></div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Admin Panel</h1>
          <p className="text-muted-foreground text-sm">Manage users, listings, and enforce marketplace rules.</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <MiniStat icon={Users} label="Members" value={users.length} />
        <MiniStat icon={Store} label="Listings" value={listings.length} />
        <MiniStat icon={Ban} label="Banned" value={users.filter((u) => u.banned).length} />
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="px-5 py-4 border-b border-border flex items-center justify-between gap-3">
          <h2 className="font-semibold text-foreground">Members</h2>
          <div className="relative w-56">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Searchâ¦" className="w-full bg-secondary border border-border rounded-lg pl-9 pr-3 py-1.5 text-sm focus:outline-none focus:border-primary/50" />
          </div>
        </div>
        {loading ? (
          <div className="p-8 text-center text-muted-foreground">Loadingâ¦</div>
        ) : (
          <div className="divide-y divide-border">
            {filteredUsers.map((u) => (
              <div key={u.id} className="px-5 py-3 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-primary/15 grid place-items-center text-primary font-semibold text-sm shrink-0">{(u.display_name || u.email || "U").charAt(0).toUpperCase()}</div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground truncate flex items-center gap-1.5">{u.display_name || u.email} {u.role === "admin" && <span className="text-[10px] bg-primary/15 text-primary px-1.5 py-0.5 rounded">ADMIN</span>}</p>
                  <p className="text-xs text-muted-foreground truncate">{u.email}</p>
                  {u.banned && <p className="text-xs text-red-400 truncate">Banned: {u.ban_reason || "no reason"}</p>}
                </div>
                {u.role !== "admin" && (
                  <div className="flex items-center gap-2">
                    <input value={banReason[u.id] || ""} onChange={(e) => setBanReason({ ...banReason, [u.id]: e.target.value })} placeholder="Reason" className="w-32 bg-secondary border border-border rounded px-2 py-1 text-xs focus:outline-none focus:border-primary/50" />
                    <button onClick={() => toggleBan(u)} className={`text-xs font-medium px-3 py-1.5 rounded-lg ${u.banned ? "bg-primary text-primary-foreground" : "bg-red-500/15 text-red-400 border border-red-500/30"}`}>
                      {u.banned ? "Unban" : "Ban"}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="px-5 py-4 border-b border-border"><h2 className="font-semibold text-foreground">Listings</h2></div>
        <div className="divide-y divide-border">
          {listings.map((l) => (
            <div key={l.id} className="px-5 py-3 flex items-center gap-3">
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground truncate">{l.title}</p>
                <p className="text-xs text-muted-foreground">by {l.seller_name} Â· {l.category}</p>
              </div>
              <span className={`text-xs px-2 py-1 rounded ${l.status === "active" ? "bg-primary/15 text-primary" : "bg-secondary text-muted-foreground"}`}>{l.status}</span>
              {l.status !== "removed" && <button onClick={() => removeListing(l.id)} className="text-xs text-red-400 hover:text-red-300 px-2 py-1">Remove</button>}
            </div>
          ))}
          {listings.length === 0 && <div className="p-8 text-center text-muted-foreground">No listings.</div>}
        </div>
      </div>
    </div>
  );
}

function MiniStat({ icon: Icon, label, value }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <Icon className="w-5 h-5 text-primary mb-3" />
      <div className="text-2xl font-bold text-foreground">{value}</div>
      <div className="text-xs text-muted-foreground">{label}</div>
    </div>
  );
}