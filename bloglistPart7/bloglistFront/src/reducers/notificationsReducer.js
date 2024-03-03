import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  notification: '', 
  type: ''
}

const notificationSlice = createSlice({
  name: 'notification',
  initialState: initialState,
  reducers: {
    notifySuccess(state, action) {
      return {
        notification: action.payload,
        color: 'green'
      }
    },
    notifyError(state, action) {
      return {
        notification: action.payload,
        color: 'red'
      }
    },
    clear(state, action) {
      return initialState
    }
  }
})

export const { notifySuccess, notifyError, clear } = notificationSlice.actions

export const notify = (notification, type) => {
  return async dispatch => {
    console.log(type)
    if (type == 'success') {
      console.log(type)
      dispatch(notifySuccess(notification))
    }
    else {
      dispatch(notifyError(notification))
    }
    setTimeout(() => {
        dispatch(clear())
    }, 5000)
  }
}

export default notificationSlice.reducer