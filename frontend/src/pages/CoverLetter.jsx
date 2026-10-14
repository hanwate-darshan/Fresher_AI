import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiFileText, FiClock, FiCopy, FiCheck, FiZap,
} from "react-icons/fi";
import { useSelector } from "react-redux";
import { generateCoverLetter, getAllCoverLetters } from "../api/resume.api";
import { useCoins } from "../api/user.api";

// ─── Navbar ───────────────────────────────────────────────────
function Navbar() {
  const navigate = useNavigate();
  return (
    <nav className="fixed inset-x-0 top-0 z-20 border-b border-black/8 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex h-12 max-w-7xl items-center justify-between px-3 sm:px-5">
        <div
          onClick={() => navigate("/dashboard")}
          className="flex cursor-pointer items-center gap-1.5"
        >
          <span className="text-sm font-extrabold sm:text-base text-[#0A0A0A]">
            Fresher.AI
          </span>
          <span className="hidden rounded bg-black/5 px-1.5 py-0.5 text-[10px] text-black/50 sm:block">
            Cover Letter
          </span>
        </div>
      </div>
    </nav>
  );
}

// ─── Copy Button ──────────────────────────────────────────────
function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
      const el = document.createElement("textarea");
      el.value = text;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-white/15 text-white/60 hover:text-white hover:border-white/30 text-[10px] font-medium transition-colors"
    >
      {copied ? (
        <>
          <FiCheck size={11} className="text-green-400" />
          <span className="text-green-400">Copied!</span>
        </>
      ) : (
        <>
          <FiCopy size={11} />
          Copy
        </>
      )}
    </button>
  );
}

// ─── Cover Letter Card ────────────────────────────────────────
function CoverLetterCard({ data }) {
  return (
    <div className="relative overflow-hidden bg-[#000000]/90 backdrop-blur-2xl border border-white/10 rounded-2xl p-4 shadow-[0_8px_32px_rgba(0,0,0,0.2)]">
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] via-transparent to-transparent pointer-events-none" />

      {/* Header */}
      <div className="relative flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <FiFileText className="text-purple-400" size={14} />
          <div>
            <p className="text-xs font-semibold text-white">
              {data.jobTitle || "Cover Letter"}
            </p>
            <p className="text-[10px] text-white/40">
              {new Date(data.createdAt).toLocaleDateString("en-US", {
                month: "short", day: "numeric", year: "numeric"
              })}
            </p>
          </div>
        </div>
        <CopyButton text={data.coverLetter} />
      </div>

      {/* Cover Letter Text */}
      <div className="relative">
        <div className="bg-white/[0.04] border border-white/8 rounded-xl p-4">
          <pre className="text-xs sm:text-sm text-white/80 whitespace-pre-wrap font-sans leading-relaxed">
            {data.coverLetter}
          </pre>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────
export default function CoverLetterPage({ setUser }) {
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [selectedHistory, setSelectedHistory] = useState(null);
  const { resume } = useSelector((s) => s.resume);
  const navigate = useNavigate();

  const fetchHistory = async () => {
    const response = await getAllCoverLetters();
    if (response?.data) setHistory(response.data);
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleGenerate = async () => {
    if (!jobDescription.trim()) return alert("Please paste a job description");
    try {
      setLoading(true);
      setResult(null);
      setSelectedHistory(null);

      const coinResponse = await useCoins({ coins: 10, action: "cover-letter" });

      if (!coinResponse) {
        return alert("Could not process coins. Please try again.");
      }

      setUser((prev) => ({
        ...prev,
        interviewCoin: coinResponse.interviewCoin,
      }));

      const response = await generateCoverLetter({
        jobTitle,
        jobDescription,
      });

      if (!response?.data) {
        return alert(response?.message || "Generation failed. Please try again.");
      }

      setResult(response.data);
      fetchHistory();
    } catch (err) {
      alert(err.response?.data?.message || "Generation Failed");
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  // ── No resume yet ───────────────────────────────────────────
  if (!resume)
    return (
      <div className="min-h-screen bg-white text-[#0A0A0A]">
        <Navbar />
        <div className="flex min-h-screen items-center justify-center px-3 pt-18 pb-6">
          <div className="relative w-full max-w-sm rounded-3xl overflow-hidden bg-[#000000]/90 backdrop-blur-2xl border border-white/10 p-4 shadow-[0_8px_32px_rgba(0,0,0,0.25)] sm:p-6">
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] via-transparent to-transparent pointer-events-none" />
            <h1 className="relative text-lg font-bold mb-1 text-white">Upload Resume First</h1>
            <p className="relative text-white/45 text-xs mb-4">
              Cover letter generation uses your resume to personalize the letter.
              Upload your resume to get started.
            </p>
            <button
              onClick={() => navigate("/scorer")}
              className="relative w-full h-10 rounded-xl font-semibold text-xs bg-white text-[#0A0A0A] shadow-[0_4px_14px_rgba(255,255,255,0.15)] hover:bg-white/90 transition-all"
            >
              Go to Resume Scorer
            </button>
          </div>
        </div>
      </div>
    );

  // ── Main view ───────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-white text-[#0A0A0A]">
      <Navbar />

      <div className="max-w-6xl mx-auto px-3 pt-18 sm:pt-20 pb-8 space-y-3.5">

        {/* Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[10px] text-black/40 tracking-widest uppercase mb-0.5">
              AI Generator
            </p>
            <h1 className="text-lg font-bold">Cover Letter Generator</h1>
          </div>
        </div>

        {/* Input Card */}
        <div className="relative overflow-hidden bg-[#000000]/90 backdrop-blur-2xl border border-white/10 rounded-2xl p-4 shadow-[0_8px_32px_rgba(0,0,0,0.2)]">
          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] via-transparent to-transparent pointer-events-none" />
          <div className="relative space-y-3">
            <div>
              <label className="text-[10px] text-white/40 tracking-widest uppercase font-medium">
                Job Title (optional)
              </label>
              <input
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                placeholder="e.g. SDE-1 Backend Developer"
                className="mt-1 w-full h-10 rounded-xl bg-white/[0.06] border border-white/10 text-white placeholder:text-white/25 text-xs px-3 focus:outline-none focus:border-white/30"
              />
            </div>

            <div>
              <label className="text-[10px] text-white/40 tracking-widest uppercase font-medium">
                Job Description *
              </label>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the job description here..."
                rows={6}
                className="mt-1 w-full rounded-xl bg-white/[0.06] border border-white/10 text-white placeholder:text-white/25 text-xs px-3 py-2.5 focus:outline-none focus:border-white/30 resize-y"
              />
            </div>

            <button
              onClick={handleGenerate}
              disabled={loading || !jobDescription.trim()}
              className="w-full h-10 rounded-xl font-semibold text-xs bg-white text-[#0A0A0A] shadow-[0_4px_14px_rgba(255,255,255,0.15)] hover:bg-white/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-3 h-3 border border-[#0A0A0A]/30 border-t-[#0A0A0A] rounded-full animate-spin" />
                  Generating Cover Letter...
                </>
              ) : (
                <>
                  <FiZap size={12} />
                  Generate Cover Letter →
                </>
              )}
            </button>

            <p className="text-[10px] text-white/35">
              Costs 10 interview coins per generation
            </p>
          </div>
        </div>

        {/* New Result */}
        {result && <CoverLetterCard data={result} />}

        {/* Selected History Detail */}
        {selectedHistory && !result && (
          <CoverLetterCard data={selectedHistory} />
        )}

        {/* History */}
        {history.length > 0 && (
          <div className="relative overflow-hidden bg-[#000000]/90 backdrop-blur-2xl border border-white/10 rounded-2xl p-4 shadow-[0_8px_32px_rgba(0,0,0,0.2)]">
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] via-transparent to-transparent pointer-events-none" />
            <div className="relative flex items-center gap-1.5 mb-2.5">
              <FiClock className="text-white/50" size={14} />
              <p className="text-xs font-semibold text-white">History</p>
            </div>
            <div className="relative space-y-2">
              {history.map((item) => (
                <button
                  key={item._id}
                  onClick={() => {
                    setSelectedHistory(item);
                    setResult(null);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="w-full flex items-center justify-between rounded-xl bg-white/[0.05] border border-white/10 px-3 py-2.5 hover:bg-white/[0.08] transition-colors text-left"
                >
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-white truncate">
                      {item.jobTitle || "Untitled Job"}
                    </p>
                    <p className="text-[10px] text-white/40">
                      {new Date(item.createdAt).toLocaleDateString("en-US", {
                        month: "short", day: "numeric", year: "numeric"
                      })}
                    </p>
                  </div>
                  <FiFileText className="text-purple-400 shrink-0" size={14} />
                </button>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
