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
    }
  }
})

export const { setBlogs, appendBlog } = blogSlice.actions

export const initializeBlogs = () => {
  return async dispatch => {
    const blogs = await blogServices.getAll()
      dispatch(setBlogs(blogs))
  }
}

export const createNewBlog = (newBlog) => {
  return async dispatch => {
    const newBlogObject = await blogServices.create(newBlog)
      dispatch(appendBlog(newBlogObject))
  }
}

export default blogSlice.reducer
