/* eslint-disable no-alert */
import React from 'react';
import { Redirect } from 'react-router';
import { Link } from 'react-router-dom';
import { apiRoutes, routes } from '../../../../const/routes';

export const inputNames = {
  repeatPassword: 'repeat-password',
  password: 'password',
  email: 'email',
  name: 'name',
};

export default class Register extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleResponse = this.handleResponse.bind(this);

    this.state = {
      redirect: false,
    };
  }

  handleResponse({ message }) {
    if (!message) {
      this.setState({
        redirect: true,
      });
    } else {
      alert(message);
    }
  }

  handleSubmit(event) {
    event.preventDefault();
    this.setState({

    });
    const {
      target: {
        [inputNames.repeatPassword]: { value: repeatPassword },
        [inputNames.password]: { value: password },
        [inputNames.email]: { value: email },
        [inputNames.name]: { value: username },
      },
    } = event;
    if (repeatPassword && password && email && username) {
      if (password === repeatPassword) {
        fetch(`/api${apiRoutes.register}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            password,
            email,
            username,
          }),
        }).then((response) => response.json()).then(this.handleResponse);
      } else {
        alert('Password doesn\'t match');
      }
    } else {
      alert('Please fill all the fields');
    }
  }

  render() {
    const { redirect } = this.state;
    if (redirect) return <Redirect to={routes.login} />;

    return (
      <div className="register">
        <Link to={routes.landing}>Back</Link>
        <form onSubmit={this.handleSubmit}>
          <label>
            Username:
            <input required name={inputNames.name} type="username" />
          </label>
          <label>
            Email:
            <input required name={inputNames.email} type="email" />
          </label>
          <label>
            Password:
            <input required name={inputNames.password} type="password" />
          </label>
          <label>
            Repeat:
            <input required name={inputNames.repeatPassword} type="password" />
          </label>
          <button type="submit">Register</button>
        </form>
      </div>
    );
  }
}
