import {
    NotFoundError,
    ValidationError,
    ForbiddenError,
    DatabaseError,
    ExternalServiceError,
    TimeoutError,
    FileProcessingError,
    ConfigurationError,
    DeveloperError
} from "../exceptions/exceptions.js";

// Success Responses
const SuccessWithoutData = (res) => {
    return res.status(200).send({ status: "Success" });
}

const SuccessWithData = (res, data) => {
    return res.status(200).send({ status: "Success", data: data });
}

// Error Responses
const DefaultErrorResponse = (res, responseCode, error) => {
    return res.status(responseCode).send({ status: error.status, data: error.message });
}

const ExternalServiceErrorResponse = (res, error) => {
    return res.status(500).send({ status: error.status, serviceName: error.serviceName, data: error.message });
}

// Redirect Response
const RedirectResponse = (res, url) => {
    return res.status(302).redirect(url);
}
export default {
    successHandler(res, data = null) {
        if (data) {
            SuccessWithData(res, data);
        } else {
            SuccessWithoutData(res);
        }
    },

    errorHandler(res, error) {
        if (error instanceof NotFoundError) {
            DefaultErrorResponse(res, 404, error);
        } else if (error instanceof ValidationError) {
            DefaultErrorResponse(res, 400, error);
        } else if (error instanceof ForbiddenError) {
            DefaultErrorResponse(res, 403, error);
        } else if (error instanceof DatabaseError) {
            DefaultErrorResponse(res, 500, error);
        } else if (error instanceof ExternalServiceError) {
            ExternalServiceErrorResponse(res, error);
        } else if (error instanceof TimeoutError) {
            DefaultErrorResponse(res, 408, error);
        } else if (error instanceof FileProcessingError) {
            DefaultErrorResponse(res, 500, error);
        } else if (error instanceof ConfigurationError) {
            DefaultErrorResponse(res, 500, error);
        } else if (error instanceof DeveloperError) {
            DefaultErrorResponse(res, 500, error);
        } else {
            DefaultErrorResponse(res, 500, error);
        }
    },

    redirectHandler(res, url) {
        RedirectResponse(res, url);
    }
}