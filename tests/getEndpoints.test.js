const request = require("supertest");
const { ObjectId } = require("mongodb");
const app = require("../app");
const mongodb = require("../data/database");

const courseId = new ObjectId();
const assignmentId = new ObjectId();
const groupId = new ObjectId();
const userId = new ObjectId();

const testData = {
  users: [
    {
      _id: userId,
      githubId: "100939884",
      username: "JosephPrecious",
      email: "joseph@example.com",
      profileImage: "https://example.com/avatar.png"
    }
  ],
  courses: [
    {
      _id: courseId,
      courseName: "Web Services",
      instructor: "Brother Smith",
      semester: "Winter 2026",
      credits: 3,
      description: "API development course"
    }
  ],
  assignments: [
    {
      _id: assignmentId,
      title: "Final API Project",
      dueDate: "2026-06-30T23:59:00Z",
      courseId: courseId.toString(),
      status: "pending",
      priority: "high",
      submissionLink: "https://example.com/submission",
      notes: "Complete StudyHub API"
    }
  ],
  studygroups: [
    {
      _id: groupId,
      name: "Backend Study Group",
      topic: "Node and MongoDB",
      meetingTime: "2026-06-22T18:00:00Z",
      members: ["Joseph", "Mary"]
    }
  ]
};

const createMockDb = () => ({
  collection: (collectionName) => ({
    find: () => ({
      toArray: async () => testData[collectionName]
    }),
    findOne: async (query) =>
      testData[collectionName].find(
        (item) => item._id.toString() === query._id.toString()
      ) || null
  })
});

beforeAll(() => {
  mongodb.setDb(createMockDb());
});

describe("GET collection endpoints", () => {
  test("GET /users returns users", async () => {
    const response = await request(app).get("/users");

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveLength(1);
    expect(response.body[0]).toMatchObject({
      _id: userId.toString(),
      username: "JosephPrecious"
    });
  });

  test("GET /courses returns courses", async () => {
    const response = await request(app).get("/courses");

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveLength(1);
    expect(response.body[0]).toMatchObject({
      _id: courseId.toString(),
      courseName: "Web Services"
    });
  });

  test("GET /assignments returns assignments", async () => {
    const response = await request(app).get("/assignments");

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveLength(1);
    expect(response.body[0]).toMatchObject({
      _id: assignmentId.toString(),
      title: "Final API Project"
    });
  });

  test("GET /groups returns study groups", async () => {
    const response = await request(app).get("/groups");

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveLength(1);
    expect(response.body[0]).toMatchObject({
      _id: groupId.toString(),
      name: "Backend Study Group"
    });
  });
});

describe("GET single-resource endpoints", () => {
  test("GET /users/:id returns one user", async () => {
    const response = await request(app).get(`/users/${userId}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toMatchObject({
      _id: userId.toString(),
      username: "JosephPrecious"
    });
  });

  test("GET /courses/:id returns one course", async () => {
    const response = await request(app).get(`/courses/${courseId}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toMatchObject({
      _id: courseId.toString(),
      courseName: "Web Services"
    });
  });

  test("GET /assignments/:id returns one assignment", async () => {
    const response = await request(app).get(`/assignments/${assignmentId}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toMatchObject({
      _id: assignmentId.toString(),
      title: "Final API Project"
    });
  });

  test("GET /groups/:id returns one study group", async () => {
    const response = await request(app).get(`/groups/${groupId}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toMatchObject({
      _id: groupId.toString(),
      name: "Backend Study Group"
    });
  });
});
