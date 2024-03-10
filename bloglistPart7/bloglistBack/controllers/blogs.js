const blogsRouter = require("express").Router();
const middleware = require("../utils/middleware");
const Blog = require("../models/blog");
const jwt = require("jsonwebtoken");

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user");
  response.json(blogs);
});

blogsRouter.get("/:id", async (request, response) => {
  const blog = await Blog.findById(request.params.id);
  response.json(blog);
});

blogsRouter.post("/", middleware.userExtractor, async (request, response) => {
  const body = request.body;
  const decodedToken = jwt.verify(request.token, process.env.SECRET);
  if (!decodedToken.id) {
    return response.status(401).json({ error: "token invalid" });
  }
  const user = request.user;

  const blog = new Blog({
    url: body?.url,
    title: body?.title,
    author: body?.author,
    user: user?.id,
    likes: body?.likes,
  });

  if (!blog.likes) {
    blog.likes = 0;
  }
  if (blog.url && blog.title) {
    const result = await blog.save();
    user.blogs = user.blogs.concat(result._id);
    await user.save();
    const resultBlog = await Blog.findById(result._id).populate("user") // get blog with user
    response.status(201).json(resultBlog); 
  } else {
    response.status(400).end();
  }
});

blogsRouter.delete(
  "/:id",
  middleware.userExtractor,
  async (request, response) => {
    const decodedToken = jwt.verify(request.token, process.env.SECRET);
    if (!decodedToken.id) {
      return response.status(401).json({ error: "token invalid" });
    }
    const userid = request.user._id;

    const blog = await Blog.findById(request.params.id);
    if (userid.toString() === blog.user.toString()) {
      await Blog.findByIdAndDelete(request.params.id);
      response.status(204).end();
    } else {
      response.status(401).json({ error: "unauthorized to delete" });
    }
  },
);

blogsRouter.put("/:id", async (request, response) => {
  // add 1 like
  console.log('-----------------')
  const user = request.user
  const blog = await Blog.findById(request.params.id);
  blog.likes++;
  const result = await Blog.findByIdAndUpdate(
    request.params.id,
    blog.toJSON(),
    { new: true },
  ).populate("user");

  response.json(result);
});

module.exports = blogsRouter;
