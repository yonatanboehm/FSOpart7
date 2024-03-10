import { createSlice } from '@reduxjs/toolkit'
import loginServices from '../services/login'
import blogServices from '../services/blogs'
import { notify } from './notificationsReducer'

const userSlice = createSlice({
  name: 'user',
  initialState: null,
  reducers: {
    saveUser(state, action) {
      const user = action.payload
      blogServices.setToken(user.token)
      window.localStorage.setItem("loggedBlogappUser", JSON.stringify(user));
      return user
    },
    loadUser(state, action) {
      const user = JSON.parse(action.payload)
      blogServices.setToken(user.token)
      return user
    },
    logout(state, action) {
      window.localStorage.removeItem("loggedBlogappUser");
      blogServices.setToken(null)
      return null
    }
  }
})

export const { saveUser, loadUser, logout } = userSlice.actions

export const login = (credentials) => {
  return async dispatch => {
    try {
      const user = await loginServices.login(credentials)
      dispatch(saveUser(user))
    } catch (exception) {
      dispatch(notify(
        exception.response.data.error,
        'error',
      ));
    }
  }
}

export default userSlice.reducer

