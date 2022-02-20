package com.example.demo.dto;

import javax.validation.constraints.*;

public class ReplacePasswordRequestDto {

    @NotBlank
    @Size(min = 6, max = 40)
    private String password;

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
