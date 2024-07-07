// Custom exception class
class CustomError extends Error {
    constructor(status = "Error", message) {
        super(message);
        this.name = this.constructor.name;
        this.status = status;

        // Detect object/array in message (used for authUtils.validateReqBody)
        if (typeof message === "object") {
            this.messages = message;
        }

        Error.captureStackTrace(this, this.constructor);
    }
}

// Exception classes
class DatabaseError extends CustomError {
    constructor(message) {
        super("Database Error", message);
        this.name = this.constructor.name;
    }
}

class NotFoundError extends CustomError {
    constructor(message) {
        super("Not Found Error", message);
        this.name = this.constructor.name;
    }
}

class AuthenticationError extends CustomError {
    constructor(message) {
        super("Authentication Error", message);
        this.name = this.constructor.name;
    }
}

class AuthorizationError extends CustomError {
    constructor(message) {
        super("Authorization Error", message);
        this.name = this.constructor.name;
    }
}

class ForbiddenError extends CustomError {
    constructor(message) {
        super("Forbidden Error", message);
        this.name = this.constructor.name;
    }
}

class UserInputError extends CustomError {
    constructor(message) {
        super("User Input Error", message);
        this.name = this.constructor.name;
    }
}

class ValidationError extends CustomError {
    constructor(message) {
        super("Validation Error", message);
        this.name = this.constructor.name;
    }
}

class ExternalServiceError extends CustomError {
    constructor(serviceName = "External Service", message) {
        super("External Service", message);
        this.serviceName = serviceName;
        this.name = this.constructor.name;
    }
}

class TimeoutError extends CustomError {
    constructor(message) {
        super("Operation Timeout Error", message);
        this.name = this.constructor.name;
    }
}

class FileProcessingError extends CustomError {
    constructor(message) {
        super("File Processing Error", message);
        this.name = this.constructor.name;
    }
}

class ConfigurationError extends CustomError {
    constructor(message) {
        super("Configuration Error", message);
        this.name = this.constructor.name;
    }
}

class DeveloperError extends CustomError {
    constructor(message) {
        super("Developer Error", message);
        this.name = this.constructor.name;
    }
}

export {
    DatabaseError,
    NotFoundError,
    AuthenticationError,
    AuthorizationError,
    ForbiddenError,
    UserInputError,
    ValidationError,
    ExternalServiceError,
    TimeoutError,
    FileProcessingError,
    ConfigurationError,
    DeveloperError
}