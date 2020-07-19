import React from 'react';
import {
  BrowserRouter, Redirect, Route, Switch
} from 'react-router-dom';
import { apiRoutes, routes } from '../../const/routes';
import { storage } from '../../const/storage';
import './main.scss';
import Landing from './routes/Landing';
import Login from './routes/Login';
import Register from './routes/Register';

export default class Routes extends React.Component {
  constructor(props) {
    super(props);
    this.backgroundRef = React.createRef();
    this.appRef = React.createRef();
    this.updateUser = this.updateUser.bind(this);
    this.handleTokenValidation = this.handleTokenValidation.bind(this);
    this.state = {
      user: JSON.parse(localStorage.getItem(storage.user)),
    };
    if (this.state.user) {
      this.validate(this.state.user.accessToken);
    }
  }

  componentDidMount() {
    if (this.appRef.current) {
      this.appRef.current
        .addEventListener('mousemove',
          this.handleMouseMove.bind(this));
    }
  }

  validate(token) {
    const headers = new Headers({
      'x-access-token': token,
    });
    fetch(`/api${apiRoutes.verify}`, {
      method: 'GET',
      headers,
    })
      .then(this.handleTokenValidation);
  }

  handleTokenValidation({ status }) {
    if (status !== 200) {
      localStorage.removeItem(storage.user);
      this.setState({
        user: null,
      });
    }
  }

  updateUser(user) {
    this.setState({
      user,
    });
  }

  handleMouseMove(event) {
    if (this.backgroundRef.current) {
      const { pageX, pageY } = event;
      const { innerWidth, innerHeight } = window;
      const halfW = innerWidth / 2;
      const halfH = innerHeight / 2;
      const rationX = ((pageX - halfW) / halfW) * 0.1;
      const rationY = ((pageY - halfH) / halfH) * 0.1;
      this.backgroundRef
        .current
        .style
        .transform = `
          scale(1.5)
          perspective(300px)
          rotate3d(0, 1, 0, ${Math.asin(rationX)}rad)
          rotate3d(1, 0, 0, ${Math.asin(-rationY)}rad)
        `;
    }
  }

  render() {
    const { user } = this.state;
    return (
      <div ref={this.appRef} className="app">
        <div ref={this.backgroundRef} className="background" />
        <div className="body">
          <BrowserRouter>
            <Switch>
              <Route exact path={routes.landing}>
                <Landing user={user} updateUser={this.updateUser} />
              </Route>
              {(user) ? <Redirect to={routes.landing} /> : (
                <>
                  <Route
                    exact
                    path={routes.login}
                  >
                    <Login updateUser={this.updateUser} />
                  </Route>
                  <Route
                    exact
                    path={routes.register}
                    component={Register}
                  />
                </>
              )}
            </Switch>
          </BrowserRouter>
        </div>
      </div>
    );
  }
}
