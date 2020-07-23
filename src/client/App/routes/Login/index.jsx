/* eslint-disable no-alert */
import React, { useCallback, useContext, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { apiRoutes, routes } from '../../../../const/routes';
import { storage } from '../../../../const/storage';
import Context from '../../UserContext';

export const inputNames = {
  password: 'password',
  name: 'name',
};

export default function Login() {
  const { updateUser } = useContext(Context);
  const handleResponse = useCallback(({ message, ...user }) => {
    if (!message) {
      localStorage.setItem(storage.user, JSON.stringify(user));
      localStorage.setItem(storage.token, JSON.stringify(user.accessToken));
      if (updateUser) {
        updateUser(user);
      }
    } else {
      alert(message);
    }
  }, [updateUser]);

  const handleSubmit = useCallback((event) => {
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
      ).then(handleResponse);
    } else {
      alert('Please fill all the fields');
    }
  }, []);

  return (
    <div className="login">
      <Link to={routes.landing}>Back</Link>
      <form onSubmit={handleSubmit}>
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
