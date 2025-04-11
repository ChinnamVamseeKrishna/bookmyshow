import "./App.css";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/home";
import Login from "./pages/login";
import Register from "./pages/register";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./redux/store";
import Admin from "./pages/Admin";
import Partner from "./pages/Partner";
import Profile from "./pages/Profile";

function App() {
  return (
    <div>
      <Provider store={store}>
        <Router>
          <Routes>
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <Admin />{" "}
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/partner"
              element={
                <ProtectedRoute>
                  <Partner />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Router>
      </Provider>
    </div>
  );
}

export default App;
