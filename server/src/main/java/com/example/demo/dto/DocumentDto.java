package com.example.demo.dto;

public class DocumentDto {

	private Long id;

	private String name;

	private String documentType;

	private String fileName;

	public DocumentDto(Long id, String name, String documentType, String fileName) {
		this.id = id;
		this.name = name;
		this.documentType = documentType;
		this.fileName = fileName;
	}

	public Long getId() {
		return this.id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getName() {
		return this.name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getDocumentType() {
		return this.documentType;
	}

	public void setDocumentType(String documentType) {
		this.documentType = documentType;
	}

	public String getFileName() {
		return this.fileName;
	}

	public void setFileName(String fileName) {
		this.fileName = fileName;
	}

}
