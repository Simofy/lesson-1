import React, {
  useCallback, useEffect, useRef, useState, useMemo
} from 'react';
import {
  BrowserRouter, Redirect, Route, Switch
} from 'react-router-dom';
import { apiRoutes, routes } from '../../const/routes';
import { storage } from '../../const/storage';
import './main.scss';
import Landing from './routes/Landing';
import Login from './routes/Login';
import Register from './routes/Register';
import Extra from './components/Extra';
import Context from './UserContext';

export default function App() {
  const backgroundRef = useRef(null);
  const appRef = useRef(null);
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem(storage.user)),
  );
  const handleMouseMove = useCallback((event) => {
    if (backgroundRef.current) {
      const { pageX, pageY } = event;
      const { innerWidth, innerHeight } = window;
      const halfW = innerWidth / 2;
      const halfH = innerHeight / 2;
      const rationX = ((pageX - halfW) / halfW) * 0.1;
      const rationY = ((pageY - halfH) / halfH) * 0.1;
      backgroundRef
        .current
        .style
        .transform = `
          scale(1.5)
          perspective(300px)
          rotate3d(0, 1, 0, ${Math.asin(rationX)}rad)
          rotate3d(1, 0, 0, ${Math.asin(-rationY)}rad)
        `;
    }
  }, [backgroundRef.current]);

  useEffect(() => {
    if (appRef.current) {
      appRef.current
        .addEventListener('mousemove',
          handleMouseMove);
      return () => {
        appRef.current
          .removeEventListener('mousemove',
            handleMouseMove);
      };
    }
    return () => { };
  }, [appRef.current]);

  const handleTokenValidation = useCallback(({ status }) => {
    if (status !== 200) {
      localStorage.removeItem(storage.user);
      setUser(null);
    }
  }, []);

  const validate = useCallback((token) => {
    const headers = new Headers({
      'x-access-token': token,
    });
    fetch(`/api${apiRoutes.verify}`, {
      method: 'GET',
      headers,
    })
      .then(handleTokenValidation);
  }, []);

  useEffect(() => {
    if (user) {
      validate(user.accessToken);
    }
  }, []);

  const generateRandom = useMemo(() => {
    if (user) {
      return `${user.username} using memo`;
    }
  }, []);

  return (
    <Context.Provider value={{
      updateUser: setUser,
      displayName: generateRandom,
    }}
    >
      <div ref={appRef} className="app">
        <div ref={backgroundRef} className="background" />
        <div className="body">
          <BrowserRouter>
            <Switch>
              <Route exact path={routes.landing}>
                <Landing user={user} />
              </Route>
              {(user) ? <Redirect to={routes.landing} /> : (
                <>
                  <Route
                    exact
                    path={routes.login}
                    component={Login}
                  />
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
        <Extra name={{
          name: 'test'
        }}
        >
          <div>
            123541234
          </div>
        </Extra>
      </div>
    </Context.Provider>
  );
}
