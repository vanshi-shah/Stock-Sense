const { Router } = require("express");
const { register, login, resetPassword } = require("../controllers/auth.controller");

const router = Router();
router.post("/register", register);
router.post("/login", login);
router.post("/reset-password", resetPassword);

module.exports = router;
