import api from "./api";

export async function getTasks(projectId) {
  const res = await api.get(`/tasks/${projectId}`);
  return res.data;
}

export async function createTask({ projectId, title, description = "", status = "pending" }) {
  const res = await api.post("/tasks", { projectId, title, description, status });
  return res.data;
}

export async function updateTask(taskId, updates) {
  const res = await api.patch(`/tasks/${taskId}`, updates);
  return res.data;
}

export async function deleteTask(taskId) {
  await api.delete(`/tasks/${taskId}`);
}

export async function getTaskSummary() {
  const res = await api.get("/tasks/summary/me");
  return res.data;
}
