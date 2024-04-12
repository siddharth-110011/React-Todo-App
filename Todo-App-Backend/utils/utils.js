function sendErrorResponse(error) {
  if (error.internalError) {
    console.log(`\n${"-".repeat(20)} Internal error details ${"-".repeat(20)}`);
    console.log(error.internalError.stack);
  }

  let errorResponse = {
    error: {
      statusCode: error.userFacingError.statusCode,
      message: error.userFacingError.message,
    },
  };

  console.log(`\n${"-".repeat(50)}`);
  console.log("Sending user facing error response...");
  console.log(errorResponse);
  console.log(`\n${"-".repeat(50)}`);
  throw errorResponse;
}

function getErrorObject(internalError, statusCode, message) {
  const userFacingError = {},
    error = {};
  
    userFacingError.statusCode = statusCode;
    userFacingError.message = message;

    error.userFacingError = userFacingError;

    if(internalError) {
      error.internalError = internalError;
    }

    return error;
}

exports.sendErrorResponse = sendErrorResponse;
exports.getErrorObject = getErrorObject;
