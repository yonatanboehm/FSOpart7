import { useState } from "react";
import blogServices from '../services/blogs'

const Blog = (blog) => {
  const [comments, setComments] = useState(blog.comments)

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

  const handleComment = async (event) => {
    try {  
      event.preventDefault();
      const comment = event.target[0].value
      await blogServices.addComment(blog.id, { comment })
      setComments(comments.concat(comment))
      event.target[0].value = ''
    } catch(exception) {
      console.log(exception)
    }
  }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    marginBottom: 5,
  };

  return (
    <div className="blog">
      <h2>{blog.title}</h2>
      <div id="blog-expanded" style={blogStyle}>
        <div><a href={blog.url}>{blog.url}</a></div>
        <div>
          {blog.likes} <button onClick={likeBlog}>like</button>
        </div>
        <div>added by {blog.user}</div>
        <div style={isUserUploader}>
          <button onClick={removeBlog}>remove</button>
        </div>
        <div>
          <h4>comments</h4>
          <form onSubmit={handleComment}>
            <input type="text" name="comment"/><button type="submit">add comment</button>
          </form>
          <ul>
          {comments?.map((comment, index) => {
            return (
              <li key={index}>{comment}</li>
            )
          })}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Blog;
