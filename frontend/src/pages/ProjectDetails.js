import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { createTask, deleteTask, getTasks, updateTask } from "../services/tasks";

const STATUS_OPTIONS = [
  { value: "pending", label: "Pending" },
  { value: "in-progress", label: "In Progress" },
  { value: "done", label: "Done" },
];

export default function ProjectDetails() {
  const { id: projectId } = useParams();
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState("pending");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  async function load() {
    setError("");
    setLoading(true);
    try {
      const data = await getTasks(projectId);
      setTasks(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e?.response?.data?.message || "Failed to load tasks");
      setTasks([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  const counts = useMemo(() => {
    const c = { pending: 0, "in-progress": 0, done: 0 };
    for (const t of tasks) {
      if (c[t.status] !== undefined) c[t.status] += 1;
    }
    return c;
  }, [tasks]);

  async function onCreate(e) {
    e.preventDefault();
    const t = title.trim();
    if (!t) {
      setError("Task title is required");
      return;
    }

    setError("");
    setCreating(true);
    try {
      await createTask({ projectId, title: t, status });
      setTitle("");
      setStatus("pending");
      await load();
    } catch (e2) {
      setError(e2?.response?.data?.message || "Failed to create task");
    } finally {
      setCreating(false);
    }
  }

  async function onChangeStatus(taskId, newStatus) {
    setError("");
    try {
      await updateTask(taskId, { status: newStatus });
      setTasks((prev) =>
        prev.map((t) => (t._id === taskId ? { ...t, status: newStatus } : t))
      );
    } catch (e) {
      setError(e?.response?.data?.message || "Failed to update task");
    }
  }

  async function onDelete(taskId) {
    if (!window.confirm("Delete this task?")) return;

    setError("");
    try {
      await deleteTask(taskId);
      setTasks((prev) => prev.filter((t) => t._id !== taskId));
    } catch (e) {
      setError(e?.response?.data?.message || "Failed to delete task");
    }
  }

  return (
    <div>
      <div className="row" style={{ justifyContent: "space-between", marginBottom: 14 }}>
        <button className="btn" onClick={() => navigate("/projects")}>
          ← Back to Projects
        </button>

        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.7)" }}>
          Pending: <b>{counts.pending}</b> • In Progress: <b>{counts["in-progress"]}</b> • Done:{" "}
          <b>{counts.done}</b>
        </div>
      </div>

      <h2 style={{ margin: "10px 0 10px" }}>Project Tasks</h2>

      {/* Create Task */}
      <div className="card" style={{ marginBottom: 14 }}>
        <form onSubmit={onCreate} className="row" style={{ gap: 10 }}>
          <input
            className="input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="New task title"
            style={{ flex: 1 }}
          />

          <select
            className="select"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            style={{ width: 170 }}
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>

          <button className="btn btnPrimary" disabled={creating}>
            {creating ? "Adding..." : "Add"}
          </button>
        </form>

        {error && (
          <div
            style={{
              marginTop: 12,
              color: "#ffd6d6",
              background: "rgba(255,77,77,0.12)",
              border: "1px solid rgba(255,77,77,0.4)",
              padding: 10,
              borderRadius: 12,
            }}
          >
            {error}
          </div>
        )}
      </div>

      {/* Board */}
      {loading ? (
        <div className="card">Loading...</div>
      ) : tasks.length === 0 ? (
        <div className="card">No tasks yet. Add your first one ✅</div>
      ) : (
        <div className="board" style={{ marginTop: 14 }}>
          {["pending", "in-progress", "done"].map((col) => {
            const colLabel =
              col === "pending"
                ? "Pending"
                : col === "in-progress"
                ? "In Progress"
                : "Done";

            const colTasks = tasks.filter((t) => t.status === col);

            return (
              <div key={col} className="card">
                <div className="colTitle">
                  {colLabel} ({colTasks.length})
                </div>

                <div style={{ display: "grid", gap: 10 }}>
                  {colTasks.length === 0 ? (
                    <div style={{ fontSize: 13, color: "rgba(255,255,255,0.65)" }}>
                      No tasks here yet
                    </div>
                  ) : (
                    colTasks.map((t) => (
                      <div key={t._id} className="taskCard">
                        <div style={{ fontWeight: 900 }}>
                          {(t.title && String(t.title).trim()) || "(Untitled task)"}
                        </div>

                        {t.description && (
                          <div
                            style={{
                              fontSize: 12,
                              color: "rgba(255,255,255,0.7)",
                              marginTop: 6,
                            }}
                          >
                            {t.description}
                          </div>
                        )}

                        <div className="row" style={{ justifyContent: "space-between", marginTop: 10 }}>
                          <select
                            className="select"
                            value={t.status}
                            onChange={(e) => onChangeStatus(t._id, e.target.value)}
                            style={{ width: 160 }}
                          >
                            {STATUS_OPTIONS.map((s) => (
                              <option key={s.value} value={s.value}>
                                {s.label}
                              </option>
                            ))}
                          </select>

                          <button className="btn btnDanger" onClick={() => onDelete(t._id)}>
                            Delete
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
