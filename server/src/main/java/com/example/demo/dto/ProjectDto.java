package com.example.demo.dto;

public class ProjectDto {
	private Long id;
	private String description;
	private String name;
	private String ownerUsername;

	public ProjectDto(Long id, String description, String name, String ownerUsername) {
		this.id = id;
		this.description = description;
		this.name = name;
		this.ownerUsername = ownerUsername;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getOwnerUsername() {
		return ownerUsername;
	}

	public void setOwnerUsername(String ownerUsername) {
		this.ownerUsername = ownerUsername;
	}
}
