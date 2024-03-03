const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const Blog = require("../models/blog");
const User = require("../models/user");
const helper = require("../utils/list_helper");
const jwt = require("jsonwebtoken");
const api = supertest(app);

beforeEach(async () => {
  await Blog.deleteMany({});
  await User.deleteMany({});
  for (let blog of helper.initialBlogs) {
    let blogObject = new Blog(blog);
    await blogObject.save();
  }
}, 100000);

test("blogs are returned as json", async () => {
  await api
    .get("/api/blogs")
    .expect(200)
    .expect("Content-Type", /application\/json/);
});

test("blogs id is defined", async () => {
  const response = await api.get("/api/blogs");
  response.body.map((blog) => expect(blog.id).toBeDefined());
});

describe("actions requiring authorization", () => {
  let token;

  beforeEach(async () => {
    const userRegiser = {
      username: "1234",
      name: "1234",
      password: "1234",
    };
    await api.post("/api/users").send(userRegiser).expect(201);

    const response = await api
      .post("/api/login")
      .send({
        username: userRegiser.username,
        password: userRegiser.password,
      })
      .expect(200);

    token = response.body;
  });

  test("posting a blog", async () => {
    const newBlog = {
      title: "Twitter shinanigans",
      author: "Elon Musk",
      url: "https://x.com",
    };

    await api
      .post("/api/blogs")
      .set({ Authorization: `Bearer ${token.token}` })
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1);

    const titles = blogsAtEnd.map((b) => b.title);
    expect(titles).toContain("Twitter shinanigans");
  }, 100000);

  test("a blog with no like is assigned 0 likes", async () => {
    const newBlog = {
      title: "My story",
      author: "Barack Obama",
      url: "https://barackobama.com",
    };

    await api
      .post("/api/blogs")
      .set({ Authorization: `Bearer ${token.token}` })
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const addedBlog = await Blog.find({ title: "My story" }); // returns list
    expect(addedBlog[0].likes).toBe(0);
  }, 100000);

  test("a blog without a title or url returns 400", async () => {
    const noTitleBlog = {
      author: "Barack Obama",
      url: "https://barackobama.com",
    };
    const noUrlBlog = {
      title: "My story",
      author: "Barack Obama",
    };
    await api
      .post("/api/blogs")
      .set({ Authorization: `Bearer ${token.token}` })
      .send(noTitleBlog)
      .expect(400);

    await api
      .post("/api/blogs")
      .set({ Authorization: `Bearer ${token.token}` })
      .send(noUrlBlog)
      .expect(400);
  }, 100000);

  test("a blog without a token", async () => {
    const noTitleBlog = {
      author: "Barack Obama",
      url: "https://barackobama.com",
      title: "My story",
    };
    await api.post("/api/blogs").send(noTitleBlog).expect(401);
  }, 100000);

  test("deleting a blog", async () => {
    const newBlog = {
      title: "Twitter shinanigans",
      author: "Elon Musk",
      url: "https://x.com",
    };

    await api
      .post("/api/blogs")
      .set({ Authorization: `Bearer ${token.token}` })
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const blogsAtStart = await helper.blogsInDb();

    const blogToDelete = await Blog.findOne({ title: "Twitter shinanigans" });

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set({ Authorization: `Bearer ${token.token}` })
      .expect(204);

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd.length).toBe(blogsAtStart.length - 1);

    const titles = blogsAtEnd.map((blog) => blog.title);
    expect(titles).not.toContain(blogToDelete.title);
  }, 100000);
});

describe("altering blogs", () => {
  test("updating likes in blog", async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToUpdate = blogsAtStart[0];
    await api.put(`/api/blogs/${blogToUpdate.id}`).expect(200);

    const updatedBlog = await Blog.findById(blogToUpdate.id);
    expect(updatedBlog.likes).toBe(blogToUpdate.likes + 1);
  }, 100000);
});

afterAll(async () => {
  await mongoose.connection.close();
}, 100000);

// adding: valid, no title/url, no likes assigned 0

//altering: deleting, updating likes

// const blogsAtStart = await helper.blogsInDb()
// const blogToDelete = blogsAtStart[0]
// await api
//   .delete(`/api/blogs/${blogToDelete.id}`) // how to generate tokens? : manually add a user to the notes and then generate the token!!
//   .expect(204)

// const blogsAtEnd = await helper.blogsInDb()
// expect(blogsAtEnd.length).toBe(helper.initialBlogs.length - 1)

// const titles = blogsAtEnd.map(blog => blog.title)
// expect(titles).not.toContain(blogToDelete.title)
