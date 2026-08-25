import React, { useEffect, useState, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  MessageCircle,
  Search,
  Send,
  Store,
  ShoppingBag,
  BadgeCheck,
  Package,
  Volume2,
  VolumeX,
} from "lucide-react";

import PageShell from "@/components/PageShell";
import { useAuth } from "@/lib/AuthContext";
import { localDb } from "@/lib/localDb";
import { cn } from "@/lib/utils";

function playNotificationChime() {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(587.33, ctx.currentTime);
    osc.frequency.setValueAtTime(880, ctx.currentTime + 0.08);
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

  useEffect(() => {
    async function loadMsg() {
      if (!activeConvId) return;
      const list = await localDb.getMessages(activeConvId);
      
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
      <PageShell>
        <div className="max-w-md mx-auto my-16 p-8 text-center rounded-xl border border-white/[0.08] bg-[#12151E] shadow-sm">
          <MessageCircle className="w-10 h-10 text-emerald-500 mx-auto mb-3" />
          <h2 className="text-lg font-bold text-slate-50 mb-2">Messaging Authentication</h2>
          <p className="text-sm text-slate-400 mb-6">
            Please sign in to communicate securely with creators, request commissions, or get order support.
          </p>
          <Link
            to="/login?returnTo=/messages"
            className="inline-flex items-center gap-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 px-6 py-2.5 text-sm font-semibold text-black transition active:scale-[0.98]"
          >
            Sign in with Discord
          </Link>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell fullWidth noPadding>
      <div className="flex h-[calc(100vh-56px)] bg-[#090A0F]">
        
        {/* Left Panel: Conversations */}
        <div className="w-80 border-r border-white/[0.08] flex flex-col bg-[#090A0F] shrink-0">
          <div className="p-4 border-b border-white/[0.08] space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-50 flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-emerald-500" />
                <span>Messages</span>
              </h2>
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="p-1 text-slate-400 hover:text-slate-50 transition-colors"
              >
                {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="w-full bg-[#12151E] border border-white/[0.08] rounded-lg pl-9 pr-3 py-2 text-sm text-slate-50 focus:outline-none focus:border-emerald-500/30"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {conversations.length === 0 && !initialTo ? (
              <div className="p-6 text-center text-sm text-slate-500">
                No conversations yet. Message any creator from their product page.
              </div>
            ) : (
              <div className="divide-y divide-white/[0.04]">
                {conversations.map((c) => {
                  const otherId = c.participants?.find((p: string) => p !== activeUserId);
                  const otherName = c.participant_names?.[otherId] || otherId || "Creator";
                  const isSelected = c.id === activeConvId;

                  return (
                    <button
                      key={c.id}
                      onClick={() => handleSelectConv(c)}
                      className={cn(
                        "w-full p-4 flex items-center gap-3 text-left transition-colors",
                        isSelected ? "bg-[#12151E] border-l-2 border-emerald-500" : "hover:bg-[#12151E]"
                      )}
                    >
                      <div className="w-10 h-10 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-sm shrink-0 border border-emerald-500/30">
                        {otherName.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold text-slate-50 truncate">{otherName}</span>
                          <span className="text-[10px] text-slate-500">
                            {c.last_message_date ? new Date(c.last_message_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ""}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 truncate mt-0.5">{c.last_message || "Active chat"}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Panel: Chat Thread */}
        <div className="flex-1 flex flex-col bg-[#090A0F]">
          {recipient ? (
            <>
              {/* Header */}
              <div className="p-4 border-b border-white/[0.08] flex items-center justify-between bg-[#12151E]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold border border-emerald-500/30 shrink-0 overflow-hidden">
                    {recipient.avatar_url ? (
                      <img src={recipient.avatar_url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      recipient.display_name?.charAt(0).toUpperCase() || "C"
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-semibold text-slate-50">{recipient.display_name}</span>
                      <BadgeCheck className="w-4 h-4 text-emerald-400" />
                    </div>
                    <span className="text-xs text-slate-400">@{recipient.username}</span>
                  </div>
                </div>
                <Link
                  to={`/u/${recipient.username}`}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-white/[0.06] hover:bg-white/[0.1] text-slate-200 border border-white/[0.08] rounded-lg text-sm transition"
                >
                  <Store className="w-4 h-4 text-emerald-400" />
                  <span>Storefront</span>
                </Link>
              </div>

              {/* Context Banner */}
              {attachment && (
                <div className="px-4 py-2 bg-emerald-500/10 border-b border-emerald-500/30 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-emerald-400">
                    {attachment.type === "order" ? <Package className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
                    <span>
                      {attachment.type === "order" ? "Regarding Order: " : "About listing: "}
                      <strong className="text-slate-50">{attachment.title || attachment.id}</strong>
                    </span>
                  </div>
                  <button onClick={() => setAttachment(null)} className="text-emerald-400/70 hover:text-emerald-400">
                    ✕
                  </button>
                </div>
              )}

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 ? (
                  <div className="py-8 text-center text-sm text-slate-500">
                    Beginning of chat history with @{recipient.username}.
                  </div>
                ) : (
                  messages.map((m) => {
                    const isMe = m.sender_id === activeUserId;
                    return (
                      <div key={m.id} className={cn("flex flex-col max-w-[70%]", isMe ? "ml-auto items-end" : "items-start")}>
                        {m.attachment && (
                          <div className="p-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-xs text-emerald-400 mb-1 flex items-center gap-2">
                            <ShoppingBag className="w-3.5 h-3.5 shrink-0" />
                            <span>Regarding: {m.attachment.title}</span>
                          </div>
                        )}
                        <div
                          className={cn(
                            "p-3 rounded-xl text-sm",
                            isMe
                              ? "bg-emerald-500 text-black font-medium rounded-tr-sm"
                              : "bg-[#12151E] border border-white/[0.08] text-slate-50 rounded-tl-sm"
                          )}
                        >
                          <p className="whitespace-pre-wrap">{m.content}</p>
                        </div>
                        <span className="text-[10px] text-slate-500 mt-1 px-1">
                          {new Date(m.created_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <form onSubmit={handleSendMessage} className="p-4 bg-[#12151E] border-t border-white/[0.08] flex gap-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder={`Message @${recipient.username}...`}
                  className="flex-1 bg-[#090A0F] border border-white/[0.08] rounded-lg px-4 py-2 text-sm text-slate-50 focus:outline-none focus:border-emerald-500/30"
                />
                <button
                  type="submit"
                  disabled={!inputMessage.trim()}
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-semibold rounded-lg text-sm transition active:scale-[0.98] disabled:opacity-50 flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span className="hidden sm:inline">Send</span>
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-slate-500">
              <MessageCircle className="w-12 h-12 mb-3 opacity-50" />
              <p className="text-sm font-semibold text-slate-300">No conversation selected</p>
              <p className="text-xs mt-1">Select a chat from the left or message a creator.</p>
            </div>
          )}
        </div>

      </div>
    </PageShell>
  );
}
