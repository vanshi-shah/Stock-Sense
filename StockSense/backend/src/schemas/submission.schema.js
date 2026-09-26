const { z } = require("zod");

const createSubmissionSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(5),
});

const updateStatusSchema = z.object({
  status: z.enum(["PENDING", "APPROVED", "REJECTED"]),
});

module.exports = { createSubmissionSchema, updateStatusSchema };
