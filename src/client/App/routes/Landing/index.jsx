import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom';
import { routes } from '../../../../const/routes';
import { storage } from '../../../../const/storage';

export default class Landing extends React.Component {
  constructor(props) {
    super(props);
    this.logout = this.logout.bind(this);
  }

  logout(event) {
    const { updateUser } = this.props;
    event.preventDefault();
    localStorage.removeItem(storage.user);
    updateUser(null);
  }

  renderUser({ username, email }) {
    return (
      <>
        <h2>{username}</h2>
        <h2>{email}</h2>
      </>
    );
  }

  render() {
    const { user } = this.props;
    return (
      <div className="landing-container">
        {user
          ? (
            <>
              {this.renderUser(user)}
              <Link to={routes.login} onClick={this.logout}>
                Logout
              </Link>
            </>
          )
          : (
            <>
              <Link to={routes.login}>
                Login
              </Link>
              <Link to={routes.register}>
                Register
              </Link>
            </>
          )}
      </div>
    );
  }
}

Landing.propTypes = {
  user: PropTypes.object,
  updateUser: PropTypes.func.isRequired,
};

Landing.defaultProps = {
  user: null,
};
