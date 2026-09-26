const { Router } = require("express");
const { register, login, resetPassword, me } = require("../controllers/auth.controller");
const { requireAuth } = require("../middleware/auth");

const router = Router();
router.post("/register", register);
router.post("/login", login);
router.post("/reset-password", resetPassword);
router.get("/me", requireAuth, me);

module.exports = router;
