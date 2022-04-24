package com.example.demo.dto;

public class ImageDetailDto {

	private Long id;

	private String name;

	private String description;

	private Double x;

	private Double y;

	public ImageDetailDto(Long id, String name, String description, Double x, Double y) {
		this.id = id;
		this.name = name;
		this.description = description;
		this.x = x;
		this.y = y;
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

	public String getDescription() {
		return this.description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public Double getX() {
		return this.x;
	}

	public void setX(Double x) {
		this.x = x;
	}

	public Double getY() {
		return this.y;
	}

	public void setY(Double y) {
		this.y = y;
	}

}
