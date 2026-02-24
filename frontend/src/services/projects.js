import api from "./api";

export async function getProjects() {
  const res = await api.get("/projects");
  return res.data;
}

export async function createProject({ title, startDate, endDate }) {
  const res = await api.post("/projects", { title, startDate, endDate });
  return res.data;
}

export async function updateProject(projectId, payload) {
  const res = await api.patch(`/projects/${projectId}`, payload);
  return res.data;
}

export async function deleteProject(projectId) {
  await api.delete(`/projects/${projectId}`);
}
