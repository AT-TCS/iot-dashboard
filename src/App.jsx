import { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import { UserContext } from "./context/user.context";

import Home from "./Pages/Home";
import Navigation from "./components/navigation/navigation.component";
import Authentication from "./Pages/Authentication";

import "./App.css";

const App = () => {
  const { currentUser } = useContext(UserContext);
  return (
    <Routes>
      <Route path="/" element={<Navigation />}>
        <Route
          path="/home"
          element={currentUser ? <Home /> : <Authentication />}
        />
        <Route
          path="auth"
          element={
            currentUser ? <Navigate to="/home" replace /> : <Authentication />
          }
        />
      </Route>
    </Routes>
  );
};

export default App;
