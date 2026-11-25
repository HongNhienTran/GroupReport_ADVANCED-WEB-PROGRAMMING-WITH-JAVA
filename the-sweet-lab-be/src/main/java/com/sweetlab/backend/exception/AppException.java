package com.sweetlab.backend.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

/**
 * Base runtime exception carrying an HTTP status for consistent API error responses.
 */
@Getter
public class AppException extends RuntimeException {

    private final HttpStatus status;

    public AppException(HttpStatus status, String message) {
        super(message);
        this.status = status;
    }
}
