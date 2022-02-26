package com.example.demo.dto;

public class ProjectDetailDto {
	private Long id;
	private DocumentDto documentDto;
	private String name;
	private String description;
	private String subscriberUsername;

	public ProjectDetailDto(Long id, ProjectDto projectDto, DocumentDto documentDto, String name, String description, String subscriberUsername) {
		this.id = id;
		this.documentDto = documentDto;
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

	public DocumentDto getDocumentDto() {
		return documentDto;
	}

	public void setDocumentDto(DocumentDto documentDto) {
		this.documentDto = documentDto;
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
