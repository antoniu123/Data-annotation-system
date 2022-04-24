package com.example.demo.dto;

import java.util.Objects;

public class MessageResponseDto {
	private String message;

	public MessageResponseDto(String message) {
		this.message = message;
	}

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}

	@Override
	public boolean equals(Object o) {
		if (o == this)
			return true;
		if (!(o instanceof MessageResponseDto)) {
			return false;
		}
		MessageResponseDto messageResponseDto = (MessageResponseDto) o;
		return Objects.equals(message, messageResponseDto.message);
	}

	@Override
	public int hashCode() {
		return Objects.hashCode(message);
	}

	@Override
	public String toString() {
		return "{" +
				" message='" + getMessage() + "'" +
				"}";
	}

}
