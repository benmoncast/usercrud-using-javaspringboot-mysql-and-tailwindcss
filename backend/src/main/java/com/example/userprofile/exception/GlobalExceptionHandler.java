package com.example.userprofile.exception;

import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.Map;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.multipart.MultipartException;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<Map<String, Object>> handleResourceNotFound(ResourceNotFoundException exception) {
        return error(HttpStatus.NOT_FOUND, exception.getMessage());
    }

    @ExceptionHandler(DuplicateResourceException.class)
    public ResponseEntity<Map<String, Object>> handleDuplicateResource(DuplicateResourceException exception) {
        return error(HttpStatus.CONFLICT, exception.getMessage());
    }

    @ExceptionHandler(FileStorageException.class)
    public ResponseEntity<Map<String, Object>> handleFileStorage(FileStorageException exception) {
        return error(HttpStatus.BAD_REQUEST, exception.getMessage());
    }

    @ExceptionHandler({MethodArgumentNotValidException.class, BindException.class})
    public ResponseEntity<Map<String, Object>> handleValidation(Exception exception) {
        Map<String, String> validationErrors = new LinkedHashMap<>();

        if (exception instanceof MethodArgumentNotValidException methodException) {
            methodException.getBindingResult().getFieldErrors()
                    .forEach(error -> validationErrors.put(error.getField(), error.getDefaultMessage()));
        }

        if (exception instanceof BindException bindException) {
            bindException.getBindingResult().getFieldErrors()
                    .forEach(error -> validationErrors.put(error.getField(), error.getDefaultMessage()));
        }

        return error(HttpStatus.BAD_REQUEST, "Please check the submitted fields.", validationErrors);
    }

    @ExceptionHandler({IllegalArgumentException.class, MultipartException.class})
    public ResponseEntity<Map<String, Object>> handleBadRequest(Exception exception) {
        return error(HttpStatus.BAD_REQUEST, exception.getMessage());
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<Map<String, Object>> handleDataIntegrity(DataIntegrityViolationException exception) {
        return error(HttpStatus.CONFLICT, "A user with the same username or email already exists.");
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleUnexpected(Exception exception) {
        return error(HttpStatus.INTERNAL_SERVER_ERROR, "Something went wrong. Please try again.");
    }

    private ResponseEntity<Map<String, Object>> error(HttpStatus status, String message) {
        return error(status, message, null);
    }

    private ResponseEntity<Map<String, Object>> error(HttpStatus status, String message, Map<String, String> errors) {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("success", false);
        body.put("message", message);
        body.put("status", status.value());
        body.put("timestamp", LocalDateTime.now());

        if (errors != null && !errors.isEmpty()) {
            body.put("errors", errors);
        }

        return ResponseEntity.status(status).body(body);
    }
}
