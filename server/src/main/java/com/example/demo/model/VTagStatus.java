package com.example.demo.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "V_TAG_STATUS")
public class VTagStatus {
	@Id
	@Column(name = "NAME", nullable = false)
	private String type;

	@Column(name = "TAG_STATUS_NUMBERS", nullable = false)
	private Integer value;
}
