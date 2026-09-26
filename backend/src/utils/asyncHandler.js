/**
 * Wraps an async Express route handler and forwards any thrown errors
 * to Express's next(err) — eliminates boilerplate try/catch in every controller.
 *
 * @param {Function} fn - async (req, res, next) => {}
 */
function asyncHandler(fn) {
  return function (req, res, next) {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

module.exports = { asyncHandler };
