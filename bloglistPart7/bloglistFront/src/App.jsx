import { useEffect, useRef, useState } from "react";
import BlogForm from "./components/BlogForm";
import LoginForm from "./components/LoginForm";
import Togglable from "./components/Togglable";
import blogService from "./services/blogs";
import { useSelector, useDispatch } from 'react-redux'
import { notify } from "./reducers/notificationsReducer";
import { createNewBlog, deleteBlog, initializeBlogs, voteBlog } from "./reducers/blogsReducer";
import { login, loadUser, logout } from "./reducers/userReducer";
import Notification from "./components/Notification";
import {
  Routes,
  Route,
  Link,
  Navigate,
  useMatch,
} from "react-router-dom"
import Bloglist from "./components/BlogList";
import UsersList from "./components/UsersList";
import User from "./components/User"
import userServices from './services/users'

const App = () => {
  const blogs = useSelector(state => state.blogs);
  const user = useSelector(state => state.user);
  const notification = useSelector(state => state.notification)
  const dispatch = useDispatch()

  const [users, setUsers] = useState([])

  useEffect(() => {
    const getUsers = async () => { 
      const usersList = await userServices.getAll()
      setUsers(usersList)
    }
    getUsers()
    dispatch(initializeBlogs())
    const loggedUserJSON = window.localStorage.getItem("loggedBlogappUser");
    if (loggedUserJSON) {
      dispatch(loadUser(loggedUserJSON))
    }
  }, []);

  const match = useMatch('/users/:id')
  const blogUser = match 
    ? users.find(user => user.id == match.params.id)
    : null

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
      dispatch(createNewBlog(blogObject))
    } catch (exception) {
      console.log(exception)
      dispatch(notify(exception?.response?.data?.error, 'error'));
    } finally {
      dispatch(notify(
        `a new blog "${blogObject.title}" by ${blogObject.author} added.`, 
        'success'
      ));
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
      <div> 
        <h2>blogs</h2>
        <Notification notification={notification}/>
        <div>
          <p>
            {user.name} logged in <button onClick={handleLogout}>log out</button>
          </p>
        </div>
        <Routes>
          <Route path="/" element={
            <div>
              <div>
                <h2>create new</h2>
              </div>
              <Togglable buttonLabel="create blog" ref={blogFormRef}>
                <BlogForm handleCreate={handleCreate} user={user} />
              </Togglable>
              <Bloglist
                blogs={blogs}
                handleRemove={handleRemove}
                handleUpdate={handleUpdate}
                user={user}
              />
            </div>
          } />
          <Route path="/users" element={<UsersList users={users}/>} />
          <Route path="/users/:id" element={<User 
            name={blogUser?.name}
            blogs={blogUser?.blogs} />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
