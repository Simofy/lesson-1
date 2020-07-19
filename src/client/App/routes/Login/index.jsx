/* eslint-disable no-alert */
import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom';
import { apiRoutes, routes } from '../../../../const/routes';
import { storage } from '../../../../const/storage';

export const inputNames = {
  password: 'password',
  name: 'name',
};

export default class Login extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleResponse = this.handleResponse.bind(this);
  }

  handleResponse({ message, ...user }) {
    if (!message) {
      const { updateUser } = this.props;
      localStorage.setItem(storage.user, JSON.stringify(user));
      if (updateUser) {
        updateUser(user);
      }
    } else {
      alert(message);
    }
  }

  handleSubmit(event) {
    event.preventDefault();
    const {
      target: {
        [inputNames.password]: { value: password },
        [inputNames.name]: { value: username },
      },
    } = event;

    if (password && username) {
      fetch(`/api${apiRoutes.login}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          password,
          username,
        }),
      }).then(
        (response) => response.json()
      ).then(this.handleResponse);
    } else {
      alert('Please fill all the fields');
    }
  }

  render() {
    return (
      <div className="login">
        <Link to={routes.landing}>Back</Link>
        <form onSubmit={this.handleSubmit}>
          <label>
            Username:
            <input required name={inputNames.name} type="username" />
          </label>
          <label>
            Password:
            <input required name={inputNames.password} type="password" />
          </label>
          <button type="submit">Login</button>
        </form>
      </div>
    );
  }
}

Login.propTypes = {
  updateUser: PropTypes.func.isRequired,
};
