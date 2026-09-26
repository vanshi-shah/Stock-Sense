const { Router } = require("express");
const { requireAuth, requireRole } = require("../middleware/auth");
const {
  listSubmissions,
  createSubmission,
  updateSubmissionStatus,
} = require("../controllers/submission.controller");

const router = Router();
router.use(requireAuth);
router.get("/", listSubmissions);
router.post("/", createSubmission);
router.patch("/:id/status", requireRole("ADMIN"), updateSubmissionStatus);

module.exports = router;
