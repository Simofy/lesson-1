const router = require('express').Router();

const { register, authJwt } = require('../midlewares');
const controller = require('../controllers/auth.controllers');
const { apiRoutes } = require('../../const/routes');
const db = require('../db');

router.post(
  apiRoutes.register,
  [
    register.checkDuplicateUsernameOrEmail,
    register.checkRolesExisted
  ],
  controller.signup
);

router.post(apiRoutes.login, controller.login);

router.get(apiRoutes.verify, [authJwt.verifyToken], (req, res) => {
  res.status(200).send({});
});

router.get(apiRoutes.admin, [authJwt.verifyToken, authJwt.isAdmin], (req, res) => {
  res.status(200).send({});
});

router.post(apiRoutes.data, [authJwt.verifyToken], async (req, res) => {
  const { table } = db;
  const { start, end } = req.body;
  table.find({}, null, {
    limit: Number(end) - Number(start),
    skip: Number(start),
  }, (err, resTable) => {
    if (err) {
      res.status(404).send(err);
    } else {
      res.status(200).send(resTable);
    }
  });
});

router.post(apiRoutes.update, [authJwt.verifyToken], async (req, res) => {
  const { table } = db;
  const { id, ...rest } = req.body;
  console.log(req.body);
  table.updateOne({
    _id: id,
  }, {
    $set: rest,
  }, {
    runValidators: true,
  }, (err, raw) => {
    if (err) {
      res.status(404).send(err);
    } else {
      table.schema.emit('update', {
        _id: id,
        ...rest,
      });
      res.status(200).send({});
    }
  });
});

module.exports = router;
