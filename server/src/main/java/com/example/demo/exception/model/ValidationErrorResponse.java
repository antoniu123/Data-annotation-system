package com.example.demo.exception.model;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

public class ValidationErrorResponse {

    private List<FieldError> fieldError;

    private String type;

    @JsonCreator
    public ValidationErrorResponse(@JsonProperty("fieldErrors") final List<FieldError> fieldError,
            @JsonProperty("type") final String type) {
        this.fieldError = fieldError;
        this.type = type;
    }

    public List<FieldError> getFieldError() {
        return this.fieldError;
    }

    public void setFieldError(List<FieldError> fieldError) {
        this.fieldError = fieldError;
    }

    public String getType() {
        return this.type;
    }

    public void setType(String type) {
        this.type = type;
    }

    @Override
    public String toString() {
        return "{" + " fieldError='" + getFieldError() + "'" + ", type='" + getType() + "'" + "}";
    }

}
