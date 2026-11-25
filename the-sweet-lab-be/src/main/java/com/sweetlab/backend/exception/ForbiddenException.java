package com.sweetlab.backend.exception;

import org.springframework.http.HttpStatus;

/**
 * Exception thrown when an authenticated user lacks permission for an action.
 */
public class ForbiddenException extends AppException {

    public ForbiddenException(String message) {
        super(HttpStatus.FORBIDDEN, message);
    }
}
