import React, { Component } from "react";
import {
  Route,
  BrowserRouter as Router,
  Routes,
  Navigate,
} from "react-router-dom";

import Movies from "./pages/Movies";
import AddMovieForm from "./pages/AddMovie";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Login from "./pages/Login";
import Register from "./pages/Register";

import "./App.css";

import { Provider } from "react-redux";
import store from "./store";

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <div className="App">
            <Navbar />
            <Routes>
              <Route path="/movies/new" element={<AddMovieForm />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/movies" element={<Movies />} />
              <Route path="/" element={<Navigate to="/movies" replace />} />
            </Routes>
            <Footer />
          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;
