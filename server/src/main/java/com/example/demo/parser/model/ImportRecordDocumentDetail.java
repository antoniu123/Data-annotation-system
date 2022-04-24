package com.example.demo.parser.model;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonIgnoreProperties(ignoreUnknown = true)
public class ImportRecordDocumentDetail {

    private final Double x;

    private final Double y;

    @JsonCreator
    public ImportRecordDocumentDetail(
            @JsonProperty(value = "X") final Double x,
            @JsonProperty(value = "Y") final Double y) {
        this.x = x;
        this.y = y;
    }

    public Double retrieveX() {
        return x;
    }

    public Double retrieveY() {
        return y;
    }
}
