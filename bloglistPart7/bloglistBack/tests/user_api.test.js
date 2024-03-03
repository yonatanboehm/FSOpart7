const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const User = require("../models/user");
const helper = require("../utils/list_helper");
const api = supertest(app);

beforeEach(async () => {
  await User.deleteMany({});

  for (let user of helper.initialUsers) {
    let userObject = new User(user);
    await userObject.save();
  }
}, 100000);

describe("validating users", () => {
  test("user with invalid username not created", async () => {
    usersAtStart = await helper.usersInDb();

    const invalidUsername = {
      username: "ab",
      name: "Abraham Blincoln",
      password: "1234",
    };

    await api.post("/api/users").send(invalidUsername).expect(400);

    usersAtEnd = await helper.usersInDb();
    expect(usersAtStart.length).toBe(usersAtEnd.length);
  });

  test("user with invalid password not created", async () => {
    usersAtStart = await helper.usersInDb();

    const invalidPassword = {
      username: "AbeLinc",
      name: "Abraham Blincoln",
      password: "12",
    };

    await api.post("/api/users").send(invalidPassword).expect(400);

    usersAtEnd = await helper.usersInDb();
    expect(usersAtStart.length).toBe(usersAtEnd.length);
  });
});

afterAll(async () => {
  await mongoose.connection.close();
}, 100000);
