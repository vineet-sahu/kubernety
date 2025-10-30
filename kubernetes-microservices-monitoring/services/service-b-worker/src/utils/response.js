function successResponse(res, data, statusCode = 200) {
  return res.status(statusCode).json({
    success: true,
    data
  });
}

function errorResponse(res, message, statusCode = 500, details = null) {
  const response = {
    success: false,
    error: {
      message
    }
  };

  if (details) {
    response.error.details = details;
  }

  return res.status(statusCode).json(response);
}

module.exports = {
  successResponse,
  errorResponse
};
