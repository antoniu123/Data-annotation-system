package com.example.demo.dto;

public class PasswordResponseDto {
	private String password;

	public PasswordResponseDto(String password) {
		this.password = password;
	}

	public String getPassword() {
		return this.password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

}
