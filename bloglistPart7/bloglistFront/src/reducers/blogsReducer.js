import { createSlice } from '@reduxjs/toolkit'
import blogServices from '../services/blogs'

const blogSlice = createSlice({
  name: 'blogs',
  initialState: [],
  reducers: {
    setBlogs(state, action) {
      const sortedBlogs = action.payload.sort(
        (blog1, blog2) => blog2.likes - blog1.likes,
      );
      return sortedBlogs
    },
    appendBlog(state, action) {
      return state.concat(action.payload)
    },
    updateVotes(state, action) {
      const updatedBlogs = state.map(blog => 
        blog.id === action.payload.id 
        ? action.payload
        : blog)
      return updatedBlogs.sort(
        (blog1, blog2) => blog2.likes - blog1.likes,
      )
    },
    removeBlog(state, action) {
      return state.filter(blog => blog.id !== action.payload)
    }
  }
})

export const { setBlogs, appendBlog, updateVotes,removeBlog } = blogSlice.actions

export const initializeBlogs = () => {
  return async dispatch => {
    const blogs = await blogServices.getAll()
    dispatch(setBlogs(blogs))
  }
}

export const createNewBlog = (newBlog) => {
  return async dispatch => {
    try {
      const newBlogObject = await blogServices.create(newBlog)
      dispatch(appendBlog(newBlogObject))
    } catch(exception) {
      console.log(exception)
    }
  }
}

export const voteBlog = (blog) => {
  return async dispatch => {
    const votedBlog = await blogServices.update(blog.id)
    console.log(votedBlog)
    dispatch(updateVotes(votedBlog))
  }
}

export const deleteBlog = (id) => {
  return async dispatch => {
    const blogToDelete = await blogServices.remove(id)
      dispatch(removeBlog(id))
  }
}

export default blogSlice.reducer
