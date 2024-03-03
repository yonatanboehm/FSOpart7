import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { configureStore } from '@reduxjs/toolkit'
import notificationReducer from "./reducers/notificationsReducer";
import { Provider } from "react-redux";
import blogsReducer from "./reducers/blogsReducer";

const store = configureStore({reducer: { 
  notification: notificationReducer,
  blogs: blogsReducer 
}})

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <App />
  </Provider> 
);
