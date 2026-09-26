const { Router } = require("express");
const { requireAuth, requireStaff, requireManager } = require("../middleware/auth");
const {
  listSubmissions,
  createSubmission,
  updateSubmissionStatus,
} = require("../controllers/submission.controller");

const router = Router();
router.use(requireAuth);
router.get("/", requireStaff, listSubmissions);
router.post("/", requireStaff, createSubmission);
router.patch("/:id/status", requireManager, updateSubmissionStatus);

module.exports = router;
