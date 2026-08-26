import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiCheckCircle,
  FiAlertCircle, FiTrendingUp, FiZap, FiUser, FiClock
} from "react-icons/fi";
import { RadialBarChart, RadialBar, PolarAngleAxis } from "recharts";
import { useSelector } from "react-redux";
import { analyzeJobFit, getAllJobFits } from "../api/resume.api";
import { useCoins } from "../api/user.api";

// ─── Score Ring ──────────────────────────────────────────────
function ScoreRing({ score }) {
  const color = score >= 75 ? "#7c3aed" : score >= 50 ? "#f59e0b" : "#ef4444";

  return (
    <div className="relative flex items-center justify-center">
      <RadialBarChart
        width={110}
        height={110}
        cx={55}
        cy={55}
        innerRadius={40}
        outerRadius={53}
        startAngle={90}
        endAngle={-270}
        data={[{ value: score, fill: color }]}
        barSize={8}
      >
        <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
        <RadialBar background={{ fill: "#e5e7eb" }} dataKey="value" cornerRadius={8} />
      </RadialBarChart>

      <div className="absolute flex flex-col items-center">
        <span className="text-lg font-bold text-white leading-none">{score}</span>
        <span className="text-[9px] text-gray-200 mt-0.5">/ 100</span>
      </div>
    </div>
  );
}

// ─── Tag ─────────────────────────────────────────────────────
function Tag({ text, color }) {
  const styles = {
    purple: "bg-purple-50 text-purple-700 border-purple-200",
    red:    "bg-red-50    text-red-700    border-red-200",
    green:  "bg-green-50  text-green-700  border-green-200",
    yellow: "bg-yellow-50 text-yellow-700 border-yellow-200",
  };
  return (
    <span className={`text-[10px] px-1.5 py-1 rounded-md border font-medium ${styles[color]}`}>
      {text}
    </span>
  );
}

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
            Job Fit
          </span>
        </div>
      </div>
    </nav>
  );
}

// ─── Result Card ──────────────────────────────────────────────
function ResultCard({ data }) {
  return (
    <div className="space-y-3.5">
      {/* Score + Title */}
      <div className="relative overflow-hidden bg-[#000000]/90 backdrop-blur-2xl border border-white/10 rounded-2xl p-4 flex flex-col items-center gap-4 sm:flex-row shadow-[0_8px_32px_rgba(0,0,0,0.2)]">
        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] via-transparent to-transparent pointer-events-none" />
        <div className="relative">
          <ScoreRing score={data.matchScore} />
        </div>
        <div className="relative">
          <p className="text-white/50 text-xs mb-0.5">Job Match Score</p>
          <p className="text-lg sm:text-xl font-bold mb-1.5 text-white">
            {data.matchScore >= 75 ? "Strong Match" : data.matchScore >= 50 ? "Average Match" : "Needs Work"}
          </p>
          {data.jobTitle && (
            <div className="flex items-center gap-1.5">
              <FiUser className="text-purple-400 text-xs" />
              <span className="text-xs text-purple-300">{data.jobTitle}</span>
            </div>
          )}
        </div>
      </div>

      {/* Matched / Missing Skills */}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <div className="relative overflow-hidden bg-[#000000]/90 backdrop-blur-2xl border border-white/10 rounded-2xl p-4 shadow-[0_8px_32px_rgba(0,0,0,0.2)]">
          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] via-transparent to-transparent pointer-events-none" />
          <div className="relative flex items-center gap-1.5 mb-2.5">
            <FiCheckCircle className="text-green-400" size={14} />
            <p className="text-xs font-semibold text-white">Matched Skills</p>
          </div>
          <div className="relative flex flex-wrap gap-1.5">
            {data.matchedSkills?.length
              ? data.matchedSkills.map(s => <Tag key={s} text={s} color="green" />)
              : <span className="text-xs text-white/40">None detected</span>}
          </div>
        </div>

        <div className="relative overflow-hidden bg-[#000000]/90 backdrop-blur-2xl border border-white/10 rounded-2xl p-4 shadow-[0_8px_32px_rgba(0,0,0,0.2)]">
          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] via-transparent to-transparent pointer-events-none" />
          <div className="relative flex items-center gap-1.5 mb-2.5">
            <FiAlertCircle className="text-yellow-400" size={14} />
            <p className="text-xs font-semibold text-white">Missing Skills</p>
          </div>
          <div className="relative flex flex-wrap gap-1.5">
            {data.missingSkills?.length
              ? data.missingSkills.map(s => <Tag key={s} text={s} color="yellow" />)
              : <span className="text-xs text-white/40">None — great fit!</span>}
          </div>
        </div>
      </div>

      {/* Missing Keywords */}
      <div className="relative overflow-hidden bg-[#000000]/90 backdrop-blur-2xl border border-white/10 rounded-2xl p-4 shadow-[0_8px_32px_rgba(0,0,0,0.2)]">
        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] via-transparent to-transparent pointer-events-none" />
        <div className="relative flex items-center gap-1.5 mb-2.5">
          <FiZap className="text-red-400" size={14} />
          <p className="text-xs font-semibold text-white">Missing Keywords (ATS)</p>
        </div>
        <div className="relative flex flex-wrap gap-1.5">
          {data.missingKeywords?.length
            ? data.missingKeywords.map(s => <Tag key={s} text={s} color="red" />)
            : <span className="text-xs text-white/40">No keyword gaps found</span>}
        </div>
      </div>

      {/* Recommendations */}
      <div className="relative overflow-hidden bg-[#000000]/90 backdrop-blur-2xl border border-white/10 rounded-2xl p-4 shadow-[0_8px_32px_rgba(0,0,0,0.2)]">
        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] via-transparent to-transparent pointer-events-none" />
        <div className="relative flex items-center gap-1.5 mb-2.5">
          <FiTrendingUp className="text-purple-400" size={14} />
          <p className="text-xs font-semibold text-white">Recommendations</p>
        </div>
        <ul className="relative space-y-2">
          {data.recommendations?.map((r, i) => (
            <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-white/60">
              <span className="mt-0.5 w-4 h-4 rounded-full bg-white/10 border border-white/15 text-white/80 text-[10px] flex items-center justify-center shrink-0 font-semibold">
                {i + 1}
              </span>
              {r}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────
export default function JobFit({ setUser }) {
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const { resume } = useSelector(s => s.resume);

  const navigate = useNavigate();

  const fetchHistory = async () => {
    const response = await getAllJobFits();
    if (response?.data) setHistory(response.data);
  };

  useEffect(() => {
    getAllJobFits().then((response) => {
      if (response?.data) setHistory(response.data);
    });
  }, []);

  const handleAnalyze = async () => {
    if (!jobDescription.trim()) return alert("Please paste a job description");
    try {
      setLoading(true);

      const coinResponse = await useCoins({ coins: 10, action: "job-fit" });

      if (!coinResponse) {
        return alert("Could not process coins. Please try again.");
      }

      setUser((prev) => ({
        ...prev,
        interviewCoin: coinResponse.interviewCoin,
      }));

      const response = await analyzeJobFit({
        jobTitle,
        jobDescription,
      });

      if (!response?.data) {
        return alert(response?.message || "Analysis failed. Please try again.");
      }

      setResult(response.data);
      fetchHistory();

    } catch (err) {
      alert(err.response?.data?.message || "Analysis Failed");
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  // ── No resume yet ───────────────────────────────────────────
  if (!resume) return (
    <div className="min-h-screen bg-white text-[#0A0A0A]">
      <Navbar />
      <div className="flex min-h-screen items-center justify-center px-3 pt-18 pb-6">
        <div className="relative w-full max-w-sm rounded-3xl overflow-hidden bg-[#000000]/90 backdrop-blur-2xl border border-white/10 p-4 shadow-[0_8px_32px_rgba(0,0,0,0.25)] sm:p-6">
          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] via-transparent to-transparent pointer-events-none" />
          <h1 className="relative text-lg font-bold mb-1 text-white">Upload Resume First</h1>
          <p className="relative text-white/45 text-xs mb-4">
            Job fit analysis compares your resume against a job description.
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
              Job Fit Analysis
            </p>
            <h1 className="text-lg font-bold">Does my resume fit this job?</h1>
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
                onChange={e => setJobTitle(e.target.value)}
                placeholder="e.g. SDE-1 Backend Developer"
                className="mt-1 w-full h-10 rounded-xl bg-white/[0.06] border border-white/10 text-white placeholder:text-white/25 text-xs px-3 focus:outline-none focus:border-white/30"
              />
            </div>

            <div>
              <label className="text-[10px] text-white/40 tracking-widest uppercase font-medium">
                Job Description
              </label>
              <textarea
                value={jobDescription}
                onChange={e => setJobDescription(e.target.value)}
                placeholder="Paste the job description here..."
                rows={6}
                className="mt-1 w-full rounded-xl bg-white/[0.06] border border-white/10 text-white placeholder:text-white/25 text-xs px-3 py-2.5 focus:outline-none focus:border-white/30 resize-y"
              />
            </div>

            <button
              onClick={handleAnalyze}
              disabled={loading || !jobDescription.trim()}
              className="w-full h-10 rounded-xl font-semibold text-xs bg-white text-[#0A0A0A] shadow-[0_4px_14px_rgba(255,255,255,0.15)] hover:bg-white/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              {loading ? "Analyzing..." : "Analyze Job Fit →"}
            </button>

            <p className="text-[10px] text-white/35">
              Costs 10 interview coins per analysis
            </p>
          </div>
        </div>

        {/* Result */}
        {result && <ResultCard data={result} />}

        {/* History */}
        {history.length > 0 && (
          <div className="relative overflow-hidden bg-[#000000]/90 backdrop-blur-2xl border border-white/10 rounded-2xl p-4 shadow-[0_8px_32px_rgba(0,0,0,0.2)]">
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] via-transparent to-transparent pointer-events-none" />
            <div className="relative flex items-center gap-1.5 mb-2.5">
              <FiClock className="text-white/50" size={14} />
              <p className="text-xs font-semibold text-white">History</p>
            </div>
            <div className="relative space-y-2">
              {history.map(item => (
                <button
                  key={item._id}
                  onClick={() => setResult(item)}
                  className="w-full flex items-center justify-between rounded-xl bg-white/[0.05] border border-white/10 px-3 py-2.5 hover:bg-white/[0.08] transition-colors text-left"
                >
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-white truncate">
                      {item.jobTitle || "Untitled Job"}
                    </p>
                    <p className="text-[10px] text-white/40">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`text-xs font-bold shrink-0 ${item.matchScore >= 75 ? "text-purple-400" : item.matchScore >= 50 ? "text-yellow-400" : "text-red-400"}`}>
                    {item.matchScore}/100
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
