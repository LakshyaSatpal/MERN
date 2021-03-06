import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { registerUser } from "../../actions/authActions";
import { withRouter } from "react-router-dom";

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
  componentDidMount() {
    if (this.props.auth.isAuthenticated) {
      this.props.history.push("/dashboard");
    }
  }
  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });

    // The use of [] gives an excellent way to use actual value of variable as key/property while creating JavaScript objects.
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({
        errors: nextProps.errors,
      });
    }
  }
  async onSubmit(e) {
    e.preventDefault();
    const newUser = {
      name: this.state.name,
      email: this.state.email,
      password: this.state.password,
      password2: this.state.password2,
    };

    this.props.registerUser(newUser, this.props.history);
  }
  render() {
    const { errors } = this.state;
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
                      errors.name ? "is-invalid" : ""
                    }`}
                    placeholder="Name"
                    name="name"
                    value={this.state.name}
                    onChange={this.onChange.bind(this)}
                  />
                  {errors.name && (
                    <div className="invalid-feedback">{errors.name}</div>
                  )}
                </div>
                <div className="form-group">
                  <input
                    type="email"
                    className={`form-control form-control-lg mt-3 ${
                      errors.email ? "is-invalid" : ""
                    }`}
                    placeholder="Email Address"
                    name="email"
                    value={this.state.email}
                    onChange={this.onChange.bind(this)}
                  />
                  {errors.email && (
                    <div className="invalid-feedback">{errors.email}</div>
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
                      errors.password ? "is-invalid" : ""
                    }`}
                    placeholder="Password"
                    name="password"
                    value={this.state.password}
                    onChange={this.onChange.bind(this)}
                  />
                  {errors.password && (
                    <div className="invalid-feedback">{errors.password}</div>
                  )}
                </div>
                <div className="form-group">
                  <input
                    type="password"
                    className={`form-control form-control-lg mt-3 ${
                      errors.password2 ? "is-invalid" : ""
                    }`}
                    placeholder="Confirm Password"
                    name="password2"
                    value={this.state.password2}
                    onChange={this.onChange.bind(this)}
                  />
                  {errors.password2 && (
                    <div className="invalid-feedback">{errors.password2}</div>
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

Register.propTypes = {
  registerUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  errors: state.errors,
}); // to take redux state into props

// function mapStateToProps (state) {
//   return {
//     auth: state.auth,
//   }
// }
export default connect(mapStateToProps, { registerUser })(withRouter(Register)); // subscribe this component to store state
