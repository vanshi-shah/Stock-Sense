/**
 * Submission controller — stubbed for StockSense.
 * Submissions are not part of the core inventory feature set;
 * this file exists as a placeholder from the original boilerplate.
 */

async function listSubmissions(_req, res) {
  res.json([]);
}

async function createSubmission(_req, res) {
  res.status(501).json({ error: "Not implemented" });
}

async function updateSubmissionStatus(_req, res) {
  res.status(501).json({ error: "Not implemented" });
}

module.exports = { listSubmissions, createSubmission, updateSubmissionStatus };
