module.exports = (fn) => {
  if (fn.constructor.name !== "AsyncFunction") {
    throw new Error(
      "catchAsync only works with async functions. You forgot 'async' MF?"
    );
  }

  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};
