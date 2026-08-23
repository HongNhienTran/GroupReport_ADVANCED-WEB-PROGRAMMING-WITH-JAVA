package com.thesweetlabbe.common.enums;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public enum ErrorCode {
    UNCATEGORIZED_EXCEPTION(9999, "Uncategorized error", HttpStatus.INTERNAL_SERVER_ERROR),
    INVALID_KEY(1001, "Invalid message key", HttpStatus.BAD_REQUEST),
    USER_EXISTED(1002, "Email already exists in system", HttpStatus.BAD_REQUEST),
    USER_NOT_EXISTED(1003, "User not found", HttpStatus.NOT_FOUND),
    UNAUTHENTICATED(1004, "Unauthenticated", HttpStatus.UNAUTHORIZED),
    UNAUTHORIZED(1005, "You do not have permission", HttpStatus.FORBIDDEN),
    INVALID_CREDENTIALS(1006, "Invalid email or password", HttpStatus.BAD_REQUEST),
    ACCOUNT_NOT_VERIFIED(1007, "Account has not been verified. Please check your email.", HttpStatus.FORBIDDEN),
    ACCOUNT_BLOCKED(1008, "Account has been blocked", HttpStatus.FORBIDDEN),
    INVALID_TOKEN(1009, "Token is invalid or expired", HttpStatus.BAD_REQUEST),
    TOKEN_EXPIRED(1010, "Token has expired", HttpStatus.BAD_REQUEST),
    INVALID_REQUEST(1011, "Invalid request parameters", HttpStatus.BAD_REQUEST),
    EMAIL_SEND_FAILED(1012, "Failed to send email. Please try again later.", HttpStatus.INTERNAL_SERVER_ERROR),
    RESOURCE_NOT_FOUND(1013, "Resource not found", HttpStatus.NOT_FOUND);

    private final int code;
    private final String message;
    private final HttpStatus statusCode;

    ErrorCode(int code, String message, HttpStatus statusCode) {
        this.code = code;
        this.message = message;
        this.statusCode = statusCode;
    }
}
