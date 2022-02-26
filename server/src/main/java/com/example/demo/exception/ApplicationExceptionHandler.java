package com.example.demo.exception;

import com.example.demo.dto.MessageResponseDto;
import com.example.demo.exception.model.FieldError;
import com.example.demo.exception.model.ValidationErrorResponse;
import com.google.common.collect.ImmutableList;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Comparator;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@RestControllerAdvice
public class ApplicationExceptionHandler {

    private static final Logger LOG = LoggerFactory.getLogger(ApplicationExceptionHandler.class);

    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ValidationErrorResponse validationException(final MethodArgumentNotValidException exception) {
        final List<FieldError> errorMappingFields = exception.getBindingResult().getFieldErrors().stream()
                .map(f -> new FieldError(f.getField(), ImmutableList.of(f.getDefaultMessage())))
                .sorted(Comparator.comparing(FieldError::getFieldName)).collect(Collectors.toList());
        LOG.warn(String.format("Validation error -> %s", errorMappingFields.toString()));
        return new ValidationErrorResponse(errorMappingFields, "ValidationError");
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<MessageResponseDto> generalException(Exception exception) {
        if (Objects.nonNull(exception.getMessage()) && (exception.getMessage().contains("Connection reset by peer")
                || exception.getMessage().contains("Broken pipe"))) {
            // that is not an interest exception because on video playing
            // from time to time client reset connection or pipe may be broken
            LOG.info(exception.getMessage());
            return null;
        }
        LOG.warn(String.format("General error -> %s", exception.getMessage()));
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .contentType(MediaType.APPLICATION_JSON)
                .body(new MessageResponseDto(exception.getMessage()));
    }

}
