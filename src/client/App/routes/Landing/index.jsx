import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom';
import { routes } from '../../../../const/routes';
import { storage } from '../../../../const/storage';
import Context from '../../UserContext';

export default class Landing extends React.Component {
  constructor(props) {
    super(props);
    this.logout = this.logout.bind(this);
  }

  logout(event, updateUser) {
    event.preventDefault();
    localStorage.removeItem(storage.user);
    updateUser(null);
  }

  renderUser({ username, email }, realName) {
    return (
      <>
        <h1>{realName}</h1>
        <h2>{username}</h2>
        <h2>{email}</h2>
      </>
    );
  }

  render() {
    const { user } = this.props;
    return (
      <Context.Consumer>
        {({ updateUser, displayName }) => (
          <div className="landing-container">
            {user
              ? (
                <>
                  {this.renderUser(user, displayName)}
                  <Link to={routes.login} onClick={(event) => this.logout(event, updateUser)}>
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
        )}
      </Context.Consumer>
    );
  }
}

Landing.propTypes = {
  user: PropTypes.object,
};

Landing.defaultProps = {
  user: null,
};
