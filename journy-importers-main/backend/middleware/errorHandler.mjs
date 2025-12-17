import ErrorResponse from "../models/ErrorResponse.mjs";

export const errorHandler = (err, req, res, next) => {
  let error = { ...err };

  error.message;

  // Handle CosmosDB "Request rate too large" (429)
  if(err.code === 429) {
    const message = "Too many requests. Please try again later.";
    error = new ErrorResponse(message, 429);
  }
  // Handle CosmosDB conflict (HTTP 409) when resource already exists or there's a version conflict
  if (err.code === 409) {
    const message = `The resource already exists or there is a conflict`;
    error = new ErrorResponse(message, 409);
  }  

  // HandlenNot found Error (404)
  if(err.code === 404) {
    const message = `The requested resource with the id: ${err.value} could not be found.`;
    error = new ErrorResponse(message, 404);
  }

  // Handle Validation Error (e.g., malformed query)
  if (err.code === 400) {
    const message = `Bad Request: ${err.message}`;
    error = new ErrorResponse(message, 400);
  }
  
  // Send the error response back to the client
  res.status(error.statusCode || 500).json({
    success: false,
    statusCode: error.statusCode || 500,
    error: error.message || "Server Error"
  });
}