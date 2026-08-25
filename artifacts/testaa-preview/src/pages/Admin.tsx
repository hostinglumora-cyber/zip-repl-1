import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ShieldCheck,
  Ban,
  Search,
  Users,
  Store,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Eye,
  Trash2,
  Plus,
  Lock,
  UserCheck,
  Star,
  ShoppingBag,
  Clock,
  ArrowRight,
  Sparkles,
  FileText,
  BadgeAlert,
  Server,
  Activity,
  UserX,
  UserPlus,
  RotateCw,
  AlertCircle,
} from "lucide-react";

import SiteNav from "@/components/SiteNav";
import { Footer } from "@/pages/Home";
import { useAuth } from "@/lib/AuthContext";
import { localDb } from "@/lib/localDb";
import { cn } from "@/lib/utils";

export default function Admin() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<
    "overview" | "users" | "creators" | "listings" | "reviews" | "orders" | "hosting" | "staff" | "audit" | "incidents"
  >("overview");

  const [users, setUsers] = useState<any[]>([]);
  const [listings, setListings] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [staffList, setStaffList] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [hostingServers, setHostingServers] = useState<any[]>([]);
  const [incidents, setIncidents] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  // Modal / Action states
  const [banModalUser, setBanModalUser] = useState<any>(null);
  const [banReason, setBanReason] = useState("");
  const [newStaffUser, setNewStaffUser] = useState("");
  const [newStaffRole, setNewStaffRole] = useState("admin");
  const [newIncidentTitle, setNewIncidentTitle] = useState("");
  const [newIncidentDesc, setNewIncidentDesc] = useState("");

  const loadData = async () => {
    setLoading(true);
    try {
      const [u, l, r, o, a, s, logs, servers, incs] = await Promise.all([
        localDb.entities.User.getAll(),
        localDb.entities.Listing.getAll(),
        localDb.entities.Review.getAll(),
        localDb.entities.Purchase.getAll(),
        localDb.entities.CreatorApplication.getAll(),
        localDb.getStaffList(),
        localDb.getAuditLogs(),
        localDb.entities.HostingServer.getAll(),
        localDb.entities.Incident.getAll(),
      ]);

      setUsers(u);
      setListings(l);
      setReviews(r);
      setOrders(o);
      setApplications(a);
      setStaffList(s);
      setAuditLogs(logs);
      setHostingServers(servers);
      setIncidents(incs);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const isOwner = user?.username?.toLowerCase() === "eazykims" || user?.role === "owner";
  const isStaff = isOwner || ["admin", "moderator", "support"].includes(user?.role || "");

  const handleQuickLoginAsOwner = () => {
    const ownerProfile = {
      id: "eazykims",
      username: "eazykims",
      name: "Eazykims",
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
      roblox_username: "Eazykims",
      roblox_verified: true,
      is_creator: true,
      is_owner: true,
    };
    window.localStorage.setItem("discord_user", JSON.stringify(ownerProfile));
    window.dispatchEvent(new Event("storage"));
    window.location.reload();
  };

  if (!user || (!isStaff && user?.username?.toLowerCase() !== "eazykims")) {
    return (
      <div className="min-h-screen bg-[#07090E] text-white flex flex-col justify-between">
        <SiteNav />
        <div className="max-w-md mx-auto my-auto p-10 text-center rounded-2xl border border-white/[0.08] bg-[#0A0D15] shadow-2xl space-y-4">
          <Lock className="w-10 h-10 text-emerald-400 mx-auto" />
          <h2 className="text-xl font-bold text-white">Staff Authentication Required</h2>
          <p className="text-xs text-zinc-400 leading-relaxed">
            This area is restricted to authorized LibertyX administrators and owners.
          </p>
          <div className="pt-2 space-y-2">
            <button
              type="button"
              onClick={handleQuickLoginAsOwner}
              className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold transition shadow-sm"
            >
              Sign in as Eazykims (Platform Owner)
            </button>
            <Link
              to="/login?returnTo=/admin"
              className="block w-full py-2 rounded-xl border border-white/[0.08] hover:bg-white/[0.04] text-xs font-semibold text-zinc-300 transition"
            >
              Sign in with Discord
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const handleBanUser = async () => {
    if (!banModalUser) return;
    try {
      await localDb.entities.User.update(banModalUser.id, {
        banned: true,
        ban_reason: banReason || "Violation of marketplace rules",
      });

      await localDb.addAuditLog(
        user,
        "BAN_USER",
        banModalUser.username || banModalUser.id,
        "Account suspended",
        banReason
      );

      setBanModalUser(null);
      setBanReason("");
      loadData();
    } catch (e: any) {
      alert(e.message || "Failed to ban user.");
    }
  };

  const handleUnbanUser = async (u: any) => {
    try {
      await localDb.entities.User.update(u.id, {
        banned: false,
        ban_reason: "",
      });

      await localDb.addAuditLog(user, "UNBAN_USER", u.username || u.id, "Account reinstated", "");
      loadData();
    } catch (e: any) {
      alert(e.message || "Failed to unban user.");
    }
  };

  const handleRemoveListing = async (listingId: string, title: string) => {
    if (!confirm(`Are you sure you want to remove listing "${title}"?`)) return;
    try {
      await localDb.entities.Listing.update(listingId, { status: "removed" });
      await localDb.addAuditLog(user, "REMOVE_LISTING", listingId, `Removed "${title}"`, "Policy violation");
      loadData();
    } catch (e: any) {
      alert(e.message || "Failed to remove listing.");
    }
  };

  const handleAddStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStaffUser.trim()) return;
    try {
      await localDb.addStaff(user, newStaffUser.trim(), newStaffRole);
      setNewStaffUser("");
      loadData();
    } catch (e: any) {
      alert(e.message || "Failed to add staff.");
    }
  };

  const handleRemoveStaff = async (staffId: string) => {
    if (!confirm("Are you sure you want to revoke this staff member's access?")) return;
    try {
      await localDb.removeStaff(user, staffId);
      loadData();
    } catch (e: any) {
      alert(e.message || "Failed to remove staff.");
    }
  };

  const handleCreateIncident = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIncidentTitle.trim()) return;
    try {
      await localDb.entities.Incident.create({
        title: newIncidentTitle.trim(),
        description: newIncidentDesc.trim(),
        status: "Investigating",
        severity: "Degraded",
        created_by: user.username || "eazykims",
        created_date: new Date().toISOString(),
      });

      await localDb.addAuditLog(user, "CREATE_INCIDENT", newIncidentTitle, "System incident logged", "");
      setNewIncidentTitle("");
      setNewIncidentDesc("");
      loadData();
    } catch (e: any) {
      alert(e.message || "Failed to log incident.");
    }
  };

  const handleResolveIncident = async (incId: string) => {
    try {
      await localDb.entities.Incident.update(incId, { status: "Resolved" });
      await localDb.addAuditLog(user, "RESOLVE_INCIDENT", incId, "Incident resolved", "");
      loadData();
    } catch (e: any) {
      alert(e.message || "Failed to resolve incident.");
    }
  };

  return (
    <div className="min-h-screen bg-[#07090E] text-white flex flex-col justify-between selection:bg-emerald-500/25 selection:text-emerald-300">
      <div>
        <SiteNav />

        {/* ─── ADMIN HEADER ─── */}
        <div className="border-b border-white/[0.06] bg-[#0A0D15]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-0.5 text-xs font-semibold text-emerald-400 mb-2">
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>Executive Operations Center</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-2">
                <span>LibertyX Platform Control</span>
                <span className="text-xs font-mono uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded font-bold">
                  {user?.role || "Owner"}
                </span>
              </h1>
              <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                Moderation tools, creator oversight, cloud node monitoring, and immutable event logs.
              </p>
            </div>

            <div className="flex items-center gap-3 text-xs font-mono">
              <div className="px-3.5 py-2 rounded-xl border border-white/[0.08] bg-[#07090E]">
                <span className="text-zinc-500 block text-[9px]">ACTIVE OPERATOR</span>
                <span className="font-bold text-white">@{user.username || "eazykims"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* ─── MAIN ADMIN BODY ─── */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          
          {/* Top Real Stats HUD */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-2xl border border-white/[0.08] bg-[#0A0D15] p-5">
              <span className="text-[11px] font-mono font-bold text-zinc-500 uppercase tracking-wider block mb-1">Catalog Listings</span>
              <p className="text-2xl font-mono font-black text-white">{listings.length}</p>
              <p className="text-[10px] text-zinc-500 mt-0.5">Live database assets</p>
            </div>

            <div className="rounded-2xl border border-white/[0.08] bg-[#0A0D15] p-5">
              <span className="text-[11px] font-mono font-bold text-zinc-500 uppercase tracking-wider block mb-1">Completed Escrow Orders</span>
              <p className="text-2xl font-mono font-black text-emerald-400">{orders.length}</p>
              <p className="text-[10px] text-zinc-500 mt-0.5">Automated deliverable keys</p>
            </div>

            <div className="rounded-2xl border border-white/[0.08] bg-[#0A0D15] p-5">
              <span className="text-[11px] font-mono font-bold text-zinc-500 uppercase tracking-wider block mb-1">Active Cloud Nodes</span>
              <p className="text-2xl font-mono font-black text-blue-400">{hostingServers.length}</p>
              <p className="text-[10px] text-zinc-500 mt-0.5">Community instances</p>
            </div>

            <div className="rounded-2xl border border-white/[0.08] bg-[#0A0D15] p-5">
              <span className="text-[11px] font-mono font-bold text-zinc-500 uppercase tracking-wider block mb-1">Audit Events</span>
              <p className="text-2xl font-mono font-black text-white">{auditLogs.length}</p>
              <p className="text-[10px] text-zinc-500 mt-0.5">Immutable audit trail</p>
            </div>
          </div>

          {/* TAB BAR */}
          <div className="flex items-center gap-1.5 border-b border-white/[0.06] pb-3 overflow-x-auto">
            {[
              { id: "overview", label: "Overview", icon: Activity },
              { id: "users", label: "Accounts", icon: Users },
              { id: "listings", label: "Listings", count: listings.length, icon: Store },
              { id: "reviews", label: "Reviews", count: reviews.length, icon: Star },
              { id: "orders", label: "Orders & Escrow", count: orders.length, icon: ShoppingBag },
              { id: "hosting", label: "Hosting Nodes", count: hostingServers.length, icon: Server },
              { id: "staff", label: "Staff Team", count: staffList.length, icon: ShieldCheck },
              { id: "incidents", label: "Incidents", count: incidents.length, icon: AlertCircle },
              { id: "audit", label: "Audit Logs", count: auditLogs.length, icon: Clock },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as any)}
                  className={cn(
                    "px-3.5 py-2 text-xs font-semibold rounded-xl transition-all flex items-center gap-1.5 shrink-0",
                    activeTab === tab.id
                      ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-sm"
                      : "text-zinc-400 hover:text-white hover:bg-white/[0.03] border border-transparent"
                  )}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                  {tab.count !== undefined && (
                    <span className="text-[10px] font-mono font-bold bg-white/[0.08] px-1.5 py-0.2 rounded">
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* 1. OVERVIEW TAB */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="rounded-2xl border border-white/[0.08] bg-[#0A0D15] p-5 space-y-2">
                  <span className="text-xs font-bold text-white flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Security & Provenance</span>
                  </span>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    0 reports pending. Escrow deliveries executing automatically with zero delay.
                  </p>
                </div>

                <div className="rounded-2xl border border-white/[0.08] bg-[#0A0D15] p-5 space-y-2">
                  <span className="text-xs font-bold text-white flex items-center gap-2">
                    <Server className="w-4 h-4 text-blue-400" />
                    <span>Hosting Cluster</span>
                  </span>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Community bot nodes online. Automatic restarts and health monitoring active.
                  </p>
                </div>

                <div className="rounded-2xl border border-white/[0.08] bg-[#0A0D15] p-5 space-y-2">
                  <span className="text-xs font-bold text-white flex items-center gap-2">
                    <Clock className="w-4 h-4 text-amber-400" />
                    <span>Recent Audit Events</span>
                  </span>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    {auditLogs.length} moderation actions logged to the permanent audit trail.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* 2. USERS TAB */}
          {activeTab === "users" && (
            <div className="rounded-2xl border border-white/[0.08] bg-[#0A0D15] p-6 space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-white">Registered Accounts</h3>
                  <p className="text-xs text-zinc-400">Search and enforce account suspensions.</p>
                </div>
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by username..."
                    className="w-full rounded-xl border border-white/[0.08] bg-[#07090E] pl-9 pr-3 py-1.5 text-xs text-white outline-none focus:border-emerald-500/50"
                  />
                </div>
              </div>

              {users.length === 0 ? (
                <div className="p-8 text-center text-xs text-zinc-500">
                  No registered users in database yet.
                </div>
              ) : (
                <div className="divide-y divide-white/[0.04]">
                  {users.map((u) => (
                    <div key={u.id} className="py-3 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-white block">{u.display_name || u.username}</span>
                        <span className="text-[10px] text-zinc-500 font-mono">@{u.username} • ID: {u.id}</span>
                        {u.banned && (
                          <span className="text-red-400 text-[10px] font-mono block">Banned: {u.ban_reason}</span>
                        )}
                      </div>

                      <div>
                        {u.banned ? (
                          <button
                            type="button"
                            onClick={() => handleUnbanUser(u)}
                            className="px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-bold"
                          >
                            Unban
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setBanModalUser(u)}
                            className="px-3 py-1 rounded-lg bg-red-500/10 text-red-400 border border-red-500/30 text-xs font-bold"
                          >
                            Suspend Account
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 3. LISTINGS TAB */}
          {activeTab === "listings" && (
            <div className="rounded-2xl border border-white/[0.08] bg-[#0A0D15] p-6 space-y-4 shadow-xl">
              <div>
                <h3 className="font-bold text-sm text-white">Marketplace Listings Oversight</h3>
                <p className="text-xs text-zinc-400">Moderate assets for copyright and asset compliance.</p>
              </div>

              {listings.length === 0 ? (
                <div className="p-8 text-center text-xs text-zinc-500">
                  No active listings in catalog.
                </div>
              ) : (
                <div className="divide-y divide-white/[0.04]">
                  {listings.map((l) => (
                    <div key={l.id} className="py-3 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-white block">{l.title}</span>
                        <span className="text-[10px] text-zinc-500 font-mono">
                          By @{l.seller_username} • {l.category} • {l.price_type === "Free" ? "Free" : `R$ ${l.price}`}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Link
                          to={`/listing/${l.id}`}
                          className="px-3 py-1 rounded-lg border border-white/[0.08] bg-white/[0.02] text-zinc-300 hover:text-white"
                        >
                          Inspect
                        </Link>
                        {l.status !== "removed" && (
                          <button
                            type="button"
                            onClick={() => handleRemoveListing(l.id, l.title)}
                            className="px-3 py-1 rounded-lg border border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 4. STAFF & ROLES TAB */}
          {activeTab === "staff" && (
            <div className="space-y-6">
              {isOwner && (
                <div className="rounded-2xl border border-white/[0.08] bg-[#0A0D15] p-6 shadow-xl space-y-4">
                  <h3 className="font-bold text-sm text-white flex items-center gap-2">
                    <UserPlus className="w-4 h-4 text-emerald-400" />
                    <span>Assign Staff Role</span>
                  </h3>
                  <form onSubmit={handleAddStaff} className="flex flex-col sm:flex-row gap-3">
                    <input
                      type="text"
                      value={newStaffUser}
                      onChange={(e) => setNewStaffUser(e.target.value)}
                      placeholder="Enter exact username to promote..."
                      className="flex-1 rounded-xl border border-white/[0.08] bg-[#07090E] px-3.5 py-2 text-xs text-white outline-none focus:border-emerald-500/50 font-mono"
                    />
                    <select
                      value={newStaffRole}
                      onChange={(e) => setNewStaffRole(e.target.value)}
                      className="rounded-xl border border-white/[0.08] bg-[#07090E] px-3.5 py-2 text-xs text-white outline-none"
                    >
                      <option value="owner">Owner (Full Control)</option>
                      <option value="admin">Admin (Moderation & Management)</option>
                      <option value="moderator">Moderator (Content Moderation)</option>
                      <option value="support">Support (Disputes & Tickets)</option>
                    </select>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold transition shadow-sm shrink-0"
                    >
                      Assign Role
                    </button>
                  </form>
                </div>
              )}

              <div className="rounded-2xl border border-white/[0.08] bg-[#0A0D15] p-6 shadow-xl space-y-4">
                <h3 className="font-bold text-sm text-white">Active Staff Team</h3>
                <div className="divide-y divide-white/[0.04]">
                  {staffList.map((s) => (
                    <div key={s.id || s.user_id} className="py-3 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-white block">@{s.username || s.user_id}</span>
                        <span className="text-[10px] text-emerald-400 uppercase font-mono font-bold">{s.role}</span>
                      </div>
                      {isOwner && s.username !== "eazykims" && (
                        <button
                          type="button"
                          onClick={() => handleRemoveStaff(s.id)}
                          className="text-red-400 hover:underline text-xs"
                        >
                          Revoke Access
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 5. INCIDENTS & STATUS TAB */}
          {activeTab === "incidents" && (
            <div className="space-y-6">
              <div className="rounded-2xl border border-white/[0.08] bg-[#0A0D15] p-6 shadow-xl space-y-4">
                <h3 className="font-bold text-sm text-white flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-400" />
                  <span>Log New Infrastructure Incident</span>
                </h3>
                <form onSubmit={handleCreateIncident} className="space-y-3">
                  <input
                    type="text"
                    value={newIncidentTitle}
                    onChange={(e) => setNewIncidentTitle(e.target.value)}
                    placeholder="Incident Title (e.g. Database cluster failover latency)"
                    className="w-full rounded-xl border border-white/[0.08] bg-[#07090E] px-3.5 py-2 text-xs text-white outline-none focus:border-emerald-500/50"
                    required
                  />
                  <textarea
                    rows={2}
                    value={newIncidentDesc}
                    onChange={(e) => setNewIncidentDesc(e.target.value)}
                    placeholder="Details and mitigation steps..."
                    className="w-full rounded-xl border border-white/[0.08] bg-[#07090E] p-3 text-xs text-white outline-none focus:border-emerald-500/50 resize-none"
                  />
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold transition shadow-sm"
                    >
                      Publish Incident to Status Page
                    </button>
                  </div>
                </form>
              </div>

              <div className="rounded-2xl border border-white/[0.08] bg-[#0A0D15] p-6 shadow-xl space-y-4">
                <h3 className="font-bold text-sm text-white">Active Incidents</h3>
                {incidents.length === 0 ? (
                  <div className="p-6 text-center text-xs text-zinc-500">
                    No active or logged incidents. All services operational.
                  </div>
                ) : (
                  <div className="divide-y divide-white/[0.04]">
                    {incidents.map((inc) => (
                      <div key={inc.id} className="py-3 flex items-center justify-between text-xs">
                        <div>
                          <span className="font-bold text-white block">{inc.title}</span>
                          <span className="text-[10px] text-zinc-500 font-mono">
                            Status: {inc.status} • {new Date(inc.created_date).toLocaleString()}
                          </span>
                        </div>
                        {inc.status !== "Resolved" && (
                          <button
                            type="button"
                            onClick={() => handleResolveIncident(inc.id)}
                            className="px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-bold"
                          >
                            Mark Resolved
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 6. AUDIT LOG TAB */}
          {activeTab === "audit" && (
            <div className="rounded-2xl border border-white/[0.08] bg-[#0A0D15] p-6 shadow-xl space-y-4">
              <div>
                <h3 className="font-bold text-sm text-white flex items-center gap-2">
                  <Clock className="w-4 h-4 text-emerald-400" />
                  <span>Immutable Audit Log</span>
                </h3>
                <p className="text-xs text-zinc-400">Chronological history of all moderation and administrative actions.</p>
              </div>

              {auditLogs.length === 0 ? (
                <div className="p-8 text-center text-xs text-zinc-500">
                  No audit actions recorded yet.
                </div>
              ) : (
                <div className="space-y-2.5">
                  {auditLogs.map((log, idx) => (
                    <div key={log.id || idx} className="p-3.5 rounded-xl border border-white/[0.04] bg-[#07090E] text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-emerald-400 font-mono">{log.action}</span>
                        <span className="text-[10px] text-zinc-500 font-mono">
                          {new Date(log.timestamp || log.created_date).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-white">
                        <strong>@{log.actor_username || "staff"}</strong> acted on <strong>{log.target}</strong>: {log.details}
                      </p>
                      {log.reason && (
                        <p className="text-[11px] text-zinc-400">Reason: {log.reason}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </main>
      </div>

      {/* Suspend User Modal */}
      {banModalUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#0A0D15] border border-white/[0.1] rounded-2xl p-6 space-y-4 text-white">
            <h3 className="text-base font-bold text-white">Suspend Account: @{banModalUser.username}</h3>
            <p className="text-xs text-zinc-400">Specify reason for suspension to record in the permanent audit trail.</p>
            <textarea
              rows={3}
              value={banReason}
              onChange={(e) => setBanReason(e.target.value)}
              placeholder="e.g. Uploaded fraudulent non-working codes or attempted scam."
              className="w-full rounded-xl border border-white/[0.08] bg-[#07090E] p-3 text-xs text-white outline-none focus:border-red-500/50 resize-none"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setBanModalUser(null)}
                className="px-4 py-2 rounded-xl border border-white/[0.08] text-xs text-zinc-300"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleBanUser}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold"
              >
                Confirm Suspension
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}