import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiSend, FiTrash2, FiUser, FiZap, FiCopy, FiCheck,
  FiArrowLeft, FiMessageSquare, FiBriefcase, FiCode, FiAward
} from "react-icons/fi";
import { BsStars } from "react-icons/bs";
import { chatWithCareerCoach, getResume } from "../api/resume.api";

// ─── Preset Prompt Suggestions ────────────────────────────────
const PROMPT_SUGGESTIONS = [
  {
    icon: <FiBriefcase size={16} />,
    title: "Job Search Strategy",
    prompt: "How can I find entry-level software developer jobs off-campus in India?",
  },
  {
    icon: <FiCode size={16} />,
    title: "Skills & Projects",
    prompt: "What 2-3 standout portfolio projects should I build to get noticed by recruiters?",
  },
  {
    icon: <FiMessageSquare size={16} />,
    title: "Interview Prep",
    prompt: "How should a fresher answer 'Tell me about yourself' and 'What are your weaknesses'?",
  },
  {
    icon: <FiAward size={16} />,
    title: "Resume & Salary",
    prompt: "Based on my background, what realistic CTC range should I expect and how to negotiate?",
  },
];

export default function CareerCoach({ user }) {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: `Hi ${user?.name?.split(" ")[0] || "there"}! 👋 I'm your AI Career Coach. I can analyze your resume, suggest high-impact projects, prepare you for HR and technical rounds, or advise on career paths. What's on your mind today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasResume, setHasResume] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const chatBottomRef = useRef(null);

  // Check if user has uploaded a resume
  useEffect(() => {
    const checkResume = async () => {
      try {
        const res = await getResume();
        if (res?.resume?.extractedText) {
          setHasResume(true);
        }
      } catch {
        setHasResume(false);
      }
    };
    checkResume();
  }, []);

  // Scroll to bottom on new message
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = async (messageText = input) => {
    const textToSend = typeof messageText === "string" ? messageText.trim() : input.trim();
    if (!textToSend || loading) return;

    const userMsg = {
      role: "user",
      content: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const history = newMessages
        .slice(1, -1)
        .map((m) => ({ role: m.role, content: m.content }));

      const res = await chatWithCareerCoach({
        message: textToSend,
        chatHistory: history,
      });

      if (res?.success && res.reply) {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: res.reply,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "Sorry, I encountered an issue connecting. Please try asking again!",
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Something went wrong while reaching the coach. Please try again.",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        role: "assistant",
        content: `Chat cleared! How can I help you next, ${user?.name?.split(" ")[0] || "friend"}?`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
  };

  const copyToClipboard = async (text, idx) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(idx);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch {
      // fallback
    }
  };

  return (
    <div className="flex h-screen flex-col bg-white text-[#0A0A0A] font-sans">
      {/* ── Top Navbar (App Black & White Theme) ── */}
      <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center justify-between border-b border-black/8 bg-white/80 px-4 backdrop-blur-xl sm:px-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/dashboard")}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-black/15 text-black/70 transition hover:border-black/35 hover:text-[#0A0A0A]"
            title="Back to Dashboard"
          >
            <FiArrowLeft size={16} />
          </button>

          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#000000] text-white shadow-sm">
              <BsStars size={15} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold tracking-tight text-[#0A0A0A] sm:text-base">
                  AI Career Coach
                </span>
                <span className="rounded bg-black/5 px-1.5 py-0.5 text-[10px] font-semibold text-black/60 border border-black/8">
                  Free
                </span>
              </div>
              <p className="hidden text-[11px] text-black/45 sm:block">
                Tailored fresher guidance powered by your profile & resume
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {hasResume ? (
            <span className="hidden items-center gap-1.5 rounded-full bg-black/5 border border-black/10 px-2.5 py-1 text-xs text-black/70 sm:flex">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Resume Active
            </span>
          ) : (
            <button
              onClick={() => navigate("/scorer")}
              className="hidden items-center gap-1.5 rounded-full border border-black/15 px-2.5 py-1 text-xs text-black/70 hover:bg-black/5 transition sm:flex"
            >
              Upload Resume for Personalization
            </button>
          )}

          <button
            onClick={handleClearChat}
            className="flex items-center gap-1.5 rounded-lg border border-black/15 px-2.5 py-1.5 text-xs text-black/70 hover:border-black/30 hover:text-black transition"
            title="Clear Chat"
          >
            <FiTrash2 size={13} />
            <span className="hidden sm:inline">Clear</span>
          </button>
        </div>
      </header>

      {/* ── Main Chat Area ── */}
      <main className="flex-1 overflow-y-auto bg-[#F8F9FA] px-4 py-6 sm:px-6">
        <div className="mx-auto max-w-3xl space-y-4">
          {/* Preset Prompts Carousel (when messages <= 1) */}
          {messages.length <= 1 && (
            <div className="my-3">
              <p className="mb-2.5 text-[10px] md:text-[11px] font-semibold uppercase tracking-widest text-black/40">
                Recommended topics for freshers
              </p>

              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                {PROMPT_SUGGESTIONS.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(item.prompt)}
                    className="group relative flex flex-col items-start overflow-hidden rounded-xl border border-black/10 bg-white p-3.5 text-left shadow-sm transition-all duration-300 hover:bg-[#000000] hover:border-black hover:shadow-[0_12px_36px_rgba(0,0,0,0.25)] hover:-translate-y-0.5 cursor-pointer"
                  >
                    {/* Glass sheen on hover */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/[0.12] via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none" />

                    <div className="relative mb-2 flex items-center gap-2">
                      <span className="rounded-lg bg-black/5 p-1.5 text-[#0A0A0A] transition-all duration-300 group-hover:bg-white/10 group-hover:text-white">
                        {item.icon}
                      </span>
                      <span className="text-xs font-bold text-[#0A0A0A] transition-colors duration-300 group-hover:text-white">
                        {item.title}
                      </span>
                    </div>
                    <p className="relative text-xs text-black/50 leading-relaxed transition-colors duration-300 group-hover:text-white/60 line-clamp-2">
                      {item.prompt}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Messages List */}
          {messages.map((msg, idx) => {
            const isUser = msg.role === "user";
            return (
              <div
                key={idx}
                className={`flex gap-2.5 ${isUser ? "justify-end" : "justify-start"}`}
              >
                {!isUser && (
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#000000] text-white shadow-sm mt-0.5">
                    <BsStars size={13} />
                  </div>
                )}

                <div
                  className={`group relative max-w-[85%] sm:max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    isUser
                      ? "bg-[#000000] text-white rounded-br-sm shadow-sm"
                      : "relative overflow-hidden bg-[#000000]/95 backdrop-blur-2xl border border-white/10 rounded-bl-sm text-white shadow-[0_8px_32px_rgba(0,0,0,0.2)]"
                  }`}
                >
                  {/* Subtle glass sheen for AI card */}
                  {!isUser && (
                    <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] via-transparent to-transparent pointer-events-none" />
                  )}

                  <div className="relative whitespace-pre-wrap">{msg.content}</div>

                  <div
                    className={`relative mt-2 flex items-center justify-between text-[10px] ${
                      isUser ? "text-white/50" : "text-white/40 pt-1 border-t border-white/8"
                    }`}
                  >
                    <span>{msg.timestamp}</span>

                    {!isUser && (
                      <button
                        onClick={() => copyToClipboard(msg.content, idx)}
                        className="opacity-70 hover:opacity-100 transition flex items-center gap-1 text-white/70 hover:text-white"
                        title="Copy message"
                      >
                        {copiedIndex === idx ? (
                          <>
                            <FiCheck className="text-emerald-400" size={11} />
                            <span className="text-emerald-400">Copied</span>
                          </>
                        ) : (
                          <>
                            <FiCopy size={11} />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>

                {isUser && (
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-black/10 border border-black/10 text-[#0A0A0A] text-xs font-bold mt-0.5">
                    {user?.name?.charAt(0)?.toUpperCase() || <FiUser size={12} />}
                  </div>
                )}
              </div>
            );
          })}

          {/* Thinking / Loading Indicator */}
          {loading && (
            <div className="flex gap-2.5 justify-start">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#000000] text-white shadow-sm mt-0.5">
                <BsStars size={13} className="animate-spin" />
              </div>
              <div className="relative overflow-hidden rounded-2xl rounded-bl-sm border border-white/10 bg-[#000000]/95 px-4 py-3 text-white shadow-[0_8px_32px_rgba(0,0,0,0.2)]">
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] via-transparent to-transparent pointer-events-none" />
                <div className="relative flex items-center gap-1.5">
                  <div className="h-1.5 w-1.5 rounded-full bg-white animate-bounce [animation-delay:-0.3s]" />
                  <div className="h-1.5 w-1.5 rounded-full bg-white animate-bounce [animation-delay:-0.15s]" />
                  <div className="h-1.5 w-1.5 rounded-full bg-white animate-bounce" />
                  <span className="ml-2 text-xs text-white/50">AI Coach is thinking...</span>
                </div>
              </div>
            </div>
          )}

          <div ref={chatBottomRef} />
        </div>
      </main>

      {/* ── Input Box Footer (Clean White/Black) ── */}
      <footer className="sticky bottom-0 z-20 shrink-0 border-t border-black/8 bg-white/90 p-3 sm:p-4 backdrop-blur-xl">
        <div className="mx-auto max-w-3xl">
          <div className="relative flex items-center rounded-xl border border-black/15 bg-white shadow-sm focus-within:border-black focus-within:ring-2 focus-within:ring-black/5 transition">
            <textarea
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything: resume tips, interview prep, project ideas, salary advice..."
              className="max-h-32 flex-1 resize-none bg-transparent px-4 py-3 text-sm text-[#0A0A0A] placeholder:text-black/35 focus:outline-none"
            />
            <button
              onClick={() => handleSend()}
              disabled={!input.trim() || loading}
              className="mr-2 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#000000] text-white transition hover:bg-black/80 disabled:opacity-25 disabled:cursor-not-allowed shadow-sm"
              title="Send message"
            >
              <FiSend size={14} />
            </button>
          </div>

          <div className="mt-1.5 flex items-center justify-between text-[11px] text-black/40 px-1">
            <span>Press Enter to send, Shift+Enter for new line</span>
            <span className="flex items-center gap-1">
              <FiZap size={11} className="text-black/60" />
              Free unlimited career mentoring
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
