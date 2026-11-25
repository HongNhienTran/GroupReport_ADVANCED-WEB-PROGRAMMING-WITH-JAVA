package com.sweetlab.backend.exception;

import org.springframework.http.HttpStatus;

/**
 * Exception thrown when authentication is missing or invalid.
 */
public class UnauthorizedException extends AppException {

    public UnauthorizedException(String message) {
        super(HttpStatus.UNAUTHORIZED, message);
    }
}
