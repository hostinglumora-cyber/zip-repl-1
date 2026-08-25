import React, { useEffect, useState, useRef } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import {
  MessageCircle,
  Search,
  Send,
  User,
  ShieldCheck,
  Store,
  ExternalLink,
  ArrowLeft,
  Paperclip,
  CheckCheck,
  AlertCircle,
  MoreVertical,
  Ban,
  Flag,
  ShoppingBag,
  BadgeCheck,
  Package,
  Volume2,
  VolumeX,
} from "lucide-react";

import SiteNav from "@/components/SiteNav";
import { Footer } from "@/pages/Home";
import { useAuth } from "@/lib/AuthContext";
import { localDb } from "@/lib/localDb";
import { cn } from "@/lib/utils";

// Subtle Web Audio Chime for incoming message notifications
function playNotificationChime() {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
    osc.frequency.setValueAtTime(880, ctx.currentTime + 0.08); // A5
    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.3);
  } catch {}
}

export default function Messages() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const initialTo = searchParams.get("to") || "";
  const initialListingId = searchParams.get("listing") || "";
  const initialListingTitle = searchParams.get("title") || "";
  const initialOrderId = searchParams.get("order") || "";

  const [conversations, setConversations] = useState<any[]>([]);
  const [activeConvId, setActiveConvId] = useState<string>("");
  const [messages, setMessages] = useState<any[]>([]);
  const [recipient, setRecipient] = useState<any>(null);
  const [inputMessage, setInputMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  
  const [attachment, setAttachment] = useState<any>(
    initialListingId
      ? { type: "listing", id: initialListingId, title: initialListingTitle }
      : initialOrderId
      ? { type: "order", id: initialOrderId, title: initialListingTitle }
      : null
  );

  const activeUserId = user?.id || "user_demo";
  const prevMsgCountRef = useRef(0);

  // Load conversations
  useEffect(() => {
    async function loadConvs() {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const convList = await localDb.getConversations(user.id);
        setConversations(convList);

        if (initialTo) {
          const partnerProf = await localDb.getCreatorProfile(initialTo);
          const partnerId = partnerProf?.user_id || initialTo;
          const targetConvId = [user.id, partnerId].sort().join("_");
          
          setActiveConvId(targetConvId);
          setRecipient({
            id: partnerId,
            username: initialTo,
            display_name: partnerProf?.display_name || initialTo,
            avatar_url: partnerProf?.avatar_url || null,
          });
        } else if (convList.length > 0) {
          const first = convList[0];
          setActiveConvId(first.id);
          const otherId = first.participants.find((p: string) => p !== user.id);
          const otherUsername = first.participant_names?.[otherId] || otherId;
          const prof = await localDb.getCreatorProfile(otherUsername);
          setRecipient({
            id: otherId,
            username: otherUsername,
            display_name: prof?.display_name || otherUsername,
            avatar_url: prof?.avatar_url || null,
          });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadConvs();
  }, [user, initialTo]);

  // Load messages for active conversation
  useEffect(() => {
    async function loadMsg() {
      if (!activeConvId) return;
      const list = await localDb.getMessages(activeConvId);
      
      // If a new incoming message arrived and sound is enabled
      if (list.length > prevMsgCountRef.current && prevMsgCountRef.current > 0) {
        const last = list[list.length - 1];
        if (last.sender_id !== activeUserId && soundEnabled) {
          playNotificationChime();
        }
      }
      prevMsgCountRef.current = list.length;

      setMessages(list);
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    }

    loadMsg();
    const interval = setInterval(loadMsg, 3000);
    return () => clearInterval(interval);
  }, [activeConvId, activeUserId, soundEnabled]);

  const handleSelectConv = async (conv: any) => {
    setActiveConvId(conv.id);
    const otherId = conv.participants.find((p: string) => p !== activeUserId);
    const otherUsername = conv.participant_names?.[otherId] || otherId;
    const prof = await localDb.getCreatorProfile(otherUsername);
    setRecipient({
      id: otherId,
      username: otherUsername,
      display_name: prof?.display_name || otherUsername,
      avatar_url: prof?.avatar_url || null,
    });
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || !recipient) return;

    try {
      const sender = {
        id: user?.id || "guest",
        username: user?.username || "user",
        display_name: user?.display_name || user?.username || "User",
        avatar_url: user?.avatar_url || null,
      };

      const msg = await localDb.sendMessage(
        sender,
        recipient.id,
        recipient.username,
        inputMessage,
        attachment
      );

      setMessages((prev) => [...prev, msg]);
      setInputMessage("");
      setAttachment(null);
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);

      const updated = await localDb.getConversations(user?.id || "");
      setConversations(updated);
    } catch (err: any) {
      alert(err.message || "Failed to send message.");
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[#07090E] text-white flex flex-col justify-between">
        <SiteNav />
        <div className="max-w-md mx-auto my-auto p-10 text-center rounded-2xl border border-white/[0.08] bg-[#0A0D15] shadow-2xl">
          <MessageCircle className="w-10 h-10 text-emerald-400 mx-auto mb-3" />
          <h2 className="text-xl font-bold text-white mb-2">Direct Messaging Authentication</h2>
          <p className="text-xs text-zinc-400 mb-6 leading-relaxed">
            Please sign in with Discord to communicate securely with creators, request commissions, or get order support.
          </p>
          <Link
            to="/login?returnTo=/messages"
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 px-6 py-2.5 text-xs font-bold text-black transition"
          >
            Sign in with Discord
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#07090E] text-white flex flex-col justify-between selection:bg-emerald-500/25 selection:text-emerald-300">
      <div>
        <SiteNav />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="rounded-2xl border border-white/[0.08] bg-[#0A0D15] overflow-hidden shadow-2xl h-[calc(100vh-170px)] min-h-[560px] grid grid-cols-1 md:grid-cols-12">
            
            {/* ─── LEFT PANE: CONVERSATIONS (4 cols) ─── */}
            <div className="md:col-span-4 border-r border-white/[0.06] flex flex-col justify-between bg-[#07090E]/70">
              <div className="p-4 border-b border-white/[0.06] space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-bold text-white flex items-center gap-2">
                    <MessageCircle className="w-4 h-4 text-emerald-400" />
                    <span>Direct Messages</span>
                  </h2>
                  
                  <button
                    type="button"
                    onClick={() => setSoundEnabled(!soundEnabled)}
                    className="p-1 rounded-lg text-zinc-500 hover:text-zinc-300 transition"
                    title={soundEnabled ? "Notification sound enabled" : "Muted"}
                  >
                    {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-emerald-400" /> : <VolumeX className="w-3.5 h-3.5" />}
                  </button>
                </div>

                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search conversations..."
                    className="w-full rounded-xl border border-white/[0.08] bg-[#0A0D15] pl-8 pr-3 py-2 text-xs text-white placeholder:text-zinc-500 outline-none focus:border-emerald-500/50"
                  />
                </div>
              </div>

              {/* Conversations List */}
              <div className="flex-1 overflow-y-auto divide-y divide-white/[0.04]">
                {conversations.length === 0 && !initialTo ? (
                  <div className="p-8 text-center text-xs text-zinc-500">
                    No conversations yet. Message any creator directly from their product page or storefront.
                  </div>
                ) : (
                  conversations.map((c) => {
                    const otherId = c.participants?.find((p: string) => p !== activeUserId);
                    const otherName = c.participant_names?.[otherId] || otherId || "Creator";
                    const isSelected = c.id === activeConvId;

                    return (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => handleSelectConv(c)}
                        className={cn(
                          "w-full p-3.5 flex items-center gap-3 text-left transition-all",
                          isSelected ? "bg-emerald-500/10 border-l-2 border-emerald-400" : "hover:bg-white/[0.02]"
                        )}
                      >
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-black shrink-0">
                          {otherName.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between mb-0.5">
                            <span className="text-xs font-bold text-white truncate">{otherName}</span>
                            <span className="text-[10px] font-mono text-zinc-500">
                              {c.last_message_date ? new Date(c.last_message_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ""}
                            </span>
                          </div>
                          <p className="text-xs text-zinc-400 truncate">{c.last_message || "Active chat"}</p>
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </div>

            {/* ─── RIGHT PANE: ACTIVE CHAT (8 cols) ─── */}
            <div className="md:col-span-8 flex flex-col justify-between bg-[#0A0D15]">
              {recipient ? (
                <>
                  {/* Chat Header */}
                  <div className="p-4 border-b border-white/[0.06] flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold shrink-0">
                        {recipient.avatar_url ? (
                          <img src={recipient.avatar_url} alt="" className="w-full h-full object-cover rounded-xl" />
                        ) : (
                          recipient.display_name?.charAt(0).toUpperCase() || "C"
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-white">{recipient.display_name}</span>
                          <BadgeCheck className="w-3.5 h-3.5 text-emerald-400" />
                        </div>
                        <span className="text-[10px] font-mono text-zinc-400">@{recipient.username}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link
                        to={`/u/${recipient.username}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.06] text-xs font-semibold text-zinc-300 transition"
                      >
                        <Store className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Storefront</span>
                      </Link>
                    </div>
                  </div>

                  {/* Attachment Context Banner (Regarding Product or Order) */}
                  {attachment && (
                    <div className="px-4 py-2.5 bg-emerald-500/10 border-b border-emerald-500/20 flex items-center justify-between text-xs text-emerald-300">
                      <div className="flex items-center gap-2">
                        {attachment.type === "order" ? (
                          <Package className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <ShoppingBag className="w-4 h-4 text-emerald-400" />
                        )}
                        <span>
                          {attachment.type === "order" ? "Regarding Order: " : "About this listing: "}
                          <strong className="text-white">{attachment.title || attachment.id}</strong>
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setAttachment(null)}
                        className="text-zinc-400 hover:text-white"
                      >
                        ✕
                      </button>
                    </div>
                  )}

                  {/* Messages Bubble Stream */}
                  <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
                    {messages.length === 0 ? (
                      <div className="py-12 text-center text-xs text-zinc-500">
                        Beginning of encrypted message history with @{recipient.username}.
                      </div>
                    ) : (
                      messages.map((m) => {
                        const isMe = m.sender_id === activeUserId;
                        return (
                          <div
                            key={m.id}
                            className={cn("flex flex-col max-w-[75%]", isMe ? "ml-auto items-end" : "items-start")}
                          >
                            {m.attachment && (
                              <div className="p-2.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-xs text-emerald-300 mb-1 flex items-center gap-2">
                                <ShoppingBag className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                <span>Regarding: {m.attachment.title}</span>
                              </div>
                            )}

                            <div
                              className={cn(
                                "p-3.5 rounded-2xl text-xs leading-relaxed",
                                isMe
                                  ? "bg-emerald-500 text-black font-medium rounded-tr-none shadow-md shadow-emerald-500/10"
                                  : "bg-[#07090E] border border-white/[0.08] text-zinc-200 rounded-tl-none"
                              )}
                            >
                              <p className="whitespace-pre-wrap">{m.content}</p>
                            </div>

                            <span className="text-[9px] font-mono text-zinc-500 mt-1 px-1">
                              {new Date(m.created_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        );
                      })
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Message Input Form */}
                  <form onSubmit={handleSendMessage} className="p-4 border-t border-white/[0.06] bg-[#07090E]/60 flex gap-2">
                    <input
                      type="text"
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      placeholder={`Message @${recipient.username}...`}
                      className="flex-1 rounded-xl border border-white/[0.08] bg-[#0A0D15] px-4 py-2.5 text-xs text-white placeholder:text-zinc-500 outline-none focus:border-emerald-500/50"
                    />
                    <button
                      type="submit"
                      disabled={!inputMessage.trim()}
                      className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold transition disabled:opacity-50 flex items-center gap-1.5"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Send</span>
                    </button>
                  </form>
                </>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-zinc-500">
                  <MessageCircle className="w-12 h-12 mb-2 opacity-30 text-emerald-400" />
                  <p className="text-sm font-bold text-white mb-1">No conversation selected</p>
                  <p className="text-xs text-zinc-400">Select a conversation or click Message on any product page.</p>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
