import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { configureStore } from '@reduxjs/toolkit'
import notificationReducer from "./reducers/notificationsReducer";
import { Provider } from "react-redux";
import blogsReducer from "./reducers/blogsReducer";
import userReducer from "./reducers/userReducer";
import { BrowserRouter as Router } from "react-router-dom"

const store = configureStore({reducer: { 
  notification: notificationReducer,
  blogs: blogsReducer,
  user: userReducer
}})

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <Router>
      <App />
    </Router>
  </Provider> 
);
