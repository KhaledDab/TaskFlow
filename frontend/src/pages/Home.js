import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProjects } from "../services/projects";
import { getTaskSummary } from "../services/tasks";
import { getHabits } from "../services/habits";

export default function Home() {
  const navigate = useNavigate();
  const [projectsCount, setProjectsCount] = useState(0);
  const [summary, setSummary] = useState({ total: 0, pending: 0, inProgress: 0, done: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const projects = await getProjects();
        const s = await getTaskSummary();
        setProjectsCount(projects.length);
        setSummary({
          total: s.total,
          pending: s.pending,
          inProgress: s.inProgress,
          done: s.done,
        });
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <div className="card">Loading dashboard…</div>;

  return (
    <div>
      <div className="grid">
        <div className="card">
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.7)" }}>Projects</div>
          <div style={{ fontSize: 28, fontWeight: 900 }}>{projectsCount}</div>
          <button className="btn btnPrimary" style={{ marginTop: 12 }} onClick={() => navigate("/projects")}>
            Go to Projects
          </button>
        </div>
      <div
        className="card"
        style={{ cursor: "pointer" }}
        onClick={() => navigate("/habits")}
      >
        <h3>Habit Tracker</h3>
        <p style={{ opacity: 0.8 }}>
          Track daily habits like LeetCode, studying, gym, reading, etc.
        </p>
      </div>

        <div className="card">
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.7)" }}>Tasks (All)</div>
          <div style={{ fontSize: 28, fontWeight: 900 }}>{summary.total}</div>
          <div style={{ marginTop: 10, color: "rgba(255,255,255,0.75)" }}>
            Pending: <b>{summary.pending}</b> • In Progress: <b>{summary.inProgress}</b> • Done: <b>{summary.done}</b>
          </div>
        </div>
      </div>
    </div>
  );
}
