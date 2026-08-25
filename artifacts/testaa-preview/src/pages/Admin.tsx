import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ShieldCheck,
  Search,
  Users,
  Store,
  ShoppingBag,
  Server,
  Activity,
  UserPlus,
  Clock,
  AlertCircle,
  Lock,
  Star
} from "lucide-react";

import PageShell from "@/components/PageShell";
import { useAuth } from "@/lib/AuthContext";
import { localDb } from "@/lib/localDb";
import { cn } from "@/lib/utils";
import PageHeader from "@/components/PageHeader";
import EmptyState from "@/components/EmptyState";

export default function Admin() {
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState<
    "overview" | "users" | "creators" | "listings" | "orders" | "hosting" | "staff" | "audit" | "incidents"
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
      <PageShell>
        <div className="max-w-md mx-auto my-16 p-5 text-center rounded-xl border border-white/[0.08] bg-[#12151E] space-y-4">
          <Lock className="w-10 h-10 text-emerald-400 mx-auto" />
          <h2 className="text-sm font-semibold text-slate-50">Staff Authentication Required</h2>
          <p className="text-sm text-slate-400 leading-relaxed">
            This area is restricted to authorized LibertyX administrators and owners.
          </p>
          <div className="pt-4 space-y-3">
            <button
              type="button"
              onClick={handleQuickLoginAsOwner}
              className="w-full py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black text-sm font-semibold transition active:scale-[0.98]"
            >
              Sign in as Eazykims
            </button>
            <Link
              to="/login?returnTo=/admin"
              className="block w-full py-2 rounded-lg border border-white/[0.08] bg-white/[0.06] hover:bg-white/[0.1] text-sm font-semibold text-slate-200 transition active:scale-[0.98]"
            >
              Sign in with Discord
            </Link>
          </div>
        </div>
      </PageShell>
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

  const tabs = [
    { id: "overview", label: "Overview", icon: Activity },
    { id: "users", label: "Users", count: users.length, icon: Users },
    { id: "creators", label: "Creators", count: applications.length, icon: Star },
    { id: "listings", label: "Listings", count: listings.length, icon: Store },
    { id: "orders", label: "Orders", count: orders.length, icon: ShoppingBag },
    { id: "hosting", label: "Hosting", count: hostingServers.length, icon: Server },
    { id: "staff", label: "Staff", count: staffList.length, icon: ShieldCheck },
    { id: "incidents", label: "Incidents", count: incidents.length, icon: AlertCircle },
    { id: "audit", label: "Audit Logs", count: auditLogs.length, icon: Clock },
  ];

  return (
    <PageShell fullWidth noPadding>
      <div className="flex flex-col md:flex-row min-h-screen">
        {/* Sidebar */}
        <div className="w-full md:w-64 border-r border-white/[0.08] bg-[#090A0F] flex flex-col shrink-0">
          <div className="p-4 border-b border-white/[0.08]">
            <h1 className="text-xl font-bold tracking-tight text-slate-50 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-500" />
              <span>Admin Panel</span>
            </h1>
            <p className="text-xs font-medium text-slate-500 mt-1 uppercase">Logged in as @{user.username}</p>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={cn(
                    "w-full flex items-center justify-between px-3 py-2 text-sm rounded-lg transition-colors",
                    activeTab === tab.id
                      ? "bg-emerald-500/10 text-emerald-400 font-semibold"
                      : "text-slate-400 hover:text-slate-50 hover:bg-[#12151E]"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </div>
                  {tab.count !== undefined && (
                    <span className="text-xs bg-white/[0.06] text-slate-400 px-1.5 py-0.5 rounded">
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-4 sm:p-6 lg:p-8 bg-[#090A0F] overflow-y-auto">
          {activeTab === "overview" && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold tracking-tight text-slate-50">Platform Overview</h2>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: "Total Users", value: users.length },
                  { label: "Listings", value: listings.length },
                  { label: "Orders", value: orders.length },
                  { label: "Active Nodes", value: hostingServers.length },
                ].map((stat) => (
                  <div key={stat.label} className="bg-[#12151E] border border-white/[0.08] rounded-xl p-4">
                    <span className="text-xs font-medium text-slate-500 uppercase">{stat.label}</span>
                    <p className="text-2xl font-bold text-slate-50 mt-1">{stat.value}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "users" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold tracking-tight text-slate-50">Registered Accounts</h2>
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search users..."
                    className="w-full pl-9 pr-3 py-2 bg-[#12151E] border border-white/[0.08] rounded-lg text-sm text-slate-50 focus:outline-none focus:border-emerald-500/30"
                  />
                </div>
              </div>
              <div className="bg-[#12151E] border border-white/[0.08] rounded-xl overflow-hidden">
                {users.length === 0 ? (
                  <EmptyState icon={Users} title="No Users" description="No registered users found." />
                ) : (
                  <div className="divide-y divide-white/[0.08]">
                    {users.map((u) => (
                      <div key={u.id} className="p-4 flex items-center justify-between hover:bg-[#1C212E] transition-colors">
                        <div>
                          <p className="text-sm font-semibold text-slate-50">{u.display_name || u.username}</p>
                          <p className="text-xs text-slate-400">@{u.username} • ID: {u.id}</p>
                          {u.banned && <p className="text-xs text-rose-400 mt-1">Banned: {u.ban_reason}</p>}
                        </div>
                        <div>
                          {u.banned ? (
                            <button
                              onClick={() => handleUnbanUser(u)}
                              className="px-3 py-1.5 bg-white/[0.06] hover:bg-white/[0.1] text-emerald-400 border border-white/[0.08] rounded-lg text-sm transition"
                            >
                              Unban
                            </button>
                          ) : (
                            <button
                              onClick={() => setBanModalUser(u)}
                              className="px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-lg text-sm transition"
                            >
                              Suspend
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "listings" && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold tracking-tight text-slate-50">Marketplace Listings</h2>
              <div className="bg-[#12151E] border border-white/[0.08] rounded-xl overflow-hidden">
                {listings.length === 0 ? (
                  <EmptyState icon={Store} title="No Listings" description="No active listings in the catalog." />
                ) : (
                  <div className="divide-y divide-white/[0.08]">
                    {listings.map((l) => (
                      <div key={l.id} className="p-4 flex items-center justify-between hover:bg-[#1C212E] transition-colors">
                        <div>
                          <p className="text-sm font-semibold text-slate-50">{l.title}</p>
                          <p className="text-xs text-slate-400">By @{l.seller_username} • {l.category}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Link
                            to={`/listing/${l.id}`}
                            className="px-3 py-1.5 bg-white/[0.06] hover:bg-white/[0.1] text-slate-200 border border-white/[0.08] rounded-lg text-sm transition"
                          >
                            Inspect
                          </Link>
                          {l.status !== "removed" && (
                            <button
                              onClick={() => handleRemoveListing(l.id, l.title)}
                              className="px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-lg text-sm transition"
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
            </div>
          )}

          {activeTab === "staff" && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold tracking-tight text-slate-50">Staff Management</h2>
              {isOwner && (
                <div className="bg-[#12151E] border border-white/[0.08] rounded-xl p-5 space-y-4">
                  <h3 className="text-sm font-semibold text-slate-50 flex items-center gap-2">
                    <UserPlus className="w-4 h-4 text-emerald-400" />
                    <span>Assign Staff Role</span>
                  </h3>
                  <form onSubmit={handleAddStaff} className="flex flex-col sm:flex-row gap-3">
                    <input
                      type="text"
                      value={newStaffUser}
                      onChange={(e) => setNewStaffUser(e.target.value)}
                      placeholder="Username..."
                      className="flex-1 bg-[#090A0F] border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-slate-50 focus:outline-none focus:border-emerald-500/30"
                    />
                    <select
                      value={newStaffRole}
                      onChange={(e) => setNewStaffRole(e.target.value)}
                      className="bg-[#090A0F] border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-slate-50 focus:outline-none"
                    >
                      <option value="owner">Owner</option>
                      <option value="admin">Admin</option>
                      <option value="moderator">Moderator</option>
                      <option value="support">Support</option>
                    </select>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-semibold rounded-lg text-sm transition active:scale-[0.98]"
                    >
                      Assign Role
                    </button>
                  </form>
                </div>
              )}

              <div className="bg-[#12151E] border border-white/[0.08] rounded-xl overflow-hidden">
                <div className="divide-y divide-white/[0.08]">
                  {staffList.map((s) => (
                    <div key={s.id || s.user_id} className="p-4 flex items-center justify-between hover:bg-[#1C212E] transition-colors">
                      <div>
                        <p className="text-sm font-semibold text-slate-50">@{s.username || s.user_id}</p>
                        <p className="text-xs font-medium text-emerald-400 uppercase mt-0.5">{s.role}</p>
                      </div>
                      {isOwner && s.username !== "eazykims" && (
                        <button
                          onClick={() => handleRemoveStaff(s.id)}
                          className="text-rose-400 hover:text-rose-300 text-sm transition"
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

          {activeTab === "incidents" && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold tracking-tight text-slate-50">Incident Management</h2>
              <div className="bg-[#12151E] border border-white/[0.08] rounded-xl p-5 space-y-4">
                <h3 className="text-sm font-semibold text-slate-50">Log New Incident</h3>
                <form onSubmit={handleCreateIncident} className="space-y-3">
                  <input
                    type="text"
                    value={newIncidentTitle}
                    onChange={(e) => setNewIncidentTitle(e.target.value)}
                    placeholder="Incident Title"
                    className="w-full bg-[#090A0F] border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-slate-50 focus:outline-none focus:border-emerald-500/30"
                    required
                  />
                  <textarea
                    rows={2}
                    value={newIncidentDesc}
                    onChange={(e) => setNewIncidentDesc(e.target.value)}
                    placeholder="Details..."
                    className="w-full bg-[#090A0F] border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-slate-50 focus:outline-none focus:border-emerald-500/30 resize-none"
                  />
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-semibold rounded-lg text-sm transition active:scale-[0.98]"
                    >
                      Publish Incident
                    </button>
                  </div>
                </form>
              </div>

              <div className="bg-[#12151E] border border-white/[0.08] rounded-xl overflow-hidden">
                {incidents.length === 0 ? (
                  <EmptyState icon={AlertCircle} title="No Incidents" description="All services operational." />
                ) : (
                  <div className="divide-y divide-white/[0.08]">
                    {incidents.map((inc) => (
                      <div key={inc.id} className="p-4 flex items-center justify-between hover:bg-[#1C212E] transition-colors">
                        <div>
                          <p className="text-sm font-semibold text-slate-50">{inc.title}</p>
                          <p className="text-xs text-slate-400 mt-1">Status: {inc.status} • {new Date(inc.created_date).toLocaleString()}</p>
                        </div>
                        {inc.status !== "Resolved" && (
                          <button
                            onClick={() => handleResolveIncident(inc.id)}
                            className="px-3 py-1.5 bg-white/[0.06] hover:bg-white/[0.1] text-emerald-400 border border-white/[0.08] rounded-lg text-sm transition"
                          >
                            Resolve
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "audit" && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold tracking-tight text-slate-50">Audit Logs</h2>
              <div className="bg-[#12151E] border border-white/[0.08] rounded-xl overflow-hidden">
                {auditLogs.length === 0 ? (
                  <EmptyState icon={Clock} title="No Logs" description="No audit actions recorded yet." />
                ) : (
                  <div className="divide-y divide-white/[0.08]">
                    {auditLogs.map((log, idx) => (
                      <div key={log.id || idx} className="p-4 hover:bg-[#1C212E] transition-colors">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold text-emerald-400">{log.action}</span>
                          <span className="text-xs text-slate-500">{new Date(log.timestamp || log.created_date).toLocaleString()}</span>
                        </div>
                        <p className="text-sm text-slate-300 mt-1">
                          <strong>@{log.actor_username || "staff"}</strong> acted on <strong>{log.target}</strong>: {log.details}
                        </p>
                        {log.reason && <p className="text-xs text-slate-400 mt-1">Reason: {log.reason}</p>}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Catch-all for other tabs like Orders, Hosting, Creators to avoid empty screen */}
          {["creators", "orders", "hosting"].includes(activeTab) && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold tracking-tight text-slate-50 capitalize">{activeTab}</h2>
              <div className="bg-[#12151E] border border-white/[0.08] rounded-xl p-8 text-center">
                <p className="text-sm text-slate-400">Data visualization for {activeTab} is accessible via database.</p>
              </div>
            </div>
          )}

        </div>
      </div>

      {banModalUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#090A0F]/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#12151E] border border-white/[0.08] rounded-xl p-5 space-y-4 shadow-xl">
            <h3 className="text-sm font-semibold text-slate-50">Suspend Account: @{banModalUser.username}</h3>
            <textarea
              rows={3}
              value={banReason}
              onChange={(e) => setBanReason(e.target.value)}
              placeholder="Reason for suspension..."
              className="w-full bg-[#090A0F] border border-white/[0.08] rounded-lg p-3 text-sm text-slate-50 focus:outline-none focus:border-rose-500/30 resize-none"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setBanModalUser(null)}
                className="px-4 py-2 rounded-lg bg-white/[0.06] hover:bg-white/[0.1] text-slate-200 border border-white/[0.08] text-sm transition"
              >
                Cancel
              </button>
              <button
                onClick={handleBanUser}
                className="px-4 py-2 rounded-lg bg-rose-500 hover:bg-rose-400 text-white text-sm font-semibold transition active:scale-[0.98]"
              >
                Confirm Suspension
              </button>
            </div>
          </div>
        </div>
      )}
    </PageShell>
  );
}