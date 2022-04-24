package com.example.demo.dto;

public class ProjectDetailDto {
	private Long id;
	private ProjectDto project;
	private DocumentDto document;
	private String name;
	private String description;
	private String subscriberUsername;

	public ProjectDetailDto(Long id, ProjectDto project, DocumentDto document, String name, String description, String subscriberUsername) {
		this.id = id;
		this.project = project;
		this.document = document;
		this.name = name;
		this.description = description;
		this.subscriberUsername = subscriberUsername;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public ProjectDto getProject() {
		return project;
	}

	public void setProject(ProjectDto project) {
		this.project = project;
	}

	public DocumentDto getDocument() {
		return document;
	}

	public void setDocument(DocumentDto document) {
		this.document = document;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public String getSubscriberUsername() {
		return subscriberUsername;
	}

	public void setSubscriberUsername(String subscriberUsername) {
		this.subscriberUsername = subscriberUsername;
	}
}
