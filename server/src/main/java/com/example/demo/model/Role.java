package com.example.demo.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "ROLES")
public class Role {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;

	@Column(name = "NAME", nullable = false)
	@Enumerated(EnumType.STRING)
	private DocumentRole name;

	public Role() {

	}

	public Role(Integer id, DocumentRole name) {
		this.id = id;
		this.name = name;
	}

	/**
	 * @return Integer return the id
	 */
	public Integer getId() {
		return id;
	}

	/**
	 * @param id the id to set
	 */
	public void setId(Integer id) {
		this.id = id;
	}

	/**
	 * @return ERole return the name
	 */
	public DocumentRole getName() {
		return name;
	}

	/**
	 * @param name the name to set
	 */
	public void setName(DocumentRole name) {
		this.name = name;
	}

}