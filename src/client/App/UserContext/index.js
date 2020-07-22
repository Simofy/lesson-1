const { createContext } = require('react');

const Context = createContext({
  updateUser: (user) => user,
});

export default Context;
