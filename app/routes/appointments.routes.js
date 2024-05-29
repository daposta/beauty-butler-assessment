const { register, login, logout } = require("../controllers/auth.controllers");

const routes = require("express").Router();

routes.post("/login", login);

routes.post("/register", login);

routes.post("/logout", logout);

module.exports = routes;
