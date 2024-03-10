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
  useMatch,
} from "react-router-dom"
import Bloglist from "./components/BlogList";
import UsersList from "./components/UsersList";
import User from "./components/User"
import userServices from './services/users'
import Blog from './components/Blog'
import styled from 'styled-components'

const Navigation = styled.div`
  background: Grey;
  padding: 0.5em;
`

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

  const userMatch = useMatch('/users/:id')
  const blogUser = userMatch 
    ? users.find(user => user.id == userMatch.params.id)
    : null

  const blogMatch = useMatch('/blogs/:id')
  const blog = blogMatch 
    ? blogs.find(blog => blog.id == blogMatch.params.id)
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
        <Navigation>
          <Link style={{padding: 5}} to="/">blogs</Link>
          <Link style={{padding: 5}}  to="/users">users</Link>
          {user.name} logged in <button onClick={handleLogout}>log out</button>
        </Navigation>
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
          <Route path="/blogs/:id" element={<Blog 
            key={blog?.id}
            title={blog?.title}
            url={blog?.url}
            author={blog?.author} 
            likes={blog?.likes}
            user={blog?.user?.name}
            usernameBlog={blog?.user?.username} // question mark because no creating user in test ENV
            usernameUser={user?.username}
            id={blog?.id}
            comments={blog?.comments}
            handleUpdate={handleUpdate}
            handleRemove={handleRemove}
          />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
