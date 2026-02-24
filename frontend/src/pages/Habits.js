import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createHabit, deleteHabit, getHabits, toggleHabitDay } from "../services/habits";

const NAME_COL_WIDTH = 260; // must match header + rows
const CELL_SIZE = 28;
const GAP = 8;

function pad2(n) {
  return String(n).padStart(2, "0");
}

function ymd(dateObj) {
  const y = dateObj.getFullYear();
  const m = pad2(dateObj.getMonth() + 1);
  const d = pad2(dateObj.getDate());
  return `${y}-${m}-${d}`;
}

function addDays(dateObj, delta) {
  const d = new Date(dateObj);
  d.setDate(d.getDate() + delta);
  return d;
}

function startOfToday() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

// Current streak = consecutive days ending today (today must be done)
function computeCurrentStreak(daysDone) {
  const set = new Set(daysDone || []);
  let streak = 0;

  let cursor = startOfToday();
  while (set.has(ymd(cursor))) {
    streak += 1;
    cursor = addDays(cursor, -1);
  }
  return streak;
}

// Best streak = longest consecutive run anywhere
function computeBestStreak(daysDone) {
  const set = new Set(daysDone || []);
  if (set.size === 0) return 0;

  const sorted = Array.from(set).sort(); // YYYY-MM-DD lexicographic sort is OK
  let best = 1;
  let current = 1;

  for (let i = 1; i < sorted.length; i++) {
    const prev = sorted[i - 1];
    const cur = sorted[i];

    const prevDate = new Date(prev + "T00:00:00");
    const curDate = new Date(cur + "T00:00:00");
    const diffDays = Math.round((curDate - prevDate) / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      current += 1;
      if (current > best) best = current;
    } else if (diffDays > 1) {
      current = 1;
    }
  }

  return best;
}

export default function Habits() {
  const navigate = useNavigate();
  const [habits, setHabits] = useState([]);
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  // month navigation
  const [viewDate, setViewDate] = useState(() => {
    const d = new Date();
    d.setDate(1);
    return d;
  });

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth(); // 0-11

  const monthLabel = viewDate.toLocaleDateString(undefined, {
    month: "long",
    year: "numeric",
  });

  function goPrevMonth() {
    setViewDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  }

  function goNextMonth() {
    setViewDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  }

  function goThisMonth() {
    const d = new Date();
    setViewDate(new Date(d.getFullYear(), d.getMonth(), 1));
  }

  const daysInMonth = useMemo(() => new Date(year, month + 1, 0).getDate(), [year, month]);

  const dayList = useMemo(() => {
    const arr = [];
    for (let d = 1; d <= daysInMonth; d++) arr.push(new Date(year, month, d));
    return arr;
  }, [year, month, daysInMonth]);

  // ONE grid template for header + all rows => perfect alignment
  const gridTemplateColumns = useMemo(() => {
    return `${NAME_COL_WIDTH}px repeat(${dayList.length}, ${CELL_SIZE}px)`;
  }, [dayList.length]);

  async function load() {
    setError("");
    setLoading(true);
    try {
      const data = await getHabits();
      setHabits(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e?.response?.data?.message || "Failed to load habits");
      setHabits([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function onCreate(e) {
    e.preventDefault();
    const n = name.trim();
    if (!n) return;

    setError("");
    try {
      const created = await createHabit(n);
      setHabits((prev) => [created, ...prev]);
      setName("");
    } catch (e2) {
      setError(e2?.response?.data?.message || "Failed to create habit");
    }
  }

  async function onToggle(habitId, dateStr) {
    setError("");
    try {
      const updated = await toggleHabitDay(habitId, dateStr);
      setHabits((prev) => prev.map((h) => (h._id === habitId ? updated : h)));
    } catch (e) {
      setError(e?.response?.data?.message || "Failed to toggle day");
    }
  }

  async function onDelete(habitId) {
    if (!window.confirm("Delete this habit?")) return;
    setError("");
    try {
      await deleteHabit(habitId);
      setHabits((prev) => prev.filter((h) => h._id !== habitId));
    } catch (e) {
      setError(e?.response?.data?.message || "Failed to delete habit");
    }
  }

  return (
    <div style={{ padding: 24 }}>
      <div className="row" style={{ justifyContent: "space-between", marginBottom: 12 }}>
        <button className="btn" onClick={() => navigate("/home")}>
          ← Back to Home
        </button>

        <div className="row" style={{ gap: 10, alignItems: "center" }}>
          <button className="btn" onClick={goPrevMonth}>
            ←
          </button>

          <div style={{ fontWeight: 900, color: "rgba(255,255,255,0.9)" }}>{monthLabel}</div>

          <button className="btn" onClick={goNextMonth}>
            →
          </button>

          <button className="btn" onClick={goThisMonth}>
            Today
          </button>
        </div>
      </div>

      <h2 style={{ margin: "10px 0" }}>Habit Tracker</h2>

      <div className="card" style={{ marginBottom: 14 }}>
        <form onSubmit={onCreate} className="row" style={{ gap: 10 }}>
          <input
            className="input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder='New habit (e.g., "Solve LeetCode")'
            style={{ flex: 1 }}
          />
          <button className="btn btnPrimary">Add Habit</button>
        </form>

        {error && <div style={{ marginTop: 12, color: "#ffd6d6" }}>{error}</div>}
      </div>

      {loading ? (
        <div className="card">Loading…</div>
      ) : habits.length === 0 ? (
        <div className="card">No habits yet. Add your first one ✅</div>
      ) : (
        <div className="card" style={{ overflowX: "auto" }}>
          <div style={{ minWidth: 900 }}>
            {/* HEADER - GRID */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns,
                gap: GAP,
                alignItems: "center",
                marginBottom: 10,
              }}
            >
              <div style={{ fontWeight: 900, color: "rgba(255,255,255,0.85)" }}>Habit</div>

              {dayList.map((d) => (
                <div
                  key={ymd(d)}
                  style={{
                    width: CELL_SIZE,
                    textAlign: "center",
                    fontSize: 12,
                    color: "rgba(255,255,255,0.65)",
                  }}
                >
                  {d.getDate()}
                </div>
              ))}
            </div>

            {/* ROWS - SAME GRID */}
            <div style={{ display: "grid", gap: 14 }}>
              {habits.map((h) => {
                const doneSet = new Set(h.daysDone || []);
                const currentStreak = computeCurrentStreak(h.daysDone || []);
                const bestStreak = computeBestStreak(h.daysDone || []);

                // month completion (you said later we may remove this)
                const monthDoneCount = dayList.reduce((acc, d) => {
                  const key = ymd(d);
                  return acc + (doneSet.has(key) ? 1 : 0);
                }, 0);

                const monthPercent = Math.round((monthDoneCount / dayList.length) * 100);

                return (
                  <div
                    key={h._id}
                    style={{
                      display: "grid",
                      gridTemplateColumns,
                      gap: GAP,
                      alignItems: "center",
                    }}
                  >
                    {/* Left column */}
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontWeight: 900 }}>{h.name}</div>

                      <div style={{ marginTop: 6, fontSize: 12, color: "rgba(255,255,255,0.75)" }}>
                        🔥 Current streak: <b>{currentStreak}</b> day{currentStreak === 1 ? "" : "s"} • 🏆 Best:{" "}
                        <b>{bestStreak}</b>
                      </div>

                      <div style={{ marginTop: 4, fontSize: 12, color: "rgba(255,255,255,0.75)" }}>
                        ✅ This month: <b>{monthDoneCount}</b>/{dayList.length} ({monthPercent}%)
                      </div>

                      <button className="btn btnDanger" style={{ marginTop: 10 }} onClick={() => onDelete(h._id)}>
                        Delete
                      </button>
                    </div>

                    {/* Day cells */}
                    {dayList.map((d) => {
                      const dateStr = ymd(d);
                      const done = doneSet.has(dateStr);

                      return (
                        <button
                          key={dateStr}
                          className="habitCell"
                          onClick={() => onToggle(h._id, dateStr)}
                          title={dateStr}
                          style={{
                            width: CELL_SIZE,
                            height: CELL_SIZE,
                            borderRadius: 8,
                            border: "1px solid rgba(255,255,255,0.14)",
                            background: done ? "rgba(34,211,238,0.35)" : "rgba(255,255,255,0.06)",
                            color: "rgba(255,255,255,0.9)",
                            cursor: "pointer",
                          }}
                        >
                          {done ? "✓" : ""}
                        </button>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
