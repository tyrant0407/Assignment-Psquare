export function validate(schema) {
  return (req, res, next) => {
    const data = { body: req.body, query: req.query, params: req.params };
    const { error, value } = schema.validate(data, {
      abortEarly: false,
      allowUnknown: true,
    });
    if (error) {
      return res
        .status(400)
        .json({
          success: false,
          message: error.details.map((d) => d.message).join(", "),
        });
    }
    req.body = value.body || req.body;
    req.query = value.query || req.query;
    req.params = value.params || req.params;
    next();
  };
}
