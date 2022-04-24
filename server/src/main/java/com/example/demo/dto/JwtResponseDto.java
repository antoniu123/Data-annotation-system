package com.example.demo.dto;

public class JwtResponseDto {
	private String token;

	public JwtResponseDto(String accessToken) {
		this.token = accessToken;
	}

	public String getToken() {
		return this.token;
	}

	public void setToken(String token) {
		this.token = token;
	}

}
