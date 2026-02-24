import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createProject, getProjects, updateProject, deleteProject } from "../services/projects";


export default function Projects() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [description, setDescription] = useState("");

  async function load() {
    setError("");
    setLoading(true);
    try {
      const data = await getProjects();
      setProjects(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e?.response?.data?.message || "Failed to load projects");
      setProjects([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function onCreate(e) {
    e.preventDefault();
    const t = title.trim();
    if (!t) {
      setError("Title is required");
      return;
    }

    setError("");
    try {
      await createProject({
        title: t,
        startDate,
        endDate,
        description,
      });

      setTitle("");
      setStartDate("");
      setEndDate("");
      setDescription("");
      await load();
    } catch (e) {
      setError(e?.response?.data?.message || "Failed to create project");
    }
  }

  async function onDeleteProject(projectId) {
    if (!window.confirm("Delete this project and all tasks inside it?")) return;
    try {
      await deleteProject(projectId);
      setProjects((prev) => prev.filter((p) => p._id !== projectId));
    } catch (e) {
      setError(e?.response?.data?.message || "Failed to delete project");
    }
  }

  async function onQuickEditProject(project) {
    const newTitle = window.prompt("New project title:", project.title);
    if (newTitle === null) return;
    const t = newTitle.trim();
    if (!t) return;

    try {
      const updated = await updateProject(project._id, { title: t });
      setProjects((prev) => prev.map((p) => (p._id === project._id ? updated : p)));
    } catch (e) {
      setError(e?.response?.data?.message || "Failed to update project");
    }
  }


  return (
    <div style={{ padding: 24 }}>
      <div className="row" style={{ justifyContent: "space-between", marginBottom: 12 }}>
        <button className="btn" onClick={() => navigate("/home")}>
          ← Back to Home
        </button>
      </div>

      <h2>Projects</h2>

      <form onSubmit={onCreate} className="row" style={{ gap: 10, margin: "12px 0", flexWrap: "wrap" }}>
        <input
          className="input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="New project title"
          style={{ width: 280 }}
        />

        <input
          className="input"
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          style={{ width: 170 }}
        />

        <input
          className="input"
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          style={{ width: 170 }}
        />

        <input
          className="input"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description (optional)"
          style={{ width: 320 }}
        />

        <button className="btn btnPrimary" type="submit">
          Create
        </button>
      </form>

      {error && <p style={{ color: "crimson" }}>{error}</p>}

      {loading ? (
        <p>Loading...</p>
      ) : projects.length === 0 ? (
        <p>No projects yet. Create your first one ✅</p>
      ) : (
        <div style={{ display: "grid", gap: 10, maxWidth: 700 }}>
          {projects.map((p) => (
            <div
              key={p._id}
              onClick={() => navigate(`/projects/${p._id}`)}
              style={{
                background: "white",
                borderRadius: 14,
                padding: 16,
                boxShadow: "0 8px 18px rgba(0,0,0,0.10)",
                cursor: "pointer",
              }}
            >
              {/* ✅ Title */}
              <div style={{ fontWeight: 900, fontSize: 16, color: "#111" }}>
                {p.title ? p.title : "(Untitled project)"}
              </div>

              {/* ✅ Dates */}
              <div style={{ fontSize: 12, color: "#666", marginTop: 8 }}>
                {p.startDate ? new Date(p.startDate).toLocaleDateString() : "No start"} →{" "}
                {p.endDate ? new Date(p.endDate).toLocaleDateString() : "No end"}
              </div>

              {/* ✅ Description */}
              {p.description && (
                <div style={{ fontSize: 13, color: "#444", marginTop: 8 }}>
                  {p.description}
                </div>
              )}

              <div className="row" style={{ justifyContent: "flex-end", marginTop: 12, gap: 10 }}>
              <button
                className="btn"
                onClick={(e) => {
                  e.stopPropagation();
                  onQuickEditProject(p);
                }}
              >
                Edit
              </button>

              <button
                className="btn btnDanger"
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteProject(p._id);
                }}
              >
                Delete
              </button>
            </div>


              <div style={{ fontSize: 12, color: "#666", marginTop: 10 }}>
                Click to open tasks →
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
