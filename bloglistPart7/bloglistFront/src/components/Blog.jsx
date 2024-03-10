import { useState } from "react";

const Blog = (blog) => {
  if (!blog) {
    return null
  }
  
  const isUserUploader =
    blog.usernameBlog === blog.usernameUser
      ? { display: "" }
      : { display: "none" };

  const likeBlog = async () => {
    await blog.handleUpdate(blog.id);
  };

  const removeBlog = async () => {
    if (window.confirm(`Remove blog "${blog.title}" by ${blog.author}?`)) {
      await blog.handleRemove(blog.id);
    }
    return;
  };

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    marginBottom: 5,
  };

  return (
    <div className="blog">
      <h2>{blog.title}</h2>
      <div id="blog-expanded" style={blogStyle}>
        <div>
          <div><a href={blog.url}>{blog.url}</a></div>
          <div>
            {blog.likes} <button onClick={likeBlog}>like</button>
          </div>
          <div>added by {blog.user}</div>
          <div style={isUserUploader}>
            <button onClick={removeBlog}>remove</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blog;
