# Lesson 1

Full stack react app. Showcasing basic navigation with validation.

- [Lesson 1](#lesson-1)
  - [Stack](#stack)
    - [Development mode](#development-mode)
  - [Quick Start](#quick-start)

## Stack

This is a simple full stack [React](https://reactjs.org/) application with a [Node.js](https://nodejs.org/en/) and [Express](https://expressjs.com/) backend. Client side code is written in React and the backend API is written using Express. 

### Development mode

In the development mode, we will have 3 servers running. The front end code will be served by the [webpack dev server](https://webpack.js.org/configuration/dev-server/) which helps with hot and live reloading. The server side Express code will be served by a node server using [nodemon](https://nodemon.io/) which helps in automatically restarting the server whenever server side code changes. The database will be served as ```mongod``` instance.

## Quick Start

```bash
# Clone the repository
git clone https://github.com/simofy/lesson-1

# Go inside the directory
cd lesson-1

# Install dependencies
npm install

# Start development server
npm run dev
```

