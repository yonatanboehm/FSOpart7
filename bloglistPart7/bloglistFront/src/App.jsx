import { useState, useEffect, useRef } from "react";
import Blog from "./components/Blog";
import BlogForm from "./components/BlogForm";
import LoginForm from "./components/LoginForm";
import Togglable from "./components/Togglable";
import blogService from "./services/blogs";
import { useSelector, useDispatch } from 'react-redux'
import { notify } from "./reducers/notificationsReducer";
import { createNewBlog, deleteBlog, initializeBlogs, voteBlog } from "./reducers/blogsReducer";
import { login, loadUser, logout } from "./reducers/userReducer";

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
  const user = useSelector(state => state.user);

  const notification = useSelector(state => state.notification)
  const dispatch = useDispatch()

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogappUser");
    if (loggedUserJSON) {
      dispatch(loadUser(loggedUserJSON))
    }
  }, []);

  useEffect(() => {
    dispatch(initializeBlogs())
  }, []);

  const blogFormRef = useRef();

  const handleLogin = async (username, password) => {
    try {
      dispatch(login({
        username,
        password,
      }));
    } catch (exception) {
      console.log('sdfsdfs')
      dispatch(notify(
        exception.response.data.error,
        'error',
      ));
    }
  };

  const handleLogout = () => {
    dispatch(logout())
  };

  const handleCreate = async (blogObject) => {
    blogFormRef.current.toggleVisibility();
    try {
      dispatch(createNewBlog(blogObject, user))
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
      dispatch(voteBlog(returnedBlog))
    } catch (exception) {
      dispatch(notify(
        exception.response.data.error,
        'error',
      ));
    }
  };

  const handleRemove = async (id) => {
    try {
      dispatch(deleteBlog(id))
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
