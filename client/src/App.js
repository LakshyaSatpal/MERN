import "./App.css";
import { Component } from "react";
import { Route } from "react-router-dom";

import Navbar from "./components/Layout/Navbar";
import Footer from "./components/Layout/Footer";
import Landing from "./components/Layout/Landing";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";

class App extends Component {
  render() {
    return (
      <div className="App">
        <Navbar />
        <Route path="/" exact component={Landing} />
        <div className="container">
          <Route path="/login" exact component={Login} />
          <Route path="/register" exact component={Register} />
        </div>
        <Footer />
      </div>
    );
  }
}

export default App;
