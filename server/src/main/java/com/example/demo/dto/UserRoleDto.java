package com.example.demo.dto;

import javax.validation.constraints.NotBlank;

public class UserRoleDto {

	@NotBlank
	private Long userId;

	@NotBlank
	private String userRole;

    public UserRoleDto(Long userId, String userRole) {
        this.userId = userId;
		this.userRole = userRole;
    }

	public Long getUserId() {
		return userId;
	}

	public void setUserId(Long userId) {
		this.userId = userId;
	}

	public String getUserRole() {
		return userRole;
	}

	public void setUserRole(String userRole) {
		this.userRole = userRole;
	}
}
