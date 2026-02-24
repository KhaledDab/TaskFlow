import api from "./api";

export async function getHabits() {
  const res = await api.get("/habits");
  return res.data;
}

export async function createHabit(name) {
  const res = await api.post("/habits", { name });
  return res.data;
}

export async function toggleHabitDay(habitId, date) {
  const res = await api.patch(`/habits/${habitId}/toggle`, { date });
  return res.data;
}

export async function deleteHabit(habitId) {
  await api.delete(`/habits/${habitId}`);
}
