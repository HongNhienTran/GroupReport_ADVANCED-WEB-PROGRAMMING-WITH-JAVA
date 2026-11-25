package com.sweetlab.backend.exception;

import org.springframework.http.HttpStatus;

/**
 * Exception thrown when a client request is malformed or violates business rules.
 */
public class BadRequestException extends AppException {

    public BadRequestException(String message) {
        super(HttpStatus.BAD_REQUEST, message);
    }
}
