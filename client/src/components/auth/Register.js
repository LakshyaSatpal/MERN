import React, { Component } from "react";
import axios from "axios";

class Register extends Component {
  constructor() {
    super();
    this.state = {
      name: "",
      email: "",
      password: "",
      password2: "",
      errors: {},
    };
  }
  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });

    // The use of [] gives an excellent way to use actual value of variable as key/property while creating JavaScript objects.
  }
  async onSubmit(e) {
    e.preventDefault();
    const newUser = {
      name: this.state.name,
      email: this.state.email,
      password: this.state.password,
      password2: this.state.password2,
    };

    try {
      const result = await axios.post("/api/users/register", newUser);
      // result will be a promise
      // second parameter is body of request in POST
      console.log(result.data);
    } catch (err) {
      // catch block will execute depending on the status code coming from backend
      // error.response.data to get json error data from backend
      this.setState({ errors: err.response.data });
      console.log(err.response.data);
    }
  }
  render() {
    return (
      <div className="register">
        <div className="container">
          <div className="row">
            <div className="col-md-8 m-auto">
              <h1 className="display-4 text-center">Sign Up</h1>
              <p className="lead text-center">
                Create your DevConnector account
              </p>
              <form noValidate onSubmit={this.onSubmit.bind(this)}>
                <div className="form-group">
                  <input
                    type="text"
                    className={`form-control form-control-lg mt-3 ${
                      this.state.errors.name ? "is-invalid" : ""
                    }`}
                    placeholder="Name"
                    name="name"
                    value={this.state.name}
                    onChange={this.onChange.bind(this)}
                  />
                  {this.state.errors.name && (
                    <div className="invalid-feedback">
                      {this.state.errors.name}
                    </div>
                  )}
                </div>
                <div className="form-group">
                  <input
                    type="email"
                    className={`form-control form-control-lg mt-3 ${
                      this.state.errors.email ? "is-invalid" : ""
                    }`}
                    placeholder="Email Address"
                    name="email"
                    value={this.state.email}
                    onChange={this.onChange.bind(this)}
                  />
                  {this.state.errors.email && (
                    <div className="invalid-feedback">
                      {this.state.errors.email}
                    </div>
                  )}
                  <small className="form-text text-muted">
                    This site uses Gravatar so if you want a profile image, use
                    a Gravatar email
                  </small>
                </div>
                <div className="form-group">
                  <input
                    type="password"
                    className={`form-control form-control-lg mt-3 ${
                      this.state.errors.password ? "is-invalid" : ""
                    }`}
                    placeholder="Password"
                    name="password"
                    value={this.state.password}
                    onChange={this.onChange.bind(this)}
                  />
                  {this.state.errors.password && (
                    <div className="invalid-feedback">
                      {this.state.errors.password}
                    </div>
                  )}
                </div>
                <div className="form-group">
                  <input
                    type="password"
                    className={`form-control form-control-lg mt-3 ${
                      this.state.errors.password2 ? "is-invalid" : ""
                    }`}
                    placeholder="Confirm Password"
                    name="password2"
                    value={this.state.password2}
                    onChange={this.onChange.bind(this)}
                  />
                  {this.state.errors.password2 && (
                    <div className="invalid-feedback">
                      {this.state.errors.password2}
                    </div>
                  )}
                </div>
                <input type="submit" className="btn btn-info btn-block mt-4" />
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Register;
