const request = require('supertest');
const app = require('../src/app');
const mongoose = require('mongoose');

let token = '';
let projectId = '';
let taskId = '';

jest.setTimeout(20000); // ✅ نزيد وقت التست لـ 20 ثانية

describe('✅ FULL API TEST', () => {

  beforeAll(async () => {
    await mongoose.connect('mongodb://127.0.0.1:27017/taskflow-test', {
        useNewUrlParser: true,
        useUnifiedTopology: true
        });
    });


  afterAll(async () => {
    await mongoose.connection.close(); // ✅ إغلاق الاتصال
  });

  // ✅ Register
  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Tester1',
        email: 'tester123@test.com',
        password: '123456'
      });

    console.log('REGISTER:', res.body);

    expect(res.statusCode).toBe(201);
    expect(res.body.token).toBeDefined();
  });

  // ✅ Login
  it('should login the user', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'tester@test.com',
        password: '123456'
      });

    console.log('LOGIN:', res.body);

    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();

    token = res.body.token;
  });

  // ✅ Create Project
  it('should create a new project', async () => {
    const res = await request(app)
      .post('/api/projects')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Test Project',
        description: 'Project from automated test'
      });

    console.log('CREATE PROJECT:', res.body);

    expect(res.statusCode).toBe(201);
    expect(res.body._id).toBeDefined();

    projectId = res.body._id;
  });

  // ✅ Get Projects
  it('should fetch user projects', async () => {
    const res = await request(app)
      .get('/api/projects')
      .set('Authorization', `Bearer ${token}`);

    console.log('GET PROJECTS:', res.body);

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  });

  // ✅ Create Task
  it('should create a new task', async () => {
    const res = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({
        projectId,
        title: 'First Test Task',
        description: 'Task from automated test'
      });

    console.log('CREATE TASK:', res.body);

    expect(res.statusCode).toBe(201);
    expect(res.body._id).toBeDefined();

    taskId = res.body._id;
  });

  // ✅ Get Tasks
  it('should fetch project tasks', async () => {
    const res = await request(app)
      .get(`/api/tasks/${projectId}`)
      .set('Authorization', `Bearer ${token}`);

    console.log('GET TASKS:', res.body);

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  });

  // ✅ Update Task
  it('should update task status', async () => {
    const res = await request(app)
      .patch(`/api/tasks/${taskId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        status: 'done'
      });

    console.log('UPDATE TASK:', res.body);

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('done');
  });

  // ✅ Delete Task
  it('should delete a task', async () => {
    const res = await request(app)
      .delete(`/api/tasks/${taskId}`)
      .set('Authorization', `Bearer ${token}`);

    console.log('DELETE TASK:', res.body);

    expect(res.statusCode).toBe(204);
  });

});
