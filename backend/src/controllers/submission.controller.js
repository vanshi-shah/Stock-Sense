const { prisma } = require("../lib/prisma");
const { createSubmissionSchema, updateStatusSchema } = require("../schemas/submission.schema");
const { getIO } = require("../socket");

async function listSubmissions(req, res) {
  const isAdmin = req.user.role === "ADMIN";
  const submissions = await prisma.submission.findMany({
    where: isAdmin ? {} : { ownerId: req.user.id },
    orderBy: { createdAt: "desc" },
    include: { owner: { select: { name: true } } },
  });
  res.json(submissions);
}

async function createSubmission(req, res) {
  const data = createSubmissionSchema.parse(req.body);
  const submission = await prisma.submission.create({
    data: { ...data, ownerId: req.user.id },
  });
  getIO().emit("submission:created", submission);
  res.status(201).json(submission);
}

// Admin-only: moderate a submission (approve/reject)
async function updateSubmissionStatus(req, res) {
  const { status } = updateStatusSchema.parse(req.body);
  const submission = await prisma.submission.update({
    where: { id: req.params.id },
    data: { status },
  });
  getIO().emit("submission:updated", submission);
  res.json(submission);
}

module.exports = { listSubmissions, createSubmission, updateSubmissionStatus };
