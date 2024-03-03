import { useState, useEffect, useRef } from "react";
import Blog from "./components/Blog";
import BlogForm from "./components/BlogForm";
import LoginForm from "./components/LoginForm";
import Togglable from "./components/Togglable";
import blogService from "./services/blogs";
import loginService from "./services/login";
import { useSelector, useDispatch } from 'react-redux'
import { notify } from "./reducers/notificationsReducer";
import { createNewBlog, initializeBlogs } from "./reducers/blogsReducer";

const Notification = ({ notification }) => {
  if (notification.notification === '') {
    return null;
  }
  const notifStyle = { color: notification.color }

  return (
    <div style={notifStyle} className="notif">
      {notification.notification}
    </div>
  );
};

const App = () => {
  const blogs = useSelector(state => state.blogs);
  const [user, setUser] = useState(null);

  const notification = useSelector(state => state.notification)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(initializeBlogs())
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogappUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const blogFormRef = useRef();

  const handleLogin = async (username, password) => {
    try {
      const user = await loginService.login({
        username,
        password,
      });
      window.localStorage.setItem("loggedBlogappUser", JSON.stringify(user));
      setUser(user);
      blogService.setToken(user.token);
    } catch (exception) {
      dispatch(notify(
        exception.response.data.error,
        'error',
      ));
    }
  };

  const handleLogout = () => {
    window.localStorage.removeItem("loggedBlogappUser");
    setUser(null);
    blogService.setToken(null);
  };

  const handleCreate = async (blogObject) => {
    blogFormRef.current.toggleVisibility();
    try {
      dispatch(createNewBlog(blogObject))
      dispatch(notify(
        `a new blog "${blogObject.title}" by ${blogObject.author} added.`, 
        'success'
      ));
    } catch (exception) {
      console.log(exception)
      dispatch(notify(exception?.response?.data?.error, 'error'));
    }
  };

  const handleUpdate = async (id) => {
    try {
      const returnedBlog = await blogService.getOne(id);
      returnedBlog.likes++;
      await blogService.update(id, returnedBlog);

      const likedBlog = blogs.find((blog) => blog.id === id);
      likedBlog.likes++;
      const updatedBlogs = blogs.map((blog) =>
        blog.id === id ? likedBlog : blog,
      );
      const sortedBlogs = updatedBlogs.sort(
        (blog1, blog2) => blog2.likes - blog1.likes,
      );
      setBlogs(sortedBlogs);
      setBlogs(updatedBlogs);
    } catch (exception) {
      dispatch(notify(
        exception.response.data.error,
        'error',
      ));
    }
  };

  const handleRemove = async (id) => {
    try {
      await blogService.remove(id);
      const blogsAfterDelete = blogs.filter((blog) => blog.id !== id);
      setBlogs(blogsAfterDelete);
      dispatch(notify(
        'deleted a blog',
        'success'
      ));
    } catch (exception) {
      dispatch(notify(
        exception.response.data.error,
        'error'
      ));
    }
  };

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <Notification notification={notification}/>

        <LoginForm handleLogin={handleLogin} />
      </div>
    );
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification notification={notification}/>
      <div>
        <p>
          {user.name} logged in <button onClick={handleLogout}>log out</button>
        </p>
      </div>
      <div>
        <h2>create new</h2>
      </div>
      <Togglable buttonLabel="create blog" ref={blogFormRef}>
        <BlogForm handleCreate={handleCreate} user={user} />
      </Togglable>
      <div>
        {blogs.map((blog) => (
          <Blog
            key={blog.id}
            title={blog.title}
            url={blog.url}
            author={blog.author}
            likes={blog.likes}
            user={blog?.user?.name === undefined ? "" : blog.user.name}
            usernameBlog={blog?.user?.username} // question mark because no creating user in test ENV
            usernameUser={user?.username}
            id={blog.id}
            handleUpdate={handleUpdate}
            handleRemove={handleRemove}
          />
        ))}
      </div>
    </div>
  );
};

export default App;
