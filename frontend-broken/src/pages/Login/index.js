import React from "react";
import Joi from "joi";
import _ from "lodash";
import Input from "../../components/common/Input";
import { connect } from "react-redux";
import { signIn } from "../../actions/authAction";
import Button from "../../components/common/Button";
import { Navigate } from "react-router-dom";
import "./style.css";

class Login extends React.Component {
  state = {
    data: {
      email: "",
      password: "",
    },
    errors: {},
  };

  schema = Joi.object({
    email: Joi.string().email({ tlds: { allow: false } }).required().label("Email"),
    password: Joi.string().required().label("Password"),
  });

  handleChange = ({ currentTarget: input }) => {
    const errors = { ...this.state.errors };
    const errorMessage = this.validateProperty(input);

    if (errorMessage) errors[input.name] = errorMessage;
    else delete errors[input.name];

    const data = { ...this.state.data };
    data[input.name] = input.value;
    this.setState({ data, errors });
  };

  validateProperty = (input) => {
    const obj = { [input.name]: input.value };
    const schema = Joi.object({ [input.name]: this.schema.extract(input.name) });
    const { error } = schema.validate(obj);
    return error ? error.details[0].message : null;
  };

  validate = () => {
    const options = { abortEarly: false };
    const { error } = this.schema.validate(this.state.data, options);
    if (!error) return null;

    const errors = {};
    error.details.forEach((detail) => {
      errors[detail.path[0]] = detail.message;
    });
    return errors;
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const errors = this.validate();
    if (_.isEmpty(errors)) this.props.signIn(this.state.data);
    else this.setState({ errors });
  };

  render() {
    const { data, errors } = this.state;
    const { email, password } = data;
    const { authMessage, loggedIn } = this.props;

    if (loggedIn) return <Navigate to="/" replace />;

    return (
      <div className="background-container pt-5">
        <div className="container">
          <h1 className="header">Login</h1>
          <form onSubmit={this.handleSubmit}>
            <Input
              name="email"
              label="Email"
              type="email"
              error={errors.email}
              iconClass="fas fa-envelope"
              onChange={this.handleChange}
              placeholder="Please enter your email..."
              value={email}
              autoFocus
            />
            <Input
              name="password"
              type="password"
              label="Password"
              error={errors.password}
              iconClass="fas fa-key"
              onChange={this.handleChange}
              placeholder="Please enter your password..."
              value={password}
            />
            {authMessage && <p className="text-white">{authMessage}</p>}
            <Button disabled={!!this.validate()} type="submit" label="Login" />
          </form>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  loggedIn: state.auth.loggedIn,
  authMessage: state.auth.authMessage,
});

const mapDispatchToProps = (dispatch) => ({
  signIn: (creds) => dispatch(signIn(creds)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);
