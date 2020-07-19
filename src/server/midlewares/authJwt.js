const jwt = require('jsonwebtoken');
const config = require('../config/auth.config.js');
const db = require('../db');

const User = db.user;
const Role = db.role;

const verifyToken = (req, res, next) => {
  const token = req.headers['x-access-token'];
  if (!token) {
    return res.status(403).send({ message: 'No token provided!' });
  }

  return jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: 'Unauthorized!' });
    }
    req.userId = decoded.id;
    return next();
  });
};

const isAdmin = (req, res, next) => {
  User.findById(req.userId).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    Role.find(
      {
        _id: { $in: user.roles }
      },
      (errRole, roles) => {
        if (errRole) {
          res.status(500).send({ message: errRole });
          return;
        }

        for (let i = 0; i < roles.length; i += 1) {
          if (roles[i].name === 'admin') {
            next();
            return;
          }
        }

        res.status(403).send({ message: 'Require Admin Role!' });
      }
    );
  });
};

const isModerator = (req, res, next) => {
  User.findById(req.userId).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    Role.find(
      {
        _id: { $in: user.roles }
      },
      (errRole, roles) => {
        if (errRole) {
          res.status(500).send({ message: errRole });
          return;
        }

        for (let i = 0; i < roles.length; i += 1) {
          if (roles[i].name === 'moderator') {
            next();
            return;
          }
        }

        res.status(403).send({ message: 'Require Moderator Role!' });
      }
    );
  });
};

const authJwt = {
  verifyToken,
  isAdmin,
  isModerator
};
module.exports = authJwt;
