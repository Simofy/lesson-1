/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const config = require('../config/auth.config');
const db = require('../db');

const User = db.user;
const Role = db.role;

exports.signup = (req, res) => {
  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8)
  });

  newUser.save((errNewUser, user) => {
    if (errNewUser) {
      res.status(500).send({ message: errNewUser });
      return;
    }

    if (req.body.roles) {
      Role.find(
        {
          name: { $in: req.body.roles }
        },
        (errRole, roles) => {
          if (errRole) {
            res.status(500).send({ message: errRole });
            return;
          }

          user.roles = roles.map((role) => role._id);
          user.save((errUser) => {
            if (errUser) {
              res.status(500).send({ message: errUser });
              return;
            }

            res.send({ message: 'User was registered successfully!' });
          });
        }
      );
    } else {
      Role.findOne({ name: 'user' }, (errRole, role) => {
        if (errRole) {
          res.status(500).send({ message: errRole });
          return;
        }

        user.roles = [role._id];
        user.save((errUser) => {
          if (errUser) {
            res.status(500).send({ message: errUser });
            return;
          }

          res.send({ message: 'User was registered successfully!' });
        });
      });
    }
  });
};

exports.login = async (req, res) => {
  User.findOne({
    username: req.body.username
  })
    .populate('roles', '-__v')
    .exec((err, user) => {
      if (err) {
        return res.status(500).send({ message: err });
      }

      if (!user) {
        return res.status(404).send({ message: 'User Not found.' });
      }

      const passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: 'Invalid Password!'
        });
      }

      const token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: 86400 // 24 hours
      });

      const authorities = [];

      for (let i = 0; i < user.roles.length; i += 1) {
        authorities.push(`ROLE_${user.roles[i].name.toUpperCase()}`);
      }
      return res.status(200).send({
        id: user._id,
        username: user.username,
        email: user.email,
        roles: authorities,
        accessToken: token
      });
    });
};
