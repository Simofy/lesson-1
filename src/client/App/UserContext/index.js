const { createContext } = require('react');

const Context = createContext({
  updateUser: (user) => user,
  addHandler: (handler) => handler,
});

export default Context;
