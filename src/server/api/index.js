const router = require('express').Router();

const { register, authJwt } = require('../midlewares');
const controller = require('../controllers/auth.controllers');
const { apiRoutes } = require('../../const/routes');

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

module.exports = router;
