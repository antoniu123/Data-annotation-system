package com.example.demo.exception.model;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

public class FieldError {

    private String fieldName;

    private List<String> errors;

    @JsonCreator
    public FieldError(@JsonProperty("fieldName") final String fieldName, @JsonProperty("errors") List<String> errors) {
        this.fieldName = fieldName;
        this.errors = errors;
    }

    public String getFieldName() {
        return this.fieldName;
    }

    public void setFieldName(String fieldName) {
        this.fieldName = fieldName;
    }

    public List<String> getErrors() {
        return this.errors;
    }

    public void setErrors(List<String> errors) {
        this.errors = errors;
    }

    @Override
    public String toString() {
        return "{" + " fieldName='" + getFieldName() + "'" + ", errors='" + getErrors() + "'" + "}";
    }

}
