const request = require("supertest");
const app = require("../src/app");
const mongoose = require("mongoose");

let token = "";
let projectId = "";
let taskId = "";

// make data unique per run (CI safe)
const email = `tester_${Date.now()}@test.com`;
const password = "123456";

jest.setTimeout(20000);

describe(" FULL API TEST", () => {
  beforeAll(async () => {
    const mongoUri =
      process.env.MONGO_URI || "mongodb://127.0.0.1:27017/taskflow-test";

    await mongoose.connect(mongoUri);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  // Register
  it("should register a new user", async () => {
    const res = await request(app).post("/api/auth/register").send({
      name: "Tester1",
      email,
      password,
    });

    console.log("REGISTER:", res.body);

    expect([200, 201]).toContain(res.statusCode);
    expect(res.body.token).toBeDefined();

    // keep token so the rest of the suite can run
    token = res.body.token;
  });

  // Login
  it("should login the user", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email,
      password,
    });

    console.log("LOGIN:", res.body);

    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();

    token = res.body.token;
  });

  // Create Project
  it("should create a new project", async () => {
    const res = await request(app)
      .post("/api/projects")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Test Project",
        description: "Project from automated test",
      });

    console.log("CREATE PROJECT:", res.body);

    expect(res.statusCode).toBe(201);
    expect(res.body._id).toBeDefined();

    projectId = res.body._id;
  });

  // Get Projects
  it("should fetch user projects", async () => {
    const res = await request(app)
      .get("/api/projects")
      .set("Authorization", `Bearer ${token}`);

    console.log("GET PROJECTS:", res.body);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  // Create Task
  it("should create a new task", async () => {
    const res = await request(app)
      .post("/api/tasks")
      .set("Authorization", `Bearer ${token}`)
      .send({
        projectId,
        title: "First Test Task",
        description: "Task from automated test",
      });

    console.log("CREATE TASK:", res.body);

    expect(res.statusCode).toBe(201);
    expect(res.body._id).toBeDefined();

    taskId = res.body._id;
  });

  // Get Tasks
  it("should fetch project tasks", async () => {
    const res = await request(app)
      .get(`/api/tasks/${projectId}`)
      .set("Authorization", `Bearer ${token}`);

    console.log("GET TASKS:", res.body);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  // Update Task
  it("should update task status", async () => {
    const res = await request(app)
      .patch(`/api/tasks/${taskId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ status: "done" });

    console.log("UPDATE TASK:", res.body);

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe("done");
  });

  // Delete Task
  it("should delete a task", async () => {
    const res = await request(app)
      .delete(`/api/tasks/${taskId}`)
      .set("Authorization", `Bearer ${token}`);

    console.log("DELETE TASK:", res.body);

    expect([200, 204]).toContain(res.statusCode);
  });
});