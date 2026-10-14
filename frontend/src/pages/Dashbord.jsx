import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { FiPlay, FiSidebar, FiEdit2, FiTarget, FiArrowRight } from "react-icons/fi";
import { BsStars } from "react-icons/bs";
import Sidebar from "../components/Sidebar";
import StatBox from "../components/Statbox";
import InterviewGraph from "../components/InterviewGraph";
import { useNavigate } from "react-router-dom";
import { getAllInterviews } from "../api/interview.api";
import api from "../utils/axios";

export default function Dashboard({ user, setUser }) {
  const [collapsed, setCollapsed] = useState(false); // desktop collapse
  const [mobileOpen, setMobileOpen] = useState(false); // mobile drawer

  const [stats, setStats] = useState({
    totalInterviews: 0,
    totalQuestions: 0,
    completed: 0,
    averageScore: 0,
  });

  const [technicalData, setTechnicalData] = useState([]);
  const [behaviouralData, setBehaviouralData] = useState([]);
  const [technicalCount, setTechnicalCount] = useState(0);
  const [hrCount, setHrCount] = useState(0);

  const firstName = user?.name?.split(" ")[0] ?? "there";
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInterviews = async () => {
      const response = await getAllInterviews();
      if (response) {
        setStats(response.stats || {
          totalInterviews: 0,
          totalQuestions: 0,
          completed: 0,
          averageScore: 0,
        });
        setTechnicalData(response.technicalData || []);
        setBehaviouralData(response.behaviouralData || []);
        setTechnicalCount(response.technicalCount || 0);
        setHrCount(response.hrCount || 0);
      }
    };
    fetchInterviews();
  }, []);

  const handleLogout = async () => {
    try {
      const response = await api.get("/api/auth/logout");
      if (response.data.success) {
        setUser(null);
        navigate("/");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="bg-white min-h-screen text-[#0A0A0A] font-sans flex">
      <Sidebar
        user={user}
        onNewInterview={() => navigate("/interview")}
        onLogout={handleLogout}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* Main — desktop margin matches sidebar width */}
      <motion.main
        className={`flex-1 min-h-screen px-3 sm:px-4 md:px-6 py-4 md:py-6 transition-all duration-300 ${
          collapsed ? "md:ml-[72px]" : "md:ml-[260px]"
        }`}
      >
        {/* Top Bar */}
        <div className="flex items-center justify-between mb-5 md:mb-6">
          <div className="flex items-center gap-2.5">
            {/* Mobile hamburger */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setMobileOpen(true)}
              className="md:hidden text-black/40 hover:text-[#0A0A0A] transition-colors"
            >
              <FiSidebar size={17} />
            </motion.button>

            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <p className="text-black/40 text-[11px] md:text-xs font-medium mb-0.5">
                Overview
              </p>
              <h1 className="text-lg md:text-xl font-bold text-[#0A0A0A]">
                Hello, {firstName} 👋
              </h1>
            </motion.div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-black/8 mb-5 md:mb-6" />

        {/* Stat Boxes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-2.5 md:gap-3">
          <StatBox
            label="Total Interviews"
            value={stats?.totalInterviews}
            subHighlight="All Time"
            sub="Interviews Created"
            index={0}
          />

          <StatBox
            label="Questions Solved"
            value={stats?.totalQuestions}
            subHighlight="Answered"
            sub="Across All Interviews"
            index={1}
          />

          <StatBox
            label="Completed"
            value={stats?.completed}
            subHighlight={`${stats?.totalInterviews || 0} Total`}
            sub="Interviews Finished"
            index={2}
          />

          <StatBox
            label="Average Score"
            value={`${Math.round(stats?.averageScore || 0)}/100`}
            subHighlight="Completed Only"
            sub="Average Performance"
            index={3}
          />
        </div>

        {/* AI Accelerators / Career Growth Tools Section */}
        <div className="mt-8 mb-6">
          <div className="mb-3">
            <p className="text-black/40 text-[10px] md:text-[11px] font-semibold uppercase tracking-widest mb-0.5">
              AI Accelerators
            </p>
            <h2 className="text-[#0A0A0A] font-bold text-sm md:text-base">
              Career Growth Tools
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
            {/* Career Coach Card */}
            <motion.div
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
              onClick={() => navigate("/career-coach")}
              className="group relative cursor-pointer overflow-hidden rounded-xl border border-black/10 bg-white p-4 md:p-5 shadow-sm transition-all duration-300 hover:bg-[#000000] hover:border-black hover:shadow-[0_12px_36px_rgba(0,0,0,0.28)]"
            >
              {/* Glass sheen on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.12] via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none" />

              <div className="relative flex items-center justify-between mb-3.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-black/5 text-[#0A0A0A] transition-all duration-300 group-hover:bg-white/10 group-hover:text-white group-hover:scale-110">
                  <BsStars size={17} />
                </div>
                <span className="rounded-full bg-black/5 px-2.5 py-0.5 text-[10px] font-semibold text-black/60 border border-black/8 transition-all duration-300 group-hover:bg-white/10 group-hover:text-white group-hover:border-white/20">
                  Free Mentor
                </span>
              </div>

              <h3 className="relative font-bold text-sm md:text-base text-[#0A0A0A] transition-colors duration-300 group-hover:text-white">
                AI Career Coach
              </h3>
              <p className="relative mt-1 text-xs text-black/50 leading-relaxed transition-colors duration-300 group-hover:text-white/60 line-clamp-2">
                Ask personalized career advice, interview strategy & salary tips based on your resume.
              </p>

              <div className="relative mt-4 flex items-center text-xs font-semibold text-black/70 transition-all duration-300 group-hover:text-white gap-1.5">
                <span>Start chatting</span>
                <FiArrowRight size={13} className="transition-transform duration-300 group-hover:translate-x-1.5" />
              </div>
            </motion.div>

            {/* Cover Letter Card */}
            <motion.div
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
              onClick={() => navigate("/cover-letter")}
              className="group relative cursor-pointer overflow-hidden rounded-xl border border-black/10 bg-white p-4 md:p-5 shadow-sm transition-all duration-300 hover:bg-[#000000] hover:border-black hover:shadow-[0_12px_36px_rgba(0,0,0,0.28)]"
            >
              {/* Glass sheen on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.12] via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none" />

              <div className="relative flex items-center justify-between mb-3.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-black/5 text-[#0A0A0A] transition-all duration-300 group-hover:bg-white/10 group-hover:text-white group-hover:scale-110">
                  <FiEdit2 size={16} />
                </div>
                <span className="rounded-full bg-black/5 px-2.5 py-0.5 text-[10px] font-semibold text-black/60 border border-black/8 transition-all duration-300 group-hover:bg-white/10 group-hover:text-white group-hover:border-white/20">
                  Instant AI
                </span>
              </div>

              <h3 className="relative font-bold text-sm md:text-base text-[#0A0A0A] transition-colors duration-300 group-hover:text-white">
                Cover Letter Generator
              </h3>
              <p className="relative mt-1 text-xs text-black/50 leading-relaxed transition-colors duration-300 group-hover:text-white/60 line-clamp-2">
                Paste any job description and generate ATS-optimized, personalized cover letters.
              </p>

              <div className="relative mt-4 flex items-center text-xs font-semibold text-black/70 transition-all duration-300 group-hover:text-white gap-1.5">
                <span>Generate letter</span>
                <FiArrowRight size={13} className="transition-transform duration-300 group-hover:translate-x-1.5" />
              </div>
            </motion.div>

            {/* Job Fit Card */}
            <motion.div
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
              onClick={() => navigate("/job-fit")}
              className="group relative cursor-pointer overflow-hidden rounded-xl border border-black/10 bg-white p-4 md:p-5 shadow-sm transition-all duration-300 hover:bg-[#000000] hover:border-black hover:shadow-[0_12px_36px_rgba(0,0,0,0.28)]"
            >
              {/* Glass sheen on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.12] via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none" />

              <div className="relative flex items-center justify-between mb-3.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-black/5 text-[#0A0A0A] transition-all duration-300 group-hover:bg-white/10 group-hover:text-white group-hover:scale-110">
                  <FiTarget size={17} />
                </div>
                <span className="rounded-full bg-black/5 px-2.5 py-0.5 text-[10px] font-semibold text-black/60 border border-black/8 transition-all duration-300 group-hover:bg-white/10 group-hover:text-white group-hover:border-white/20">
                  ATS Match
                </span>
              </div>

              <h3 className="relative font-bold text-sm md:text-base text-[#0A0A0A] transition-colors duration-300 group-hover:text-white">
                Job Fit Analysis
              </h3>
              <p className="relative mt-1 text-xs text-black/50 leading-relaxed transition-colors duration-300 group-hover:text-white/60 line-clamp-2">
                Match your resume against requirements with detailed gap analysis and keyword suggestions.
              </p>

              <div className="relative mt-4 flex items-center text-xs font-semibold text-black/70 transition-all duration-300 group-hover:text-white gap-1.5">
                <span>Analyze match</span>
                <FiArrowRight size={13} className="transition-transform duration-300 group-hover:translate-x-1.5" />
              </div>
            </motion.div>
          </div>
        </div>

        {/* Graph Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="mb-3 md:mb-4"
        >
          <p className="text-black/40 text-[10px] font-semibold uppercase tracking-widest mt-2.5 mb-1">
            Performance
          </p>
          <h2 className="text-[#0A0A0A] font-bold text-sm md:text-base mb-3 md:mb-4">
            Interview History
          </h2>
        </motion.div>

        <div className="w-full overflow-x-auto">
          <InterviewGraph
            technicalData={technicalData}
            behaviouralData={behaviouralData}
            technicalCount={technicalCount}
            hrCount={hrCount}
          />
        </div>
      </motion.main>
    </div>
  );
}