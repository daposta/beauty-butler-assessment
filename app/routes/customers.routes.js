const { register, login, logout } = require("../controllers/auth.controllers");

const routes = require("express").Router();

routes.get("/available-merchants", login);

routes.post("/appointment", login);

routes.post("/logout", logout);

module.exports = routes;
